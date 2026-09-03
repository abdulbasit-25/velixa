# Velixa — Add Real-Time Calling & Screen Sharing

Transform the existing **Viorax** project into a unified real-time communication application called **Velixa**.

First, analyze the entire existing codebase and understand how the current room, PeerJS, WebRTC, screen-sharing, QR, routing, and media lifecycle work. **Do not rewrite the application from scratch.** Extend the existing architecture and reuse what is already working.

## Core Goal

Velixa should allow users to enter a room and choose what they want to do:

- **Voice Call**
- **Video Call**
- **Screen Share**

The room should support switching between these communication modes without creating a completely separate system for each one.

The existing screen-sharing functionality must continue working.

## Important Constraint

**Do not add new technologies, frameworks, communication services, or unnecessary dependencies.**

Use only the technologies and infrastructure already present in the project, especially:

- React
- TypeScript
- TanStack Router
- PeerJS
- WebRTC
- getUserMedia
- getDisplayMedia
- Web Audio API
- Existing QR functionality
- Existing Vite/TanStack Start setup
- Existing Bun setup
- Existing styling system

Do not introduce another WebRTC library, Socket.IO, Firebase, Twilio, Agora, Daily, LiveKit, or another calling provider.

PeerJS/WebRTC remains the communication layer.

---

# Rebrand

The application is no longer called **Viorax**.

The new product name is:

**Velixa**

Replace existing user-facing branding throughout the application:

- Viorax → Velixa
- Page titles
- Metadata
- Navigation
- Landing page
- About page
- Help page
- Room UI
- Empty states
- Error messages
- Browser-visible branding
- Any visible explanatory text

Also inspect the codebase for hard-coded Viorax references and replace them appropriately.

Do not blindly rename internal variables if doing so could break the existing architecture. Prioritize the user-facing rebrand while keeping functionality stable.

---

# Room Experience

Keep the existing room-code architecture.

A user should still be able to create or join a room using the existing room-code system and QR functionality.

After entering a room, provide a clear communication interface where the user can choose:

### Voice Call

Audio-only communication.

### Video Call

Camera + microphone communication.

### Screen Share

Share screen, window, or browser tab.

The UI should make these options immediately understandable.

Do not make the user understand WebRTC, PeerJS, signaling, ICE, or technical concepts.

---

# Calling Behavior

Implement real-time peer-to-peer calling using the existing PeerJS/WebRTC architecture.

## Voice Call

Use:

`navigator.mediaDevices.getUserMedia({ audio: true })`

The user should be able to:

- Start a voice call
- Accept an incoming call
- Reject an incoming call
- End the call
- Mute/unmute microphone
- See who they are connected with
- See connection status

Audio should be transmitted through the existing WebRTC/PeerJS mechanism.

Do not build a separate audio backend.

---

# Video Call

Use:

`navigator.mediaDevices.getUserMedia({ audio: true, video: true })`

The user should be able to:

- Start video call
- Accept incoming video call
- Reject call
- End call
- Mute/unmute microphone
- Enable/disable camera
- See local video preview
- See remote video
- Switch between appropriate call states

Handle camera/microphone permission failures gracefully.

If microphone permission is denied, explain the problem without crashing the room.

If camera permission is denied, allow the user to fall back to audio where possible.

---

# Screen Sharing

Preserve the existing screen-sharing implementation.

Continue using:

`navigator.mediaDevices.getDisplayMedia()`

The user should have an obvious **Share Screen** option.

When screen sharing begins:

- Show the shared screen to the other participant(s)
- Keep microphone audio available when permitted
- Allow stopping screen sharing
- Detect when the browser's native "Stop sharing" control is used
- Clean up tracks correctly
- Return the user to the appropriate room/call state

If the existing implementation already mixes microphone and display audio, preserve that behavior.

Do not unnecessarily replace the existing media/audio mixing logic.

---

# Unified Call Controls

Create a clean call-control area containing controls such as:

- Microphone
- Camera
- Screen Share
- End Call
- Switch/Change Mode where appropriate

Only show controls that make sense for the current mode.

For example:

Voice call:

`Microphone | Video | Screen Share | End`

Video call:

`Microphone | Camera | Screen Share | End`

Screen sharing:

`Microphone | Camera/Call | Stop Sharing | End`

Use the project's existing component and styling conventions rather than introducing a new UI framework.

---

# Incoming Calls

When another participant attempts to call the user, display an incoming-call state.

Clearly show:

- Incoming voice call
- Incoming video call
- Caller/participant information when available
- Accept
- Decline

