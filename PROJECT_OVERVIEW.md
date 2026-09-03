# Velixa Project Overview

Velixa is a browser-based communication application for voice calls, video calls, and screen sharing. One person acts as a **host** and shares a room code. Other people join as **participants** by entering the code or scanning a QR code.

The application is designed to avoid accounts, downloads, recordings, and a custom video-storage backend. The host's media stream is sent through WebRTC media connections to the connected viewers.

## What Happens When Someone Uses Velixa

### 1. The landing page opens

The `/` route renders the main screen. It lets a user either:

- Open a new frequency as a host.
- Enter an existing six-character frequency code as a viewer.
- Scan a QR code on touch devices.

The browser checks after mounting whether `navigator.mediaDevices.getDisplayMedia` is available. If it is not available, the host option is hidden because that browser cannot capture a screen.

### 2. A host creates a room

When the host selects **Open a frequency**:

1. `generateRoomCode()` creates a six-character code using a restricted alphabet that avoids confusing characters.
2. The app navigates to `/room/<code>?role=host`.
3. The host's `useHost()` hook creates a PeerJS peer with an ID derived from the room code:

   ```text
   signalroom-<ROOM_CODE>
   ```

4. The host waits for viewers to connect.

A room is therefore represented by a PeerJS identity while the host is online. There is no application database creating or storing rooms.

### 3. A viewer joins

When a viewer submits a code, the app normalizes it by converting it to uppercase, removing non-alphanumeric characters, and limiting it to six characters. The viewer is sent to `/room/<code>` without the host role.

The `useViewer()` hook then:

1. Creates a temporary PeerJS peer with a generated ID.
2. Connects to the host's derived ID, `signalroom-<ROOM_CODE>`.
3. Shows connection progress in the viewer dashboard.
4. Waits for the host to send a media call.

A viewer can also arrive through the host's generated join URL or QR code. Those both point to the same room route.

### 4. The host starts broadcasting

The host clicks **Go Live**. The browser opens its native screen-sharing permission dialog through:

```ts
navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true,
});
```

The host can select a screen, window, or tab. Velixa then builds a new `MediaStream` containing:

- The selected display's video track.
- A mixed audio track, when available.

For audio, Velixa attempts to capture the microphone with `getUserMedia()`. If both display audio and microphone audio are available, it mixes them with the Web Audio API before adding the result to the outgoing stream.

Each connected viewer receives a separate PeerJS media call. If a new viewer joins while broadcasting is already active, the host immediately calls that viewer with the current stream.

### 5. The viewer receives the broadcast

The viewer answers the incoming media call. When the stream arrives, `ViewerDashboard` assigns it to an HTML `<video>` element through `video.srcObject`.

The viewer can then:

- Mute or unmute playback.
- Put the video into fullscreen mode.
- See whether the host is still live.

When the host stops sharing, closes the room, or ends the captured video track from the browser's sharing controls, the media tracks and calls are closed. Viewers return to a connected or disconnected state depending on the connection that remains.

## Connection Architecture

There are two related parts to the connection:

```text
Host browser                         Viewer browser
-------------                        ---------------
PeerJS peer  <--- signaling --->     PeerJS peer
     |                                      |
     +------ WebRTC media call ------------+
            screen video + mixed audio
```

- **PeerJS** provides the peer identity, connection setup, and event handling.
- **WebRTC** carries the live audio/video media between browsers.
- The Velixa application does not upload a recording or render a video stream from a server.
- PeerJS infrastructure is still required for peer discovery/signaling, and WebRTC connectivity can depend on network and NAT conditions.

The phrase “peer-to-peer” applies to the media connection. It does not mean that no network service is involved at all: PeerJS signaling and the WebRTC connection process still need network access.

## Connection States

The shared `ConnState` type is used by both host and viewer screens:

| State          | Meaning                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `initializing` | The PeerJS instance is being created.                                  |
| `waiting`      | The peer is available but no active participant or broadcast is ready. |
| `connected`    | A host and viewer have established their data connection.              |
| `live`         | Screen media is actively being sent or received.                       |
| `error`        | PeerJS, validation, permissions, or network setup failed.              |
| `disconnected` | A viewer lost the host connection or the host went off air.            |

