# VELIXA — COMPLETE UI REDESIGN & REBRANDING PROMPT

You are working on an existing browser-based real-time communication application currently branded as **Viorax**.

The project is being officially rebranded and redesigned as:

# VELIXA

Velixa is a lightweight browser-based communication tool for:

- Voice calls
- Video calls
- Screen sharing
- Room-code based joining
- QR-based room joining
- Peer-to-peer browser communication

The existing PeerJS/WebRTC communication functionality is already implemented and working.

Your task is to **completely redesign and rebrand the existing frontend into Velixa** while preserving the existing application architecture and functionality.

---

# 1. CRITICAL RULE — DO NOT BREAK FUNCTIONALITY

This is primarily a **UI/UX redesign and rebranding task**, not a networking rewrite.

Before changing anything:

1. Inspect the existing project structure.
2. Identify the current:
   - Routing
   - Room creation flow
   - Room joining flow
   - QR joining
   - Host dashboard
   - Viewer dashboard
   - PeerJS connection hook
   - Voice call functionality
   - Video call functionality
   - Screen sharing
   - Media cleanup
   - Existing Tailwind/global CSS
   - Existing Lucide icons
3. Understand how the current UI communicates with the existing `usePeerConnection` hook.
4. Preserve all working communication behavior.

DO NOT:

- Replace PeerJS.
- Replace WebRTC.
- Introduce a media server.
- Introduce Socket.IO unless already required by the project.
- Introduce another calling provider.
- Introduce authentication unless already present.
- Introduce recording.
- Introduce a database just for the redesign.
- Change existing room URLs unnecessarily.
- Break QR joining.
- Break screen sharing.
- Remove host/viewer roles.
- Rewrite the application architecture simply for visual reasons.

The goal is:

> **Same working communication system + completely new Velixa visual identity and UX.**

---

# 2. BRAND CHANGE

Replace the old **Viorax** identity with **Velixa** throughout the application.

Search the entire project for:

- Viorax
- VIORAX
- viorax
- old logo text
- old page titles
- old metadata
- old favicon references
- old browser titles
- old descriptions
- old UI copy
- old placeholder text
- old branding comments where relevant

Replace user-facing branding with:

# Velixa

Do not leave visible Viorax references anywhere in the application.

Also update:

- `<title>`
- Meta description
- Navbar/logo
- Landing page
- Room page
- Host interface
- Viewer interface
- Error screens
- Loading states
- Empty states
- Buttons
- Footer if present
- Browser-facing copy where appropriate

After the redesign, run a project-wide search and confirm there are no remaining user-visible `Viorax` references.

---

# 3. VELIXA PRODUCT PERSONALITY

Velixa should feel:

### Direct

Every screen should clearly answer:

> What is happening?

and:

> What should I do next?

### Focused

The active conversation should always be the visual priority.

### Human

Use simple language.

Never expose technical WebRTC terminology to normal users.

### Trustworthy

Do not imply:

- Recording
- Accounts
- Server-side media storage
- Guaranteed privacy
- Guaranteed connection quality

### Technical in visual texture, NOT vocabulary

The interface can look like a sophisticated communications console, but users should never need to understand:

- PeerJS
- WebRTC
- ICE
- signaling
- media tracks
- peer IDs

---

# 4. VISUAL DIRECTION

Use a visual language called:

# SIGNAL CONSOLE

The interface should feel like a modern communications console.

Think:

- Near-black workspace
- Graphite panels
- Thin borders
- Amber primary actions
- Cyan connection indicators
- Restrained red destructive states
- Operational typography
- Large media stages
- Compact status labels
- Minimal decoration

The design must feel:

- Modern
- Premium
- Professional
- Calm
- Technical
- Lightweight
- Trustworthy

It should NOT feel:

- Gamer-like
- Militaristic
- Retro
- Cyberpunk
- Overly futuristic
- SaaS-template-like
- Neon-heavy

---

# 5. COLOR SYSTEM

Replace the existing visual palette with these exact Velixa tokens.

```css
:root {
  --ink: #0E1116;
  --panel: #171B22;
  --panel-line: #262C36;

  --signal: #F2A93B;
  --link-cyan: #5AC8C8;

  --text-primary: #E4E7EC;
  --text-muted: #8B93A1;

  --destructive: #E5484D;
  --white: #FFFFFF;
}
```

Use the colors consistently.

## Color rules

### Amber

`#F2A93B`

