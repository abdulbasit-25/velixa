# Velixa Design System

## 1. Product Direction

Velixa is a lightweight, browser-based real-time communication tool for voice calls, video calls, and screen sharing. It connects people through a short room code and keeps the interaction direct:

> Create a room -> Join the room -> Choose a mode -> Connect

The product should feel private, immediate, and understandable. Users should never need to know about PeerJS, WebRTC, signaling, ICE, or media tracks to complete a task.

### Product personality

- Direct: every screen answers what is happening and what to do next.
- Focused: the room experience prioritizes the active conversation over decoration.
- Human: permission and connection failures use plain language.
- Trustworthy: the UI does not imply recording, accounts, or server-side media storage.
- Technical in texture, not in vocabulary: the visual language may suggest a communications console, but user-facing copy stays simple.

## 2. Visual Theme: Signal Console

Velixa uses a modern signal-console theme: a near-black workspace, quiet graphite panels, warm amber actions, and cool cyan connection indicators. It is inspired by communications equipment and live production tools without becoming retro, noisy, or militaristic.

The theme has three visual layers:

1. **Workspace** - the dark ink background creates focus and reduces glare during long calls.
2. **Surfaces** - graphite panels separate controls, status, QR codes, and media without nested card clutter.
3. **Signals** - amber means an intentional primary action; cyan means a live connection or available link; red means stopping or failure.

Use contrast, spacing, and status labels to establish hierarchy. Do not add ornamental gradients, glowing blobs, stock imagery, or decorative illustrations that compete with live media.

## 3. Color Palette

### Core tokens

| Token          | Hex       | Use                                                        |
| -------------- | --------- | ---------------------------------------------------------- |
| `ink`          | `#0E1116` | App background, media stage backdrop, primary dark surface |
| `panel`        | `#171B22` | Panels, status surfaces, control groups                    |
| `panel-line`   | `#262C36` | Borders, dividers, inactive control outlines               |
| `signal`       | `#F2A93B` | Primary actions, active signal, focus ring, live indicator |
| `link-cyan`    | `#5AC8C8` | Connected state, links, secondary status, QR affordance    |
| `text-primary` | `#E4E7EC` | Main text, headings, important values                      |
| `text-muted`   | `#8B93A1` | Supporting copy, labels, inactive controls                 |
| `destructive`  | `#E5484D` | End call, stop sharing, declined call, critical errors     |
| `white`        | `#FFFFFF` | Text on destructive actions and QR background              |

### Color rules

- Amber is reserved for actions that start, confirm, or represent an active signal.
- Cyan is informational and connective. It must not be used for destructive actions.
- Red is reserved for ending, declining, or explaining a failure. Do not use red as general decoration.
- Text-primary must remain readable on `ink` and `panel`.
- Borders should be visible but quiet. Prefer `panel-line` over shadows.
- Keep the interface multi-tone: do not make every element amber or cyan.
- Never rely on color alone. Pair state colors with text, icons, or a shape change.

### State mapping

| User state     | Color           | Example copy                   |
| -------------- | --------------- | ------------------------------ |
| Initializing   | Muted           | `Opening room...`              |
| Waiting        | Muted           | `Waiting for someone to join.` |
| Connected      | Cyan            | `Participant connected`        |
| Incoming call  | Amber           | `Incoming video call`          |
| Calling        | Amber           | `Calling...`                   |
| In call        | Amber plus cyan | `Video call active`            |
| Screen sharing | Amber           | `Screen sharing active`        |
| Disconnected   | Muted or red    | `Participant disconnected`     |
| Error          | Red             | `Camera access was blocked.`   |

## 4. Typography

### Families

- **Primary UI font:** Inter, used for headings, body copy, buttons, and readable messages.
- **Operational font:** JetBrains Mono, used for room codes, state labels, metadata, timestamps, and compact uppercase labels.

These fonts are already part of the application theme. Do not replace them with a default system-only stack unless the font cannot load.

### Type hierarchy

| Level         | Treatment                                         | Use                                |
| ------------- | ------------------------------------------------- | ---------------------------------- |
| Display       | 36-56px, semibold, tight line height              | Landing headline only              |
| Page heading  | 28-40px, semibold                                 | About, help, room section heading  |
| Panel heading | 18-24px, semibold                                 | Main action and media panel titles |
| Body          | 14-16px, regular, relaxed line height             | Explanations and states            |
| Label         | 10-12px, JetBrains Mono, uppercase, wide tracking | Status, role, mode, metadata       |
| Room code     | 48-72px, JetBrains Mono, wide tracking            | Host room identity                 |