Do not automatically enable the microphone or camera without user interaction.

Respect browser permission requirements.

---

# Room States

Expand the existing connection state system where necessary.

The application should clearly distinguish between states such as:

- Initializing
- Waiting
- Connected
- Incoming Call
- Calling
- In Call
- Screen Sharing
- Disconnected
- Error

Avoid exposing technical WebRTC states directly to users.

Translate technical states into simple UI language.

---

# Multiple Participants

Analyze the existing PeerJS architecture and determine the safest way to support multiple participants without breaking the current host/viewer behavior.

If the current architecture is fundamentally one-host-to-many-viewers, preserve compatibility while extending it carefully.

Do not introduce a media server.

If true multi-party calling cannot be reliably achieved with the current architecture without introducing additional infrastructure, do not invent a fake implementation. Build the strongest supported calling flow using the existing peer architecture and clearly keep the architecture extensible.

---

# Existing Screen-Share Compatibility

The current application already has:

- Room codes
- Host/viewer roles
- PeerJS identities
- WebRTC media calls
- Screen capture
- Microphone capture
- Audio mixing
- QR generation
- QR scanning
- Connection states
- Cleanup logic

Preserve these capabilities.

Do not break:

- `/`
- `/room/:roomId`
- `/room/:roomId?role=host`
- QR joining
- Room code generation
- Existing PeerJS identity mapping
- Existing screen-sharing flow
- Existing cleanup behavior

Modify existing hooks/components where appropriate instead of duplicating functionality.

---

# Architecture

Inspect `src/hooks/usePeerConnection.ts` first.

Determine whether it should be extended to manage:

- Audio streams
- Video streams
- Screen streams
- Incoming calls
- Outgoing calls
- Media track replacement
- Call lifecycle
- Peer cleanup
- Microphone state
- Camera state
- Screen-share state

If necessary, refactor the hook into smaller internal pieces, but keep the public API clean and avoid unnecessary architectural complexity.

Reuse existing media tracks and RTCPeerConnection/PeerJS connections whenever possible.

Do not create duplicate peer connections unnecessarily.

---

# UX

Make Velixa feel like a polished modern communication product rather than a developer demo.

The interface should immediately communicate:

**Create room → Join room → Choose how to communicate → Connect**

The user should not need to understand what PeerJS or WebRTC is.

Keep the UI simple, responsive, and intuitive.

Support desktop and mobile layouts where browser capabilities allow it.

Respect the project's existing visual language, but update it so it feels appropriate for the new **Velixa** identity.

Do not copy the old Viorax branding.

---

# Error Handling

Handle:

- Camera permission denied
- Microphone permission denied
- Screen-sharing permission denied
- Screen sharing cancelled
- Peer connection failure
- Peer disconnected
- Room unavailable
- Invalid room code
- Browser does not support required media APIs
- Network failure
- Call rejected
- Call ended
- Remote peer leaving

Never leave the UI stuck in a fake "Calling..." or "Live" state.

Always clean up:

- Media tracks
- PeerJS calls
- Data connections
- Audio contexts
- Peer instances
- Event listeners

Use the existing cleanup strategy as the baseline.

---

# Security & Privacy

Do not add accounts or persistent user data.

Do not add recording.

Do not upload audio/video to an application server.

Keep media peer-to-peer through the existing WebRTC architecture.

Do not claim that room codes provide authentication.

Do not expose unnecessary technical/network information to users.

---

# Implementation Process

Before changing code:

1. Inspect the existing project structure.
2. Understand the current `usePeerConnection.ts`.
3. Understand `HostDashboard`.
4. Understand `ViewerDashboard`.
5. Understand room routing.
6. Understand the existing PeerJS identity scheme.
7. Understand existing screen/audio handling.
8. Understand existing cleanup.
9. Identify the smallest architecture changes required for calling.

Then implement the feature incrementally.

After implementation:

- Run TypeScript checks.
- Run ESLint.
- Run the production build.
- Fix all errors.
- Check that existing screen sharing still works.
- Check voice calling.
- Check video calling.
- Check incoming/outgoing call states.
- Check ending calls.
- Check browser permission failures.
- Check mobile/responsive behavior.
- Search the project for remaining user-facing `Viorax` references.

Do not leave TODO placeholders for core functionality.

The final result should be a functioning **Velixa** real-time communication application where users can enter a room and choose between **voice call, video call, and screen sharing**, all built on the project's existing PeerJS/WebRTC architecture.