Use for:

- Primary buttons
- Start call
- Start video
- Start screen sharing
- Active signal
- Incoming call state
- Calling state
- Focus rings
- Important active controls

Do NOT make the entire application amber.

### Cyan

`#5AC8C8`

Use for:

- Connected
- Ready/available link states
- Connection indicators
- Room/share affordances
- Successful connection
- Secondary information

Never use cyan for destructive actions.

### Red

`#E5484D`

Use only for:

- End call
- Decline
- Stop sharing
- Critical errors
- Failed permission state

Do not use red as decoration.

### Background

Use:

`#0E1116`

as the primary application background and media backdrop.

### Panels

Use:

`#171B22`

for:

- Control groups
- Room panels
- Status areas
- Dialogs
- Framed tools

### Borders

Use:

`#262C36`

Prefer borders instead of large shadows.

---

# 6. REMOVE OLD VISUAL LANGUAGE

Identify and remove/rework old Viorax styling such as:

- Purple gradients
- Bright blue primary buttons
- Large glowing backgrounds
- Decorative blobs
- Excessive gradients
- Giant shadows
- Excessively rounded cards
- Excessive border radius
- Random accent colors
- Stock illustrations
- Decorative illustrations
- Excessive floating animations

Do not simply change colors.

The application needs to feel like a **new product**.

---

# 7. TYPOGRAPHY

Use:

### Inter

For:

- Headings
- Body text
- Buttons
- Navigation
- User-facing messages

### JetBrains Mono

For:

- Room codes
- Status labels
- Metadata
- Timestamps
- Role labels
- Mode labels
- Operational information

Example:

```text
ROOM A7K9-X2P4
CONNECTED
HOST
VIDEO CALL
02:41
```

Use uppercase + letter spacing for compact operational labels.

Do not use JetBrains Mono for long body copy.

---

# 8. BORDER RADIUS

Keep the design restrained.

Use approximately:

```css
--radius-sm: 6px;
--radius-md: 8px;
```

Avoid giant pill-shaped UI unless it is specifically appropriate for a compact status/control.

Do not turn every element into a rounded card.

---

# 9. SPACING

Use a 4px spacing system.

```text
4px   compact icon spacing
8px   control gaps
12px  button/status padding
16px  panel padding
24px  section spacing
32px  major groups
48px+ landing-page spacing
```

The interface should breathe.

Do not compress everything into dense dashboard layouts.

---

# 10. LANDING PAGE REDESIGN

Completely redesign the landing page around the Velixa identity.

The first viewport should immediately communicate:

> Start a voice call, video call, or screen share with a room code.

Primary action:

```text
Create room
```

Secondary flow:

```text
Enter room code
[ JOIN ]
```

Suggested structure:

```text
VELIXA

REAL-TIME COMMUNICATION

Talk. Share. Connect.

Start a voice call, video call, or screen share
with a room code.

[ Create room ]

Already have a room?

[ Enter room code ] [ Join ]

VOICE    VIDEO    SCREEN
```

Keep it minimal.

Do not create a huge marketing website.

The application is a communication tool.

---

# 11. HEADER

Create a compact Velixa header.

Example:

```text
VELIXA                         About   Help
```

Inside a room:

```text
VELIXA    ROOM A7K9-X2P4    HOST    ● READY    EXIT
```

The room header should prioritize operational information.

Do not put promotional copy in the room status bar.

---

# 12. ROOM CREATION

After creating a room, clearly show:

```text
ROOM CREATED

Your room is ready.

A7K9-X2P4

Room code

[ Copy ]

Share this code with your participant.

● Waiting for someone to join.
```

Room codes should use JetBrains Mono.

Make them visually prominent.

Do NOT describe room codes as authentication.

Do NOT claim:

> "Your room is secure."

Instead:

> "Share this code with your participant."

---

# 13. QR PANEL

Preserve the existing QR functionality.

Redesign its visual presentation.

Use:

- White QR surface
- Dark QR modules
- Adequate quiet space
- Room code
- Copy action
- Optional share link

Example:

```text
SCAN TO JOIN

┌───────────────┐
│               │
│      QR       │
│               │
└───────────────┘

ROOM A7K9-X2P4

[ Copy room code ]
```

On mobile, prioritize:

1. Room code
2. Join/share action
3. QR

Do not let the QR panel dominate the primary task.

---

# 14. HOST DASHBOARD

Redesign the Host Dashboard as a communication workspace.