The status bar and dashboards translate these technical states into user-facing labels such as `Opening`, `Standby`, `Linked`, `Live`, and `Receiving`.

## Routes

| Route                     | Purpose                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| `/`                       | Create a room, join a room, or open the QR scanner on supported touch devices. |
| `/room/:roomId?role=host` | Host dashboard for a specific six-character room.                              |
| `/room/:roomId`           | Viewer dashboard for a specific six-character room.                            |
| `/about`                  | Project and creator information.                                               |
| `/help`                   | Host and viewer usage instructions.                                            |

The room route validates the optional `role` search parameter with Zod. An invalid room code is rejected and redirected to the landing page.

## Important Source Files

```text
src/
├── routes/
│   ├── __root.tsx        App shell, navigation, metadata, and error boundaries
│   ├── index.tsx         Landing page and create/join actions
│   ├── room.$roomId.tsx  Host/viewer room selection and room status
│   ├── about.tsx         About page
│   └── help.tsx          Help page
├── hooks/
│   └── usePeerConnection.ts  PeerJS, WebRTC, media capture, and cleanup
├── components/
│   ├── HostDashboard.tsx     Host controls, viewer count, code, and QR link
│   ├── ViewerDashboard.tsx   Video playback and viewer controls
│   ├── StatusBar.tsx          Room, role, and connection status
│   ├── QrScanner.tsx          Camera-based room-code scanning
│   ├── DeviceSchematic.tsx    Landing-page visual connection schematic
│   └── Waveform.tsx            Connection-state visual indicator
├── lib/
│   └── roomCode.ts             Code generation, normalization, and PeerJS ID mapping
├── router.tsx                  TanStack Router creation
├── start.ts                    TanStack Start configuration and middleware
└── server.ts                   Server entry and SSR error handling
```

`src/routeTree.gen.ts` is generated by TanStack Router. It should not be edited manually.

## Technology Stack

- React 19 for the interface.
- TypeScript for application code and types.
- TanStack Router for file-based routing.
- TanStack Start for the application shell and server-side rendering integration.
- Vite for development and production builds.
- Tailwind CSS for styling.
- PeerJS for peer discovery and WebRTC connection management.
- WebRTC, `getDisplayMedia`, `getUserMedia`, and the Web Audio API for live media.
- `html5-qrcode` for QR scanning.
- `qrcode.react` for generating host join QR codes.
- Bun as the preferred package manager and runtime.

## Running the Project

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun dev
```

Run the production build:

```bash
bun run build
```

Run linting:

```bash
bun run lint
```

The project also supports npm equivalents such as `npm install`, `npm run dev`, and `npm run build`.

## Browser and Network Requirements

- Screen sharing requires a browser that supports `getDisplayMedia`.
- Screen sharing normally requires a secure context, such as HTTPS or localhost.
- A desktop browser is recommended for hosts. Mobile browsers are treated as viewer-oriented because screen capture support is limited.
- Microphone audio is optional. The host can still broadcast display video if microphone permission is denied or unavailable.
- Participants need network access to PeerJS signaling and WebRTC infrastructure.
- A host room exists only while its host peer is available. There is no persistent room registry.
- The host's browser is responsible for capturing and sending the media, so performance and upload bandwidth affect the viewing experience.

## Privacy and Security Boundaries

Velixa currently has no user accounts, recording feature, or application-level video storage. Room codes are short and are intended to be shared with the people who should join the room.

A room code is not an authentication mechanism. Anyone who obtains a valid code may attempt to join while the host is online. The application also depends on third-party PeerJS/WebRTC networking, so the absence of a Velixa media server should not be interpreted as complete end-to-end privacy from every network service involved in connection setup.

## Cleanup Behavior

Both connection hooks clean up when the room component unmounts or the user disconnects. Cleanup includes:

- Stopping display, microphone, and mixed-media tracks.
- Closing active media calls and data connections.
- Closing the audio context.
- Destroying the PeerJS instance.
- Clearing local connection references.

This prevents a stopped broadcast from continuing to capture the screen or microphone after the room is left.