Do not use display-sized text inside compact controls. Avoid negative letter spacing. Let long labels wrap rather than overflow.

## 5. Layout Principles

### App shell

- Use a full-width dark workspace with a quiet top navigation or room status bar.
- Keep the active content in a readable constrained region while allowing media to use available width.
- Use a two-column layout on wide screens when a QR/share panel is useful; stack it below the main content on small screens.
- Sections are unframed bands or layouts. Use cards only for repeated items, dialogs, media frames, and genuinely framed tools.
- Keep border radius restrained: use the existing small radius, generally no more than 6-8px.

### Spacing scale

Use a consistent 4px base scale:

- 4px: icon-to-label and compact internal spacing
- 8px: control gaps and small groups
- 12px: button padding and status rows
- 16px: standard panel padding
- 24px: section gaps and larger controls
- 32px: major content groups
- 48px+: landing-page breathing room

### Media stage

- The remote media area is the visual anchor of a call or screen-share session.
- Use a stable aspect ratio, normally 16:9, so loading and active states do not shift the page.
- Use `object-contain` for screen sharing so desktop content is not cropped.
- Use a black or ink stage behind media to make letterboxing intentional.
- Show a clear empty state over the stage while waiting; never leave a blank rectangle with no explanation.

## 6. Room UX

### Landing page

The first viewport should make the two paths obvious:

- **Create room:** one primary amber action.
- **Join room:** room-code input with QR scanning on supported touch devices.

Supporting copy should explain the outcome, not the implementation:

- Good: `Start a voice call, video call, or screen share with a room code.`
- Avoid: `PeerJS signaling creates a temporary WebRTC identity.`

Room codes should be visually prominent, easy to copy, and never presented as authentication. The UI may say `Share this code with your participant`, but must not promise security from possession of the code.

### Room entry

After joining, show:

1. The room identity.
2. The current connection state.
3. The available communication modes.
4. The next useful action.

Do not show technical network states directly. Translate them into short human labels such as `Connecting`, `Ready`, `Incoming call`, `In call`, and `Disconnected`.

### Mode selection

Use a compact segmented control or clearly separated action buttons for:

- Voice call
- Video call
- Share screen

Each option should include a familiar icon and a short label. The selected mode must have a strong visual state. Do not hide the screen-share action just because voice or video is active; instead, disable or explain unavailable transitions when the current media lifecycle cannot support them.

## 7. Calling UX

### Voice call

Show:

- Participant connection status
- Microphone state
- End call action
- A simple audio activity indicator when available

The remote audio may use the existing media element. The participant should understand that the call is active even when there is no video surface.

### Video call

Show:

- Remote video as the primary stage
- Local preview in a stable corner or a dedicated preview region
- Microphone toggle
- Camera toggle
- End call

Keep the local preview small enough not to cover important remote content. Preserve a stable frame so toggling the camera does not resize the layout.

### Screen sharing

Show:

- `Screen sharing active`
- A visible stop-sharing control
- Microphone status where microphone audio is available
- A message when the browser's native stop-sharing control ends the share

When screen sharing ends, return to the connected room state or the active call state. Never leave the UI showing `Live` after the display track has ended.

### Incoming calls

An incoming call is a deliberate decision point. The UI must:

- State the mode: `Incoming voice call` or `Incoming video call`.
- Identify the caller as a room participant when no name is available.
- Provide `Accept` and `Decline` actions.
- Avoid requesting camera or microphone permission before acceptance.
- Return to the ready state after decline.

Use amber for the incoming state and red only for the decline action.

## 8. Controls and Components

### Buttons

- Primary action: amber fill, ink text, clear icon.
- Secondary action: panel or transparent background with a panel-line border.
- Destructive action: red border or fill, white text when filled.
- Icon-only buttons are appropriate for familiar controls such as mute, camera, fullscreen, and close. Add an accessible label and tooltip for unfamiliar icons.
- Every button needs a visible focus state using the signal color.
- Use `type="button"` for non-submit controls.

### Status bar

The room status bar should contain:

- Velixa identity and route back home
- Room code
- Role when relevant
- Human-readable connection state
- Disconnect action

Keep it compact and scannable. Do not place a large heading or promotional copy in the status bar.

### QR panel