Desktop layout:

```text
┌───────────────────────────────────────────────────────┐
│ VELIXA   ROOM A7K9-X2P4   HOST   ● READY       EXIT  │
├───────────────────────────────────────────┬───────────┤
│                                           │           │
│                                           │   ROOM    │
│                                           │           │
│             MEDIA / ROOM                 │    QR     │
│                                           │           │
│                                           │   CODE    │
│                                           │           │
├───────────────────────────────────────────┤           │
│                                           │           │
│ VOICE      VIDEO      SHARE SCREEN        │           │
└───────────────────────────────────────────┴───────────┘
```

Do not create unnecessary nested cards.

The main media/workspace should be visually dominant.

The QR/share panel should be secondary.

---

# 15. VIEWER DASHBOARD

Use the same design language as the Host Dashboard.

Clearly show:

- Room
- Connection state
- Participant state
- Available modes
- Active call
- Controls

Do not create a completely different visual experience for viewers.

Host and viewer should feel like two roles inside the same Velixa product.

---

# 16. MODE SELECTOR

Create a compact mode selector.

Modes:

```text
Voice call
Video call
Share screen
```

Use Lucide icons.

Suggested icons:

- `Mic`
- `Video`
- `MonitorUp`

Example:

```text
┌──────────────┐ ┌──────────────┐ ┌─────────────────┐
│  Mic Voice   │ │ Video Call   │ │  Share screen   │
└──────────────┘ └──────────────┘ └─────────────────┘
```

Selected mode should have a strong amber state.

Inactive modes should use panel/border styling.

Do not hide screen sharing because voice/video is active.

If a transition is unavailable because of the existing media lifecycle, clearly explain why.

---

# 17. ACTIVE VIDEO CALL

This is the most important screen in Velixa.

The remote video should dominate.

Use a stable 16:9 media stage.

Example:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│                   REMOTE VIDEO                       │
│                                                      │
│                                                      │
│                                  ┌──────────────┐    │
│                                  │ LOCAL        │    │
│                                  │ PREVIEW      │    │
│                                  └──────────────┘    │
│                                                      │
│              ● Video call active                    │
└──────────────────────────────────────────────────────┘

        [ Mic ] [ Camera ] [ Fullscreen ] [ End call ]
```

Use:

- `object-contain` for screen sharing
- `playsInline` for video
- Ink/black media background
- Stable aspect ratio
- Small local preview

Do not allow the local preview to cover important remote content.

---

# 18. VOICE CALL UI

Do not display an empty video rectangle for voice calls.

Instead create an audio-focused stage.

Example:

```text
┌───────────────────────────────────────┐
│                                       │
│                 ●                     │
│                                       │
│          ROOM PARTICIPANT             │
│                                       │
│            Voice call                 │
│                                       │
│              02:31                    │
│                                       │
└───────────────────────────────────────┘

       [ Mute ]                [ End call ]
```

If audio activity detection exists, show a restrained activity indicator.

Only animate while audio is active.

---

# 19. SCREEN SHARING UI

Make screen sharing feel like a professional media workspace.

Show:

```text
SCREEN SHARING

● Screen sharing active

┌────────────────────────────────────────────┐
│                                            │
│                SHARED SCREEN               │
│                                            │
└────────────────────────────────────────────┘

[ Microphone ]                     [ Stop sharing ]
```

When browser-native screen sharing stops:

```text
Screen sharing ended.

You're back in the room.
```

Never leave a stale "Live" or "Sharing" state after the underlying display track ends.

---

# 20. INCOMING CALL DIALOG

Create a polished incoming call dialog.

Voice:

```text
INCOMING VOICE CALL

Room participant

The participant wants to start a voice call.

[ Decline ]       [ Accept ]
```

Video:

```text
INCOMING VIDEO CALL

Room participant

The participant wants to start a video call.