- Use a white QR surface with dark modules for reliable scanning.
- Keep sufficient quiet space around the QR code.
- Show a copyable fallback link or code below it.
- On mobile, prioritize the room code and scanner over a large QR display.

### Toasts and errors

Toasts should report events, not duplicate every visible state. Use them for:

- Participant joined or left
- Call started or ended
- Screen share cancelled
- Permission failure

Persistent errors belong near the affected control or media stage. Always explain the recovery action:

- `Microphone access is blocked. Allow microphone access in your browser settings, then try again.`
- `Screen sharing was cancelled. Choose a screen or window to try again.`

## 9. Responsive Behavior

### Desktop

- Use the wide two-column room layout when the QR panel adds value.
- Keep primary controls in one readable row when space allows.
- Let the media stage grow, but preserve its aspect ratio.

### Tablet

- Reduce side padding and allow controls to wrap.
- Keep the media stage above the control row.
- Preserve touch targets and avoid dense metadata.

### Mobile

- Stack room content vertically.
- Use full-width primary actions.
- Keep controls large enough for touch, with at least a 44px effective target.
- Allow button labels to wrap naturally; do not clip or force horizontal overflow.
- Put the QR panel below the main task.
- Treat mobile as viewer-friendly where browser screen capture is unavailable, and explain that limitation without making the room feel broken.

## 10. Motion and Feedback

Motion should communicate state changes:

- Fade or stagger the landing-page content on first load.
- Use a restrained pulse for a live indicator.
- Animate waveform bars only while audio or a live signal is active.
- Use short transitions for button hover, focus, and state changes.
- Avoid constant floating, bouncing, parallax, or decorative animations during a call.
- Respect `prefers-reduced-motion` and disable nonessential animation when requested.

## 11. Accessibility

- Use semantic landmarks: one main content region, headings in order, labeled forms, and labeled navigation.
- Pair every icon-only control with `aria-label` and a tooltip where useful.
- Do not communicate status through color alone.
- Maintain visible keyboard focus.
- Keep text contrast readable on both ink and panel surfaces.
- Announce important incoming-call and connection changes through an appropriate live region when possible.
- Ensure video controls work by keyboard and that video elements use `playsInline`.
- Provide useful labels for room code input and QR scanning.
- Do not autoplay media with audible sound before user interaction when browser policy may block it.

## 12. Content Voice

Use short, calm, concrete sentences. Prefer the user's task over technical terminology.

### Use

- `Ready to connect`
- `Incoming video call`
- `Allow camera and microphone access to accept the call.`
- `Screen sharing ended.`
- `Participant disconnected.`
- `Try again`

### Avoid

- `ICE negotiation failed`
- `Peer unavailable`
- `Transmission protocol error`
- `Authentication token`
- `Your room is secure`

The brand can retain the signal vocabulary in small labels such as `Signal status`, `Room code`, and `Connected`, but the main instruction must always be plain English.

## 13. Privacy and Trust Language

Velixa may explain that media is sent directly between connected browsers and that the product does not provide recording or accounts. It must also be honest:

- Room codes are not authentication.
- Anyone with the room code may attempt to join while the host is present.
- PeerJS signaling and WebRTC connectivity still require network access.
- Do not claim absolute privacy or guaranteed connection quality.

## 14. Implementation Guardrails

- Reuse the existing Tailwind tokens in `src/styles.css`.
- Reuse Lucide icons and the existing QR components.
- Keep PeerJS and WebRTC as the communication layer.
- Keep media acquisition and cleanup inside the existing connection hook or small helpers owned by it.
- Do not introduce a media server, recording, accounts, or another calling provider.
- Keep host/viewer compatibility and existing room URLs intact.
- Every new media state needs a visible UI state and a cleanup path.
- Permission denial, cancellation, remote departure, and network failure must return the UI to a truthful state.
- Prefer small, testable components over duplicated host and viewer media logic.

## 15. Definition of Done for UI/UX

A feature is ready when:

- A first-time user can create or join a room without understanding WebRTC.
- Voice, video, and screen sharing are visibly distinct and easy to choose.
- Incoming calls can be accepted or declined before media permission is requested.
- Active controls show the current microphone, camera, share, and end states.
- The interface remains usable on desktop and mobile widths.
- Every failure explains what happened and what the user can do next.
- No screen, call, or status remains visually active after its underlying media or peer connection ends.
- The visual system still reads as Velixa: dark workspace, amber action, cyan connection, restrained console texture.