[ Decline ]       [ Accept ]
```

Add:

```text
Allow camera and microphone access to accept the call.
```

Important:

DO NOT request microphone/camera permissions before the user accepts.

Accept:

- Amber

Decline:

- Red

---

# 21. CALL CONTROLS

Use Lucide icons.

Recommended controls:

```text
Mic
MicOff
Video
VideoOff
MonitorUp
Phone
PhoneOff
Maximize
Minimize
Copy
QrCode
Users
X
Check
```

Icon-only buttons should have:

- `aria-label`
- tooltip where useful
- visible keyboard focus

All non-submit buttons must use:

```html
type="button"
```

Controls should have at least a 44px effective touch target on mobile.

---

# 22. STATUS SYSTEM

Create one consistent connection-status component.

Possible states:

```text
Opening room...
Waiting for someone to join.
Ready to connect
Connecting
Participant connected
Incoming voice call
Incoming video call
Calling...
Voice call active
Video call active
Screen sharing active
Participant disconnected
Disconnected
```

Never expose technical network terminology to users.

Do NOT display:

```text
ICE negotiation failed
Peer unavailable
Transmission protocol error
Media track failure
```

Translate technical failures into human language.

---

# 23. ERROR HANDLING

Errors must explain:

1. What happened.
2. What the user can do.

Examples:

```text
Microphone access is blocked.

Allow microphone access in your browser settings,
then try again.
```

```text
Camera access is blocked.

Allow camera access in your browser settings,
then try again.
```

```text
Screen sharing was cancelled.

Choose a screen or window to try again.
```

```text
Participant disconnected.

You can stay in the room and wait for them to reconnect.
```

Use red only where appropriate.

Do not show raw JavaScript/PeerJS errors to users.

---

# 24. TOASTS

Use toasts only for events.

Examples:

```text
Participant joined.
Participant disconnected.
Call started.
Call ended.
Screen sharing cancelled.
Microphone access blocked.
```

Do not use toasts for every persistent state.

Persistent states belong inside the relevant interface.

---

# 25. RESPONSIVE DESIGN

The redesign MUST work on:

- Desktop
- Laptop
- Tablet
- Mobile

### Desktop

Use a two-column room layout where appropriate.

Main media:

- Large
- Dominant

Secondary room/QR panel:

- Smaller

### Tablet

Allow controls to wrap.

Keep media above controls.

### Mobile

Stack vertically.

Use full-width primary actions.

Keep controls touch-friendly.

Do not allow horizontal overflow.

Keep QR below the main task.

Make the interface viewer-friendly where browser screen capture is unavailable.

Explain limitations clearly instead of making the room appear broken.

---

# 26. ACCESSIBILITY

Maintain:

- Semantic HTML
- Proper headings
- Labels
- Keyboard navigation
- Visible focus
- Accessible buttons
- Accessible dialogs
- ARIA labels
- Live status announcements where appropriate
- `playsInline` on video

Never rely on color alone.

For example:

Do not communicate only:

> cyan = connected

Also display:

> `● Connected`

---

# 27. MOTION

Use restrained motion only when it communicates state.

Allowed:

- Small hover transitions
- Focus transitions
- Fade-in
- Subtle live indicator pulse
- Audio waveform activity
- Dialog entrance

Avoid:

- Floating blobs
- Constant bouncing
- Parallax
- Excessive glow
- Decorative animations during calls

Respect:

```css
prefers-reduced-motion
```

---

# 28. PRIVACY COPY

Use honest language.

You may explain:

> Media is sent directly between connected browsers.

You may explain:

> Velixa does not provide recording or accounts.

Do NOT claim:

> Your room is completely private.

Do NOT claim:

> Your room is secure because it has a code.

Room codes are not authentication.

Do not promise guaranteed connection quality.

---

# 29. COMPONENT REFACTOR

Prefer reusable UI components.

If appropriate, create:

```text
src/components/velixa/

VelixaHeader
RoomStatusBar
ConnectionStatus
RoomCode
ModeSelector
MediaStage
LocalVideoPreview
CallControls
IncomingCallDialog
RoomSharePanel
EmptyMediaState
```

Host and viewer dashboards should reuse these components instead of duplicating UI.

Keep communication logic inside:

```text
usePeerConnection.ts
```

or small helpers owned by that hook.

Do not spread PeerJS logic throughout UI components.

---

# 30. MEDIA STATE RULE

Every media state must have:

1. A visible UI state.
2. A corresponding cleanup path.

Handle:

- Permission denied
- Permission cancelled
- Call accepted
- Call declined
- Call ended
- Remote participant leaving
- Peer disconnect
- Camera disabled
- Microphone disabled
- Screen sharing stopped
- Browser-native screen-share termination
- Network failure

The UI must never claim that something is active after its underlying media/peer connection has ended.

---

# 31. EXISTING FUNCTIONALITY TO PRESERVE

Before finalizing, verify all existing functionality:

### Room

- Create room
- Join room
- Room code
- QR joining
- Host/viewer roles
- Existing room URLs

### Voice

- Start voice call
- Receive voice call
- Accept
- Decline
- Mute
- End

### Video

- Start video call
- Receive video call
- Accept
- Decline
- Mute
- Camera on/off
- End

### Screen sharing

- Start screen share
- Receive screen share
- Stop sharing
- Browser-native stop-sharing
- Return to correct room state

Do not regress any of these.

---

# 32. FILES TO INSPECT FIRST

Before editing, inspect the actual project.

Pay particular attention to:

```text
src/hooks/usePeerConnection.ts
src/components/HostDashboard.tsx
src/components/ViewerDashboard.tsx
src/routes/room.$roomId.tsx
src/styles.css
```

Also inspect:

- package.json
- routing
- existing QR components
- existing shared UI components
- Tailwind configuration if present
- font configuration
- favicon/metadata

Do not assume filenames if the project differs.

---

# 33. IMPLEMENTATION STRATEGY

Perform the work in controlled passes.

## PASS 1 — BRAND FOUNDATION

- Viorax → Velixa
- Global colors
- Typography
- Global background
- Borders
- Buttons
- Focus states
- Header
- Metadata
- Browser title
- Metadata/favicon where appropriate

Then validate.

## PASS 2 — ROOM UX

Redesign:

- Landing page
- Create room
- Join room
- Host dashboard
- Viewer dashboard
- Room status bar
- QR/share panel
- Mode selector
- Waiting state

Then validate.

## PASS 3 — CALL EXPERIENCE

Redesign:

- Voice call
- Video call
- Local preview
- Remote media
- Incoming call
- Call controls
- Screen sharing
- Call ending
- Permission errors
- Disconnection states

Then validate.

---

# 34. VALIDATION

After implementation run the project's available checks.

At minimum:

```bash
npx --no-install tsc --noEmit
```

```bash
npm run lint
```

```bash
npm run build
```

If the project uses Bun, also use the existing Bun commands if available.

Do not hide validation failures.

Clearly distinguish:

- New errors introduced by your changes
- Existing unrelated errors/warnings

---

# 35. FINAL QUALITY CHECK

Before declaring the redesign complete, verify:

### Branding

- [ ] Velixa appears everywhere
- [ ] No visible Viorax branding remains
- [ ] Browser title updated
- [ ] Metadata updated

### Visual

- [ ] Near-black workspace
- [ ] Graphite panels
- [ ] Amber primary actions
- [ ] Cyan connection states
- [ ] Red destructive states
- [ ] Inter typography
- [ ] JetBrains Mono operational labels
- [ ] Restrained radius
- [ ] Minimal shadows
- [ ] No unnecessary gradients
- [ ] No decorative blobs
- [ ] No old Viorax visual language

### UX

- [ ] Create room is obvious
- [ ] Join room is obvious
- [ ] Room code is prominent
- [ ] QR remains usable
- [ ] Voice/video/screen modes are obvious
- [ ] Incoming calls are clear
- [ ] Accept/decline is clear
- [ ] Active call controls are obvious
- [ ] Screen-share state is truthful
- [ ] Errors explain recovery

### Responsive

- [ ] Desktop works
- [ ] Tablet works
- [ ] Mobile works
- [ ] No horizontal overflow
- [ ] Touch targets are sufficiently large
- [ ] Media remains usable

### Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] ARIA labels
- [ ] Semantic headings
- [ ] Accessible dialogs
- [ ] Status announcements where appropriate

### Functionality

- [ ] QR joining still works
- [ ] Room creation works
- [ ] Host/viewer roles work
- [ ] Voice works
- [ ] Video works
- [ ] Screen sharing works
- [ ] Incoming calls work
- [ ] Call cleanup works
- [ ] No stale media states

---

# 36. MOST IMPORTANT DESIGN PRINCIPLE

Do not make Velixa look like a generic AI-generated SaaS dashboard.

It should have a distinctive identity:

> **Dark communication workspace + amber action signal + cyan connection signal + restrained technical typography + media-first layouts.**

The interface should feel like a real product, not a template.

The final emotional impression should be:

**Private-feeling. Immediate. Calm. Technical. Professional. Human.**

When the redesign is complete, a user should be able to open Velixa and immediately understand:

> **Create a room → Share the code → Choose voice, video, or screen → Connect.**

Do not make the user think about the technology underneath.

The technology should disappear behind the experience.