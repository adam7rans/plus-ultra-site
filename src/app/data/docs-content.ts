// ─────────────────────────────────────────────────────────────────────────────
// Plus Ultra — Docs Content Management
//
// HOW TO ADD A NEW ARTICLE:
//   1. Pick the right category below (or add a new DocCategory entry).
//   2. Add a new DocArticle object to that category's `articles` array.
//   3. Write your content as a standard Markdown string.
//   4. The Docs page will automatically pick it up — no code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

export interface DocArticle {
  id: string;
  title: string;
  readingTime: string;
  lastUpdated: string;
  content: string; // Standard Markdown
}

export interface DocCategory {
  id: string;
  label: string;
  tag: string;
  accentColor: "green" | "amber";
  articles: DocArticle[];
}

export const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    tag: "GETTING STARTED",
    accentColor: "green",
    articles: [
      {
        id: "installation",
        title: "Installation & First Boot",
        readingTime: "4 min read",
        lastUpdated: "2026-02-14",
        content: `
# Installation & First Boot

Get Plus Ultra running on your device in under five minutes. This guide covers both iOS and Android installation, first-boot configuration, and the initial key generation ceremony.

## Requirements

| Platform | Minimum Version | Recommended |
|----------|----------------|-------------|
| iOS      | 16.0           | 17.x+       |
| Android  | 10 (API 29)    | 13+         |
| Storage  | 180 MB free    | 500 MB+     |
| RAM      | 2 GB           | 4 GB+       |

## Step 1 — Download

Download Plus Ultra from the **App Store** or **Google Play**. Do not sideload from unofficial sources; verify the package signature before installing.

\`\`\`
SHA-256 checksum (Android APK v1.0.0):
a3f2c891b74e5d60f1820c4a9b3e2d17f5c6a8e0d1b9f3c2a7e4d8b6f0e1c5a2
\`\`\`

> **Verify the checksum** using \`sha256sum\` on Linux/macOS or \`CertUtil\` on Windows before installing APKs manually.

## Step 2 — Key Generation

On first boot, Plus Ultra generates your cryptographic identity:

1. The app generates a **128-bit elliptic curve keypair** (Curve25519) locally on your device.
2. Your **public key** becomes your network identity — share it with trusted contacts for vetting.
3. Your **private key never leaves your device** and is stored in the OS secure enclave.

\`\`\`
Your Node ID will look like:
PU-A3F2-C891-B74E (derived from the first 16 bits of your public key)
\`\`\`

## Step 3 — Emergency Passphrase

You'll be prompted to set an emergency passphrase. This passphrase is used to:
- Decrypt your local vault if biometrics fail
- Perform a secure key export to a backup device
- Authenticate firmware recovery scenarios

> **Write your passphrase on paper and store it in a fireproof location.** Do not save it digitally.

## Step 4 — Permissions

Grant the following permissions when prompted:

- ✅ **Bluetooth** — Required for Bluetooth LE mesh
- ✅ **Location (Approximate)** — Required for BLE scanning on Android
- ✅ **Notifications** — Required for mesh message delivery alerts
- ⛔ **Location (Precise)** — Not requested; Plus Ultra does not track GPS

## You're Ready

After key generation completes, you'll land on the main dashboard. Your node status indicator will show **GRID-UP** if internet is available, or **STANDALONE** until you join a mesh.

**Next step:** [Creating Your First Mesh Network](#)
        `,
      },
      {
        id: "first-mesh",
        title: "Creating Your First Mesh Network",
        readingTime: "6 min read",
        lastUpdated: "2026-02-20",
        content: `
# Creating Your First Mesh Network

A Plus Ultra mesh network is a group of verified, trusted devices that can communicate directly — no internet or cell towers required. This guide walks you through forming your first mesh.

## How Mesh Networking Works

Each device acts as both a **sender** and a **relay node**. Messages hop from device to device until they reach their destination, allowing a small group to cover significant geographic area.

\`\`\`
[Device A] ──BT-LE──▶ [Device B] ──LoRa──▶ [Device C]
                ↑                                   ↑
           You are here                     Your contact (2 hops)
\`\`\`

**Maximum hop depth:** 7 nodes  
**Typical latency per hop:** 40–120ms  
**Message deduplication:** Automatic via sequence numbers

## Method 1 — Proximity Pairing (Recommended for First Setup)

The fastest way to add a trusted node is proximity pairing:

1. Both devices open **Contacts → Add Node → Proximity Pair**
2. Devices exchange public keys over Bluetooth LE at close range (< 1 meter recommended)
3. Both users **verbally confirm** the 6-digit pairing code displayed on screen
4. Tap **Confirm & Trust** — the node is added to your trust chain

> **Security Note:** Always verbally confirm the pairing code. This prevents MITM attacks during the key exchange.

## Method 2 — QR Code Exchange

If devices are not co-located:

1. Navigate to **Profile → Export Identity → QR Code**
2. Have your contact scan your QR code using their Plus Ultra camera
3. The app imports the public key and prompts for manual vetting confirmation
4. Approve the contact — they become a Level 1 trusted node

## Mesh Status Indicators

| Status | Color | Meaning |
|--------|-------|---------|
| MESH ACTIVE | 🟢 Green | Connected to 1+ trusted nodes |
| STANDALONE | ⚪ White | No mesh peers in range |
| BRIDGED | 🟡 Amber | Connected via relay (2+ hops) |
| DEGRADED | 🔴 Red | Packet loss > 15% |

## Testing Your Mesh

Once two devices are paired, test connectivity:

1. Go to **Diagnostics → Ping Node**
2. Select a peer node from your contacts
3. A successful round-trip confirms the mesh is operational

\`\`\`
PING PU-A3F2-C891-B74E: 5 packets transmitted, 5 received (0% loss)
Round-trip: min/avg/max = 42ms / 67ms / 104ms
\`\`\`
        `,
      },
      {
        id: "key-management",
        title: "Identity & Key Management",
        readingTime: "7 min read",
        lastUpdated: "2026-03-01",
        content: `
# Identity & Key Management

Your cryptographic identity is the foundation of your security on Plus Ultra. This document explains how keys are generated, stored, backed up, and rotated.

## Cryptographic Primitives

Plus Ultra uses a layered cryptographic architecture:

| Layer | Algorithm | Purpose |
|-------|-----------|---------|
| Identity | Curve25519 (ECDH) | Node identity & key exchange |
| Symmetric | AES-256-GCM | Message encryption |
| Signing | Ed25519 | Trust chain signatures |
| KDF | Argon2id | Passphrase-to-key derivation |
| PRNG | OS CSPRNG | Key generation randomness |

## Key Storage

Private keys are stored in your device's **Secure Enclave** (iOS) or **Android Keystore** (Android). These hardware-backed storage systems ensure:

- Keys are **never exported to RAM** unencrypted
- Keys are **inaccessible to other apps** on the device
- Keys are **wiped on device factory reset**

## Backing Up Your Identity

To survive device loss, export your identity to a backup:

\`\`\`
Settings → Identity → Export Backup → Encrypted Keyfile
\`\`\`

The exported file is encrypted with your emergency passphrase using **AES-256-GCM + Argon2id key stretching**. Store this file on an encrypted USB drive, not in cloud storage.

> **OpSec Warning:** Never email or message your identity backup. Never upload it to any cloud service.

## Key Rotation

Rotate your keys if you believe they may have been compromised:

1. Navigate to **Settings → Identity → Rotate Keys**
2. A new keypair is generated; your old Node ID is retired
3. All existing contacts must re-verify you via proximity pairing or QR exchange
4. A signed **key rotation certificate** is broadcast to your mesh so contacts can automatically update

## Revoking a Contact

If a contact's device is compromised:

1. **Contacts → [Contact Name] → Revoke Trust**
2. A **revocation record** is signed with your key and broadcast to your mesh
3. All nodes that trust you will stop relaying messages from the revoked node
4. The revocation propagates across the mesh within 60 seconds under normal conditions
        `,
      },
    ],
  },

  // ─── Architecture ─────────────────────────────────────────────────────────
  {
    id: "architecture",
    label: "Architecture",
    tag: "ARCHITECTURE",
    accentColor: "green",
    articles: [
      {
        id: "how-it-works",
        title: "How Plus Ultra Works",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# How Plus Ultra Works

Plus Ultra is an offline-first tribal operating system — a native mobile app designed so communities can organize, coordinate, and make decisions whether or not they have internet access. This document gives a high-level mental model of the system.

## Two Runtime Contexts

The app operates in one of two modes depending on connectivity:

**Grid-Up** — The internet and the Gun relay are reachable. Data syncs to Convex cloud in addition to peer-to-peer via Gun. All features are active.

**Grid-Down** — The relay is unreachable. The app switches to the P2P mesh sync layer. Cloud-dependent features (Finances, Federation, Proposals) are dimmed. Crisis-critical screens (Roll Call, PACE, Inventory, Map, Bug-Out) surface automatically.

The app detects which context it's in by pinging the Gun relay endpoint every 60 seconds. If the ping fails and stays failed, a five-stage escalation system kicks in — from a small offline dot (< 5 min) all the way to automatic grid-down declaration (24 hr).

## The Three-Tier Sync Architecture

| Tier | When active | Transport |
|------|-------------|-----------|
| Convex | Grid-up | Cloud (HTTPS/WebSocket) |
| Gun P2P + Mesh | Grid-down, mesh peers present | LAN, WiFi Direct, BLE-triggered |
| Local-only | Fully isolated | IndexedDB only |

The sync adapter selects the tier automatically. No user configuration required.

## IndexedDB: The Permanent Source of Truth

All data is written to IndexedDB first, synchronously, before any network operation is attempted. Gun and Convex are sync transports — they replicate what's already in IDB. This means:

- The app never blocks on a network call
- Data is never lost due to connectivity failure
- Reloads and restarts have zero data loss

## The Three-Tier P2P Mesh

When the relay goes down, mesh sync provides three concentric rings of connectivity:

**Ring 1 — mDNS Relay (Phase A):** An axum HTTP server embedded in the Tauri binary starts on port 8766. It runs the same Gun relay protocol and advertises itself via mDNS as \`_plusultra._tcp\`. Phones on the same WiFi or hotspot auto-discover it.

**Ring 2 — WiFi Direct (Phase B, Android):** No router needed. Phones connect directly via Android's WifiP2pManager. The group owner always gets IP \`192.168.49.1\`. Gun peers connect to \`ws://192.168.49.1:8766/gun\`.

**Ring 3 — BLE Discovery (Phase C, Android):** Passive background BLE scanning detects tribe members within ~100m by their tribe UUID advertisement. When detected, WiFi Direct initiates automatically. Zero user interaction.

## Cryptography

Every identity and tribe has a keypair generated entirely in-browser via WebCrypto. No accounts, no servers, no recovery mechanism beyond a QR backup the user exports themselves. Messages are signed (ECDSA P-256) and DMs are encrypted (ECDH P-256) before they ever leave the device.

## What Happens on First Launch

1. WebCrypto generates an ECDSA + ECDH keypair — your identity
2. The keypair is stored in the \`identity\` IndexedDB store
3. You set a display name (stored separately in your member record)
4. You create or join a tribe via invite link
5. The sync adapter connects to the configured Gun relay and begins syncing
        `,
      },
      {
        id: "package-structure",
        title: "Package & Module Structure",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Package & Module Structure

The repository is organized as a monorepo with four top-level packages.

## Top-Level Layout

\`\`\`
packages/
  app/       — Tauri 2.0 native app (React + Vite + Tailwind)
  core/      — Shared types, registries, scoring algorithms
relay/       — Gun relay server + local app distribution server
convex/      — Convex schema and serverless functions
\`\`\`

## packages/app/

The main application. Everything the user sees.

\`\`\`
packages/app/
  src/
    lib/                  — Data layer and sync infrastructure
      db.ts               — IndexedDB setup, store definitions, migrations
      gun-init.ts         — Gun instance creation and relay connection
      sync-adapter.ts     — Three-tier sync priority (Convex / Gun / local)
      offline-tracker.ts  — Relay ping, 5-stage escalation, mesh auto-start
      sync-queue.ts       — Offline write queue, flush on reconnect
      mesh.ts             — mDNS relay start/stop, peer management
      wifi-direct.ts      — Android WiFi Direct JS bridge
      ble-discovery.ts    — Android BLE advertising + scanning JS bridge
    hooks/
      useIsGridUp.ts      — React hook: current grid-up/down state
      useMeshSync.ts      — React hook: mesh status and peer list
    routes/               — TanStack Router file-based routes
    components/           — Shared UI components
  src-tauri/
    src/
      lib.rs              — Tauri command registrations
      mesh.rs             — Rust: axum relay server + mDNS advertisement
    android-plugins/
      WifiDirectPlugin.kt — Android WifiP2pManager plugin
      BlePlugin.kt        — Android BLE advertise + scan plugin
    capabilities/
      mesh.json           — Tauri capability declarations for mesh commands
\`\`\`

## packages/core/

Pure TypeScript. No Tauri, no browser APIs. Tested with Vitest.

\`\`\`
packages/core/
  src/
    types/        — Shared TypeScript interfaces (Member, Tribe, Skill, Asset, …)
    registries/
      skills.ts   — 53-role registry with scaling curves and tier assignments
      assets.ts   — 48-asset registry with categories and criticality flags
    scoring/
      survivability.ts   — Weighted survivability score algorithm
      readiness.ts       — 6-dimension composite readiness score
    permissions.ts       — Authority-tier permission checks
    psych.ts             — Archetype derivation, centroid scoring
\`\`\`

## relay/

Node.js scripts. No build step required.

\`\`\`
relay/
  relay.js       — Standard Gun relay server (port 8765)
  serve-app.js   — Local HTTP server for grid-down app distribution
  radata/        — Gun relay data directory (auto-created)
\`\`\`

## convex/

Convex serverless backend. Deployed separately.

\`\`\`
convex/
  schema.ts      — Convex table definitions
  members.ts     — Member sync mutations and queries
  messages.ts    — Message sync
  tribes.ts      — Tribe metadata sync
  _generated/    — Auto-generated Convex API types
\`\`\`
        `,
      },
      {
        id: "data-flow",
        title: "Data Flow: IDB → Gun → Convex",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Data Flow: IDB → Gun → Convex

Understanding how data moves through Plus Ultra is essential for debugging sync issues and building new features.

## The Write Path

Every user action that creates or modifies data follows this sequence:

\`\`\`
User action (e.g., send message, declare skill, cast vote)
  │
  ▼
1. IDB write — immediate, synchronous
   (source of truth — data is safe here)
  │
  ▼
2. Sync tier check (getSyncTier())
  │
  ├─ "convex" ──▶ convexWrite() queues Convex mutation
  │                [also proceeds to Gun write]
  │
  ├─ "mesh"   ──▶ gun.get(path).put(data) [fire-and-forget]
  │
  └─ "local"  ──▶ queued-messages IDB store
                  (replayed when connectivity returns)
\`\`\`

**The critical guarantee:** Step 1 always completes before steps 2–3 begin. Gun and Convex writes are never awaited — they are best-effort transports. If they fail, the data is still in IDB.

## The Read Path

On app load, the read priority is:

1. **IndexedDB** — always queried first; renders immediately
2. **Convex** (grid-up) — fresh cloud data merges into IDB on app start
3. **Gun subscriptions** — real-time peer updates arrive and merge into IDB continuously

## Gun P2P Sync

Once a write lands in IDB and Gun, it propagates to all connected peers:

\`\`\`
Device A writes to gun.get("tribes/abc/messages/msg1").put({...})
                │
                ▼
         Gun relay (or LAN)
         /              \\
        ▼                ▼
   Device B          Device C
  (gun.on() fires)  (gun.on() fires)
       │                 │
       ▼                 ▼
  IDB merge          IDB merge
\`\`\`

Gun subscriptions use \`map().on(callback)\` paired with a 2-second \`map().once()\` poll — this combination handles both real-time pushes and polling fallback for environments where \`map().on()\` peer push is unreliable.

## Convex Cloud Sync (Grid-Up)

Convex provides cloud persistence and cross-device sync for new devices joining a tribe:

\`\`\`
Write path (grid-up):
  IDB write → convexWrite() → Convex mutation → Convex cloud DB

Read path (new device joins, grid-up):
  Convex query → IDB hydration → React renders from IDB
\`\`\`

Convex mutations are queued in the \`pending-syncs\` IDB store when grid-down, then flushed in order when \`isGridUp()\` transitions back to true.

## The Pending-Sync Queue

Two queues exist in parallel:

| Queue | IDB Store | Flushed by |
|-------|-----------|-----------|
| Gun write queue | \`queued-messages\` | \`flushSyncQueue()\` in sync-queue.ts |
| Convex mutation queue | \`pending-syncs\` | \`flushPendingSyncs()\` in sync-adapter.ts |

Both are triggered by the \`grid-up-changed\` event emitted by \`offline-tracker.ts\` when the relay ping succeeds again.
        `,
      },
      {
        id: "tech-choices",
        title: "Technology Choices",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Technology Choices

Every layer of Plus Ultra was chosen for its fitness in an offline-first, security-critical, multi-platform context.

## Stack Overview

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Native shell | Tauri 2.0 | iOS + Android + macOS + Windows from one Rust core. Significantly smaller binary than Electron — no bundled Chromium. WebView uses the platform's native engine. |
| UI framework | React 18 + Vite | Fast HMR shortens the dev loop. Small production bundle. Widely known ecosystem reduces onboarding friction for contributors. |
| Routing | TanStack Router | File-based, type-safe routes with full param inference. TypeScript errors surface at build time rather than runtime. |
| Styling | Tailwind CSS 4 | Custom \`forest\` design token palette tuned for dark, outdoor readability. Zero runtime overhead. |
| P2P sync | Gun.js | Decentralized real-time graph database. Works over LAN or via relay with no protocol changes. Fire-and-forget writes never block the UI. Runs entirely in-browser. |
| Cryptography | Gun SEA (WebCrypto) | ECDSA P-256 signing + ECDH P-256 key exchange, entirely via the browser's native WebCrypto API. No native crypto bindings needed. Same code path on iOS, Android, and desktop. |
| Local storage | IndexedDB (idb) | The source of truth for all application state. ~44 stores. Survives restarts, background kills, and OS memory pressure. Queried synchronously via the \`idb\` wrapper library. |
| Cloud sync | Convex | Real-time reactive queries; mutations are transactional. Used for grid-up persistence and cross-device hydration. Gracefully degrades — if \`VITE_CONVEX_URL\` is unset, the app runs Gun-only with no errors. |
| mDNS discovery | mdns-sd (Rust crate) | Zero-config local network discovery. No STUN/TURN servers. Runs inside the Tauri binary alongside the axum relay server. |
| WiFi Direct | WifiP2pManager (Android) | OS-level peer-to-peer WiFi with no infrastructure dependency. Group owner IP is always deterministic (\`192.168.49.1\`), simplifying the Gun peer URL. |
| BLE proximity | Android BLE APIs | LOW_POWER advertising keeps background battery drain minimal during extended grid-down operations. UUID derived from tribe ID so devices only respond to their own tribe. |

## What Was Not Chosen (and Why)

**Electron:** Binary size and Chromium bundling make it unsuitable for devices with limited storage in the field.

**IPFS:** Content-addressed storage doesn't map cleanly to mutable tribal data (member records, events, votes) that change frequently.

**Signal Protocol (Double Ratchet):** Provides forward secrecy that the current ECDH shared-secret approach lacks, but adds significant key management complexity. Listed as a future improvement.

**SQLite:** Would provide stronger query capabilities but loses the real-time P2P sync semantics that Gun provides out of the box.
        `,
      },
    ],
  },

  // ─── Data Layer ───────────────────────────────────────────────────────────
  {
    id: "data-layer",
    label: "Data Layer",
    tag: "DATA LAYER",
    accentColor: "amber",
    articles: [
      {
        id: "idb-schema",
        title: "IndexedDB Schema Reference",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# IndexedDB Schema Reference

All application data lives in IndexedDB (IDB). Gun and Convex are sync transports — IDB is the source of truth. The current schema is version **v25**.

## Store Reference

| Store | Key Format | Purpose | Managed by |
|-------|------------|---------|-----------|
| \`identity\` | string | Cryptographic keypair (device-only, never synced) | \`identity.ts\` |
| \`members\` | \`tribeId:pubkey\` | Tribe member records | \`members.ts\` |
| \`skills\` | \`tribeId:memberId__role\` | Declared skills with proficiency, specializations, vouches | \`skills.ts\` |
| \`events\` | \`tribeId:eventId\` | Scheduled events (all 10 types) | \`events.ts\` |
| \`messages\` | string | Chat messages — tribe channel + DMs | \`messages.ts\` |
| \`channel-reads\` | string | Per-channel read cursors (unread badge computation) | \`messages.ts\` |
| \`my-tribes\` | tribeId | Tribes this device has joined, including tribe keypair | \`tribes.ts\` |
| \`my-people\` | \`tribeId:myPubkey\` | Family and friends within the tribe | \`people.ts\` |
| \`tribe-cache\` | tribeId | Cached tribe metadata (name, governance model, scale) | \`tribes.ts\` |
| \`queued-messages\` | string | Offline write queue — replayed on reconnect | \`sync-queue.ts\` |
| \`pending-syncs\` | string | Queued Convex mutations — flushed when grid-up restores | \`sync-adapter.ts\` |
| \`invite-tokens\` | string | Invite link tokens | \`tribes.ts\` |
| \`inventory\` | \`tribeId:assetType\` | Tribe asset quantities + per-asset notes | \`inventory.ts\` |
| \`notifications\` | \`tribeId:notificationId\` | In-app notifications | \`notifications.ts\` |
| \`alerts\` | \`tribeId:alertId\` | Emergency alert broadcasts | \`alerts.ts\` |
| \`proposals\` | \`tribeId:proposalId\` | Governance proposals | \`proposals.ts\` |
| \`proposal-votes\` | \`proposalId:memberPub\` | Individual votes cast | \`proposals.ts\` |
| \`proposal-comments\` | \`proposalId:commentId\` | Proposal discussion threads | \`proposals.ts\` |
| \`map-pins\` | \`tribeId:pinId\` | Map asset and POI pins | \`map.ts\` |
| \`patrol-routes\` | \`tribeId:routeId\` | Guard patrol routes | \`map.ts\` |
| \`map-territory\` | tribeId | Tribe territory polygon | \`map.ts\` |
| \`training-sessions\` | \`tribeId:sessionId\` | Completed training sessions | \`training.ts\` |
| \`certifications\` | \`tribeId:memberId:certId\` | Member certifications with expiry | \`training.ts\` |
| \`consumption-log\` | \`tribeId:entryId\` | Resource consumption entries | \`inventory.ts\` |
| \`federation-relationships\` | \`myTribeId:channelId\` | Inter-tribe federation channels | \`federation.ts\` |
| \`federation-messages\` | \`channelId:messageId\` | Inter-tribe messages | \`federation.ts\` |
| \`federation-trades\` | \`channelId:proposalId\` | Inter-tribe trade proposals | \`federation.ts\` |
| \`psych-profiles\` | \`tribeId:memberPub\` | Psychological dimension scores + archetype | \`psych.ts\` |
| \`peer-ratings\` | \`tribeId:ratedPub:weekHash\` | Anonymous peer ratings (local dedup only) | \`psych.ts\` |
| \`muster-calls\` | \`tribeId:musterId\` | Roll call / muster events | \`muster.ts\` |
| \`muster-responses\` | \`musterId:memberPub\` | Member responses to each muster | \`muster.ts\` |
| \`production-log\` | \`tribeId:entryId\` | Production tracking entries | \`production.ts\` |
| \`external-contacts\` | \`tribeId:id\` | External contacts (doctors, HAM operators, vendors) | \`contacts.ts\` |
| \`pace-plan\` | tribeId | PACE comms plan (all four levels) | \`pace.ts\` |
| \`tribe-goals\` | \`tribeId:goalId\` | Tribe goals with horizon classification | \`goals.ts\` |
| \`goal-milestones\` | \`tribeId:milestoneId\` | Milestones within goals | \`goals.ts\` |
| \`tribe-tasks\` | \`tribeId:taskId\` | Tasks linked to goals | \`goals.ts\` |
| \`bugout-plans\` | \`tribeId:planId\` | Bug-out evacuation plans | \`bugout.ts\` |
| \`tribe-docs\` | \`tribeId:docId\` | Knowledge base documents (Markdown, versioned) | \`docs.ts\` |
| \`tribe-expenses\` | \`tribeId:expenseId\` | Shared expense ledger | \`finance.ts\` |
| \`tribe-contributions\` | \`tribeId:contributionId\` | Fund contributions | \`finance.ts\` |
| \`grid-state\` | tribeId | Grid-down operational state (mode, expiry, drill flag) | \`grid-down.ts\` |
| \`member-infra-status\` | \`tribeId:memberPub\` | Per-member infrastructure failure reports (11 items) | \`grid-down.ts\` |

## Schema Versioning

IDB is opened with \`openDB("plus-ultra", 25, { upgrade })\`. Each version bump runs a migration in \`packages/app/src/lib/db.ts\`. New stores are created in the \`upgrade\` callback; existing stores are never dropped (only augmented with new indexes).

> If you add a new store, increment the version number and add a migration in the \`upgrade\` function. Old clients will run the migration automatically on next launch.
        `,
      },
      {
        id: "gun-integration",
        title: "Gun.js Integration & Quirks",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Gun.js Integration & Quirks

Gun.js is powerful, but it has three silent failure modes discovered during sync validation that every contributor must understand.

## The Three Silent Failure Modes

### 1. \`undefined\` Field Values

\`gun.put()\` silently drops **entire writes** — not just the undefined field — if any value in the object is \`undefined\`.

\`\`\`js
// This write is silently dropped:
gun.get("tribes/abc/members/pub123").put({ name: "Alice", role: undefined })

// This write succeeds:
gun.get("tribes/abc/members/pub123").put({ name: "Alice" })
\`\`\`

**Fix:** Pass all objects through \`gunEscape(data)\` before writing. It strips all undefined values recursively.

### 2. SEA-Formatted String Values

Gun's SEA middleware intercepts any string value starting with \`"SEA{"\` and attempts to verify it as a signed node. Raw output from \`SEA.sign()\` or \`SEA.encrypt()\` will be silently rejected.

\`\`\`js
// Silently rejected — Gun intercepts the SEA{ prefix:
gun.get(path).put({ msg: await SEA.encrypt(plaintext, key) })

// Works — escaped prefix bypasses the middleware:
gun.get(path).put({ msg: gunEscape(await SEA.encrypt(plaintext, key)) })
\`\`\`

**Fix:** \`gunEscape()\` replaces \`"SEA{"\` prefixes with \`"~SEA{"\`. \`gunUnescape()\` restores them on read.

### 3. \`map().on()\` Peer Push Unreliability

\`gun.get(path).map().on(callback)\` does not reliably deliver peer-written data in all environments (particularly when the relay is under load or the Gun graph has many nodes at a path).

**Fix:** Pair every \`map().on()\` subscription with a 2-second \`map().once()\` poll:

\`\`\`js
// In every data-layer subscription:
gun.get(path).map().on((data, key) => {
  if (data) handleUpdate(key, data)
})

// Polling fallback — fires once, catches any missed pushes:
setInterval(() => {
  gun.get(path).map().once((data, key) => {
    if (data) handleUpdate(key, data)
  })
}, 2000)
\`\`\`

## Gun Path Conventions

The app uses a consistent path structure:

\`\`\`
tribes/{tribeId}/members/{memberPub}
tribes/{tribeId}/messages/{messageId}
tribes/{tribeId}/skills/{memberId}__{roleId}
tribes/{tribeId}/events/{eventId}
tribes/{tribeId}/proposals/{proposalId}
tribes/{tribeId}/grid-state
federation/{channelId}/messages/{messageId}
\`\`\`

## The gunEscape / gunUnescape Pattern

\`\`\`ts
// Before writing to Gun:
const escaped = gunEscape(data)
gun.get(path).put(escaped)

// After reading from Gun:
const clean = gunUnescape(rawFromGun)
await db.put(storeName, clean)
\`\`\`

Both functions are in \`packages/app/src/lib/gun-utils.ts\` and handle nested objects recursively.

## Why Gun Never Returns Errors

Gun's \`put()\` callback fires with \`{ ok: true }\` regardless of whether the write actually propagated. The app does not rely on Gun acks — IDB is written first, and Gun is treated as an eventually-consistent broadcast layer.
        `,
      },
      {
        id: "convex-sync",
        title: "Convex Cloud Sync",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Convex Cloud Sync

Convex provides cloud persistence and cross-device sync for grid-up scenarios. It is an optional layer — the app runs fully on Gun alone if Convex is not configured.

## When Convex Is Used

Convex is active only when \`isGridUp()\` returns \`true\`. In grid-down mode, all Convex calls are deferred to the pending-sync queue.

The primary use cases:

1. **New device onboarding** — when a member installs the app on a new device, Convex hydrates their IDB from the cloud rather than waiting for Gun peers to be online.
2. **Cloud backup** — tribe data persists in Convex even if all devices go offline simultaneously.
3. **Cross-session consistency** — members see up-to-date data on first load without waiting for Gun sync to catch up.

## The convexWrite() Function

\`sync-adapter.ts\` exports \`convexWrite(mutation, args)\`:

\`\`\`ts
// Called after every IDB write when grid-up:
await convexWrite("messages:send", { tribeId, messageId, content: encrypted })
\`\`\`

If \`isGridUp()\` is false, the call is serialized to the \`pending-syncs\` IDB store instead of executing immediately.

## Pending-Sync Flush

When \`offline-tracker.ts\` detects that the relay has come back online:

1. It emits \`grid-up-changed: true\`
2. \`sync-adapter.ts\` calls \`flushPendingSyncs()\`
3. Queued mutations are replayed in insertion order
4. Successfully flushed items are deleted from \`pending-syncs\`

If a mutation fails (e.g., conflict), it is retried up to 3 times before being dropped with a console warning.

## Configuration

Set \`VITE_CONVEX_URL\` in \`packages/app/.env\`:

\`\`\`
VITE_CONVEX_URL=https://your-deployment.convex.cloud
\`\`\`

If this variable is absent, \`convexWrite()\` is a no-op. No errors are thrown. The app runs in Gun-only mode silently. This is the correct configuration for fully self-hosted deployments.

## What Convex Syncs

Not all stores are mirrored to Convex. The current sync set:

| Convex table | IDB store mirrored |
|---|---|
| \`members\` | \`members\` |
| \`messages\` | \`messages\` |
| \`tribes\` | \`tribe-cache\` |
| \`skills\` | \`skills\` |
| \`alerts\` | \`alerts\` |

Identity keypairs, peer ratings, and local device state (\`grid-state\`, \`member-infra-status\`) are never synced to Convex.
        `,
      },
      {
        id: "sync-adapter",
        title: "Sync Adapter: Three-Tier Priority",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Sync Adapter: Three-Tier Priority

\`packages/app/src/lib/sync-adapter.ts\` is the single entry point for all data writes. It selects the appropriate sync tier and ensures IDB is always written first.

## The SyncTier Type

\`\`\`ts
type SyncTier = "convex" | "mesh" | "local"
\`\`\`

## getSyncTier()

\`\`\`ts
function getSyncTier(): SyncTier {
  if (isGridUp())   return "convex"
  if (isMeshUp())   return "mesh"
  return "local"
}
\`\`\`

\`isGridUp()\` is driven by \`offline-tracker.ts\` (relay ping result). \`isMeshUp()\` is driven by \`mesh.ts\` (at least one mesh peer connected).

## The Write Path

Every data-layer function calls \`syncWrite(storeName, key, data, gunPath)\`:

\`\`\`
syncWrite(store, key, data, gunPath)
  │
  ├─ 1. db.put(store, { ...data, key })     ← always, immediately
  │
  ├─ 2. tier = getSyncTier()
  │
  ├─ if tier === "convex":
  │     convexWrite(mutation, args)          ← queued if offline
  │     gun.get(gunPath).put(gunEscape(data)) ← fire-and-forget
  │
  ├─ if tier === "mesh":
  │     gun.get(gunPath).put(gunEscape(data)) ← fire-and-forget to mesh peers
  │
  └─ if tier === "local":
        queueForSync(gunPath, data)          ← stored in queued-messages IDB
\`\`\`

## Why IDB Is Always First

Gun writes are asynchronous and can fail silently (see Gun.js Quirks). Writing IDB first guarantees the data is never lost regardless of sync tier. The UI always reads from IDB — it never reads directly from Gun or Convex.

## Dual-Mode React Hooks

Two hooks expose the current tier to React components:

\`\`\`ts
const { isGridUp } = useIsGridUp()
// → true  when relay ping succeeds
// → false when relay unreachable

const { isMeshActive, isMeshUp, meshPeers } = useMeshSync()
// → isMeshActive: relay started (may have 0 peers)
// → isMeshUp: at least one peer connected
\`\`\`

Components use these to adapt their UI — showing offline banners, mesh indicators, dimming grid-up-only features — without needing to know the sync implementation details.
        `,
      },
    ],
  },

  // ─── P2P Mesh Sync ────────────────────────────────────────────────────────
  {
    id: "mesh-sync",
    label: "P2P Mesh Sync",
    tag: "P2P MESH SYNC",
    accentColor: "green",
    articles: [
      {
        id: "mesh-overview",
        title: "Overview & User Scenarios",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# P2P Mesh Sync: Overview & User Scenarios

When the Gun relay is unreachable, Plus Ultra activates a three-tier P2P mesh layer that lets phones sync directly — no internet, no router, no configuration.

## The Problem

Plus Ultra normally syncs through a Gun relay server at a fixed URL. In a grid-down scenario that relay may be unreachable: the internet is down, the server is gone, or the tribe is operating in a location with no connectivity. Without a fallback, devices become isolated silos.

## Three Concentric Rings

The mesh layer provides three rings of connectivity, each requiring less infrastructure than the last:

| Ring | Phase | Requirement | Range |
|------|-------|-------------|-------|
| 1 | mDNS Relay | Same WiFi or hotspot | Local network |
| 2 | WiFi Direct | Android, no router | ~100–200m |
| 3 | BLE Discovery | Android | ~100m (BLE) → triggers WiFi Direct |

All three activate automatically on grid-down. The user sees a mesh status indicator; no manual steps are required.

## User Scenarios

### Scenario 1 — Shared Hotspot

One phone creates a mobile hotspot. Other phones join the hotspot. The host phone starts an embedded Gun relay (Phase A) on port 8766. mDNS broadcasts \`_plusultra._tcp\`. Joining phones discover the relay and connect. The tribe syncs normally — same protocol as the internet relay, different transport.

### Scenario 2 — WiFi Direct Field Pair

No router, no hotspot. Two Android phones initiate WiFi Direct (Phase B). One becomes the group owner at \`192.168.49.1\`; the other connects. The group owner's embedded relay accepts the Gun connection at \`ws://192.168.49.1:8766/gun\`. Data syncs between the two phones directly.

### Scenario 3 — BLE Passive Discovery

No user interaction. A tribe member walks within ~100m. Their phone's BLE is advertising the tribe's UUID (Phase C). The other phone's BLE scanner detects the advertisement. The app automatically initiates WiFi Direct discovery. If both phones are Android, they connect and sync — triggered entirely by proximity.

### Scenario 4 — Multi-Phone Field Team

Five phones in the field. Any two phones within WiFi Direct range form a mesh link. As phones move, links form and drop. A message written on Phone A propagates to Phone B when they come within range; Phone B relays to Phone C when they come within range. The tribe's data state converges across the field team over time.

## What the User Sees

- A **mesh indicator** on the dashboard (green dot with peer count when active)
- Normal sync behavior — messages send, data updates, roll calls work
- No IP addresses to type, no pairing codes, no settings to configure

## Platform Support

| Feature | iOS | Android | Desktop (macOS) |
|---------|-----|---------|----------------|
| Phase A (mDNS relay) | Yes | Yes | Yes |
| Phase B (WiFi Direct) | No | Yes | No |
| Phase C (BLE discovery) | No | Yes | No |

Phase A works on all platforms because it uses the existing WiFi network. Phases B and C require Android-specific APIs.
        `,
      },
      {
        id: "mesh-phase-a",
        title: "Phase A: mDNS Embedded Relay",
        readingTime: "7 min read",
        lastUpdated: "2026-03-17",
        content: `
# Phase A: mDNS Embedded Relay

Phase A embeds a Gun relay server directly in the Tauri binary. On grid-down, it starts automatically and advertises itself on the local network via mDNS. No configuration required.

## Components

| Component | Location | Role |
|-----------|----------|------|
| axum HTTP server | \`src-tauri/src/mesh.rs\` | Gun relay — WebSocket upgrade at \`/gun\` |
| mDNS advertiser | \`src-tauri/src/mesh.rs\` | Advertises \`_plusultra._tcp\` on port 8766 |
| JS bridge | \`src/lib/mesh.ts\` | Tauri invoke calls + Gun peer management |
| Auto-start | \`src/lib/offline-tracker.ts\` | Calls \`startMeshMode()\` on grid-down |

## Tauri Commands

\`\`\`ts
// Start the embedded relay + mDNS advertisement:
await invoke("start_mesh_relay")

// Stop the relay and revoke mDNS:
await invoke("stop_mesh_relay")

// Get the local network IP (for manual peer URL construction):
const ip: string = await invoke("get_local_ip")
\`\`\`

These commands are registered in \`src-tauri/src/lib.rs\` and implemented in \`src-tauri/src/mesh.rs\`.

## mDNS Service

- **Service type:** \`_plusultra._tcp\`
- **Port:** 8766
- **TXT record:** includes the app version and tribe pub (used to filter non-tribe relays)

Peers on the same network scan for \`_plusultra._tcp\` and resolve the host IP from the mDNS response. The Gun relay URL is constructed as \`ws://{resolvedIp}:8766/gun\`.

## JS Bridge (mesh.ts)

\`\`\`ts
// mesh.ts — simplified view:
export async function startMeshMode() {
  await invoke("start_mesh_relay")
  // Listen for mDNS peer discoveries from Rust:
  await listen("mesh-peer-found", ({ payload }) => {
    const { ip, port } = payload
    gun.opt({ peers: [\`ws://\${ip}:\${port}/gun\`] })
    updateMeshPeers()
  })
  await listen("mesh-peer-lost", ({ payload }) => {
    // Remove the peer from Gun options
    removeMeshPeer(payload.ip)
  })
}
\`\`\`

## Auto-Start on Grid-Down

\`offline-tracker.ts\` monitors the relay ping result. On transition to grid-down:

\`\`\`
relay ping fails (N consecutive failures)
  → isGridUp() = false
  → grid-up-changed event emitted
  → offline-tracker calls startMeshMode()
  → axum relay starts on :8766
  → mDNS advertises _plusultra._tcp
  → other devices on the network discover and connect
\`\`\`

On transition back to grid-up:

\`\`\`
relay ping succeeds
  → isGridUp() = true
  → offline-tracker calls stopMeshMode()
  → mDNS revoked, axum server stops
  → Gun switches back to the main relay
\`\`\`

## Connection Sequence

\`\`\`
Device A (relay host)                Device B (joining)
     │                                      │
     │  invoke("start_mesh_relay")          │
     │  → axum starts on :8766             │
     │  → mDNS: _plusultra._tcp            │
     │                                      │
     │              ←── mDNS discover ──── │
     │          ws://192.168.x.x:8766/gun  │
     │                                      │
     │ ◄────── Gun sync (WebSocket) ──────► │
\`\`\`

## Port

The embedded relay uses port **8766** to avoid conflicting with the external Gun relay on port **8765**. Both can run simultaneously during the transition period.
        `,
      },
      {
        id: "mesh-phase-b",
        title: "Phase B: WiFi Direct (Android)",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Phase B: WiFi Direct (Android)

Phase B enables direct phone-to-phone sync over Android's WiFi Direct (Wi-Fi P2P) — no router, no hotspot, no infrastructure.

## How It Works

Android's \`WifiP2pManager\` creates a direct WiFi link between two devices. One device becomes the **group owner** and always receives the IP \`192.168.49.1\`. The other device connects to it. The group owner runs the Phase A embedded relay (\`ws://192.168.49.1:8766/gun\`); the non-owner connects Gun to that URL.

## Kotlin Plugin

The \`WifiDirectPlugin.kt\` Kotlin plugin in \`packages/app/src-tauri/android-plugins/\` wraps \`WifiP2pManager\` and emits Tauri events to JS:

| Tauri Command | Action |
|---------------|--------|
| \`start_wifi_direct\` | Registers the BroadcastReceiver, calls \`discoverPeers()\` |
| \`connect_wifi_direct_peer\` | Calls \`connect()\` with the device address |
| \`stop_wifi_direct\` | Unregisters receiver, calls \`removeGroup()\` |
| \`get_wifi_direct_peers\` | Returns current peer list |

| Tauri Event (Rust → JS) | Payload |
|-------------------------|---------|
| \`wifi-direct-peer-found\` | \`{ deviceAddress, deviceName }\` |
| \`wifi-direct-connected\` | \`{ groupOwnerIp, isGroupOwner }\` |
| \`wifi-direct-disconnected\` | — |

## Connection Sequence

\`\`\`
JS                        WifiDirectPlugin.kt           Android OS
│                                │                           │
│ invoke("start_wifi_direct")    │                           │
│ ──────────────────────────────►│                           │
│                                │  manager.discoverPeers()  │
│                                │ ─────────────────────────►│
│                                │◄── PEERS_CHANGED ─────────│
│◄── wifi-direct-peer-found ─────│                           │
│    { deviceAddress, name }     │                           │
│                                │                           │
│ invoke("connect_wifi_direct_peer", deviceAddress)          │
│ ──────────────────────────────►│  manager.connect()        │
│                                │ ─────────────────────────►│
│                                │◄── CONNECTION_CHANGED ────│
│                                │    requestConnectionInfo()│
│◄── wifi-direct-connected ──────│                           │
│    { groupOwnerIp: "192.168.49.1", isGroupOwner: false }   │
│                                │                           │
│  gun.opt({ peers: ["ws://192.168.49.1:8766/gun"] })        │
\`\`\`

## The Group Owner IP

Android always assigns \`192.168.49.1\` to the group owner. This deterministic IP means the Gun peer URL is always known: \`ws://192.168.49.1:8766/gun\`. The non-owner device doesn't need to discover the IP — it's hardcoded in \`wifi-direct.ts\`.

## Required Permissions

\`\`\`xml
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<!-- Android 13+ -->
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES"
    android:usesPermissionFlags="neverForLocation"
    tools:targetApi="33" />
\`\`\`

\`ACCESS_FINE_LOCATION\` is required by Android for WiFi P2P on API 29–32. On API 33+, \`NEARBY_WIFI_DEVICES\` replaces it for peer discovery.

## JS Bridge (wifi-direct.ts)

\`\`\`ts
// Start discovery:
await startWifiDirectMode()

// Connect when a peer is found:
listen("wifi-direct-peer-found", ({ payload }) => {
  connectToWifiDirectPeer(payload.deviceAddress)
})

// Add Gun peer on connection:
listen("wifi-direct-connected", ({ payload }) => {
  const { groupOwnerIp } = payload
  gun.opt({ peers: [\`ws://\${groupOwnerIp}:8766/gun\`] })
})
\`\`\`
        `,
      },
      {
        id: "mesh-phase-c",
        title: "Phase C: BLE Background Discovery",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Phase C: BLE Background Discovery

Phase C uses Bluetooth Low Energy to passively detect tribe members within ~100m and automatically trigger WiFi Direct sync — with zero user interaction.

## The Concept

Every tribe member's phone simultaneously **advertises** a BLE service UUID derived from their tribe ID and **scans** for the same UUID. When two tribe members come within BLE range, each detects the other's advertisement and initiates WiFi Direct automatically.

## UUID Derivation

Each tribe gets a unique BLE service UUID derived deterministically:

\`\`\`ts
// sha256 of the tribe ID, first 16 bytes, formatted as UUID-128:
const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tribeId))
const bytes = new Uint8Array(hash).slice(0, 16)
const uuid = formatAsUUID(bytes)
// e.g., "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
\`\`\`

Members of different tribes won't trigger each other — UUIDs won't match.

## Android BLE Advertising

\`BlePlugin.kt\` uses \`BluetoothLeAdvertiser\` with low-power settings to minimize battery drain:

\`\`\`
AdvertiseSettings:
  mode: ADVERTISE_MODE_LOW_POWER
  txPower: ADVERTISE_TX_POWER_LOW
  connectable: false

AdvertiseData:
  serviceUuid: ParcelUuid(tribeUuid)
  includeDeviceName: false
\`\`\`

## Android BLE Scanning

\`BlePlugin.kt\` uses \`BluetoothLeScanner\` with a \`ScanFilter\` on the tribe UUID:

\`\`\`
ScanFilter:
  serviceUuid: ParcelUuid(tribeUuid)

ScanSettings:
  scanMode: SCAN_MODE_LOW_POWER
\`\`\`

When a matching advertisement is found, the plugin emits a Tauri event to JS.

## The Full Discovery Chain

\`\`\`
BlePlugin.kt detects tribe UUID advertisement
  → emits "ble-tribe-peer-found" { deviceAddress, rssi }
  → ble-discovery.ts receives event
  → calls startWifiDirectMode() (if not already running)
  → calls discoverPeers()
  → WifiDirectPlugin.kt finds the peer
  → Connection established
  → Gun peer added at ws://192.168.49.1:8766/gun
  → Sync begins
\`\`\`

## Required Permissions

\`\`\`xml
<!-- Android 12+ (API 31+) -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation" tools:targetApi="31" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"
    tools:targetApi="31" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"
    tools:targetApi="31" />

<!-- Android 11 and below -->
<uses-permission android:name="android.permission.BLUETOOTH"
    android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
    android:maxSdkVersion="30" />
\`\`\`

Runtime permission prompts are handled by the JS bridge on first call to \`startBleDiscovery()\`.

## Battery Considerations

LOW_POWER BLE advertising consumes approximately 0.5–2mA — negligible compared to WiFi Direct or the display. This makes Phase C safe to leave running during extended grid-down operations. Discovery range in LOW_POWER mode is typically 50–150m depending on environment.

## Tauri Events

| Event | Payload | Description |
|-------|---------|-------------|
| \`ble-tribe-peer-found\` | \`{ deviceAddress, rssi }\` | Tribe member BLE advertisement detected |
| \`ble-tribe-peer-lost\` | \`{ deviceAddress }\` | BLE advertisement no longer seen |
| \`ble-peers-changed\` | \`{ peers: BlePeer[] }\` | Full peer list update |
        `,
      },
      {
        id: "mesh-js-api",
        title: "JS API Reference",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Mesh JS API Reference

Complete export reference for the three mesh modules and the \`useMeshSync\` hook.

## mesh.ts

\`\`\`ts
import { startMeshMode, stopMeshMode, getMeshPeers, isMeshUp, isMeshActive } from "@/lib/mesh"
\`\`\`

| Export | Signature | Description |
|--------|-----------|-------------|
| \`startMeshMode\` | \`() => Promise<void>\` | Starts the embedded axum relay on port 8766, begins mDNS advertisement, and registers Tauri event listeners for peer discovery. Called automatically by \`offline-tracker.ts\` on grid-down. |
| \`stopMeshMode\` | \`() => Promise<void>\` | Stops the relay, revokes mDNS advertisement, removes all mesh peers from Gun options. |
| \`getMeshPeers\` | \`() => MeshPeer[]\` | Returns the current list of connected mesh peers (IP + port + latency). |
| \`isMeshUp\` | \`() => boolean\` | Returns \`true\` if at least one mesh peer is currently connected and syncing. |
| \`isMeshActive\` | \`() => boolean\` | Returns \`true\` if mesh mode is running (relay started), even if no peers are connected yet. |

\`\`\`ts
interface MeshPeer {
  ip: string
  port: number
  connectedAt: number   // unix ms
  latencyMs?: number
}
\`\`\`

## wifi-direct.ts

\`\`\`ts
import { startWifiDirectMode, connectToWifiDirectPeer, stopWifiDirectMode } from "@/lib/wifi-direct"
\`\`\`

| Export | Signature | Description |
|--------|-----------|-------------|
| \`startWifiDirectMode\` | \`() => Promise<void>\` | Registers the Android BroadcastReceiver and starts \`discoverPeers()\`. No-op on iOS and desktop. |
| \`connectToWifiDirectPeer\` | \`(deviceAddress: string) => Promise<void>\` | Initiates a WiFi P2P connection to the given device MAC address. |
| \`stopWifiDirectMode\` | \`() => Promise<void>\` | Unregisters the BroadcastReceiver and calls \`removeGroup()\`. |

## ble-discovery.ts

\`\`\`ts
import { startBleDiscovery, stopBleDiscovery, getBlePeers } from "@/lib/ble-discovery"
\`\`\`

| Export | Signature | Description |
|--------|-----------|-------------|
| \`startBleDiscovery\` | \`(tribeId: string) => Promise<void>\` | Derives the tribe UUID, starts BLE advertising + scanning. Requests runtime permissions if needed. No-op on iOS and desktop. |
| \`stopBleDiscovery\` | \`() => Promise<void>\` | Stops BLE advertising and scanning. |
| \`getBlePeers\` | \`() => BlePeer[]\` | Returns the list of BLE peers currently in range. |

\`\`\`ts
interface BlePeer {
  deviceAddress: string
  rssi: number
  firstSeenAt: number   // unix ms
}
\`\`\`

## useMeshSync Hook

\`\`\`ts
import { useMeshSync } from "@/hooks/useMeshSync"

const {
  isMeshActive,   // boolean — relay is running
  isMeshUp,       // boolean — at least one peer connected
  meshPeers,      // MeshPeer[]
  startMesh,      // () => void
  stopMesh,       // () => void
} = useMeshSync()
\`\`\`

## Tauri Events (Rust → JS)

Use \`listen()\` from \`@tauri-apps/api/event\` to subscribe:

| Event | Payload type | Source |
|-------|-------------|--------|
| \`mesh-peer-found\` | \`{ ip: string, port: number }\` | \`mesh.rs\` — mDNS discovered a relay |
| \`mesh-peer-lost\` | \`{ ip: string }\` | \`mesh.rs\` — mDNS relay went away |
| \`wifi-direct-peer-found\` | \`{ deviceAddress: string, deviceName: string }\` | \`WifiDirectPlugin.kt\` |
| \`wifi-direct-connected\` | \`{ groupOwnerIp: string, isGroupOwner: boolean }\` | \`WifiDirectPlugin.kt\` |
| \`wifi-direct-disconnected\` | — | \`WifiDirectPlugin.kt\` |
| \`ble-tribe-peer-found\` | \`{ deviceAddress: string, rssi: number }\` | \`BlePlugin.kt\` |
| \`ble-tribe-peer-lost\` | \`{ deviceAddress: string }\` | \`BlePlugin.kt\` |
| \`ble-peers-changed\` | \`{ peers: BlePeer[] }\` | \`BlePlugin.kt\` |
        `,
      },
      {
        id: "mesh-android-setup",
        title: "Android Setup Guide",
        readingTime: "8 min read",
        lastUpdated: "2026-03-17",
        content: `
# Android Setup Guide

This guide walks through setting up the Android build with WiFi Direct (Phase B) and BLE Discovery (Phase C) mesh plugins.

## Prerequisites

- Android Studio installed (Hedgehog or later recommended)
- Android NDK configured (via Android Studio SDK Manager)
- Rust Android targets:

\`\`\`bash
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
\`\`\`

## Step 1 — Initialize Tauri Android

From the repo root:

\`\`\`bash
npm run tauri android init
\`\`\`

This generates the Android project under \`packages/app/src-tauri/gen/android/\`.

## Step 2 — Copy Kotlin Plugins

Copy the plugin files from \`packages/app/src-tauri/android-plugins/\` to the generated Android project:

\`\`\`bash
cp packages/app/src-tauri/android-plugins/WifiDirectPlugin.kt \\
   packages/app/src-tauri/gen/android/app/src/main/java/com/plusultra/

cp packages/app/src-tauri/android-plugins/BlePlugin.kt \\
   packages/app/src-tauri/gen/android/app/src/main/java/com/plusultra/
\`\`\`

## Step 3 — AndroidManifest.xml Permissions

Add to \`packages/app/src-tauri/gen/android/app/src/main/AndroidManifest.xml\`:

\`\`\`xml
<!-- WiFi Direct -->
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES"
    android:usesPermissionFlags="neverForLocation"
    tools:targetApi="33" />

<!-- BLE -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation"
    tools:targetApi="31" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"
    tools:targetApi="31" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"
    tools:targetApi="31" />
<uses-permission android:name="android.permission.BLUETOOTH"
    android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
    android:maxSdkVersion="30" />
\`\`\`

Add \`xmlns:tools="http://schemas.android.com/tools"\` to the \`<manifest>\` tag if not already present.

## Step 4 — Register Plugins in MainActivity.kt

Edit \`packages/app/src-tauri/gen/android/app/src/main/java/com/plusultra/MainActivity.kt\`:

\`\`\`kotlin
import com.plusultra.WifiDirectPlugin
import com.plusultra.BlePlugin

class MainActivity : TauriActivity() {
    override fun registerPlugins(pluginManager: PluginManager) {
        super.registerPlugins(pluginManager)
        pluginManager.registerPlugin(WifiDirectPlugin::class.java)
        pluginManager.registerPlugin(BlePlugin::class.java)
    }
}
\`\`\`

## Step 5 — build.gradle.kts Dependency

Add coroutines to \`packages/app/src-tauri/gen/android/app/build.gradle.kts\`:

\`\`\`kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    // ... existing dependencies
}
\`\`\`

## Step 6 — Tauri Capability

Ensure \`packages/app/src-tauri/capabilities/mesh.json\` includes the mesh commands:

\`\`\`json
{
  "identifier": "mesh",
  "description": "Mesh sync capabilities",
  "platforms": ["android"],
  "permissions": [
    "mesh:allow-start-mesh-relay",
    "mesh:allow-stop-mesh-relay",
    "mesh:allow-get-local-ip",
    "mesh:allow-start-wifi-direct",
    "mesh:allow-connect-wifi-direct-peer",
    "mesh:allow-stop-wifi-direct",
    "mesh:allow-start-ble-discovery",
    "mesh:allow-stop-ble-discovery"
  ]
}
\`\`\`

## Step 7 — Run

\`\`\`bash
npm run tauri android dev
\`\`\`

Or build a release APK:

\`\`\`bash
npm run build:android
\`\`\`

## Testing

1. Use two Android devices on the same WiFi or hotspot
2. In the app, trigger grid-down (Settings → Simulate Grid-Down, or wait for relay to be unreachable)
3. Both devices should show the mesh indicator within 30 seconds
4. Send a message on one device — it should appear on the other within 2–5 seconds

For BLE testing, turn off WiFi on both devices and walk within 100m of each other. The BLE scanner should trigger WiFi Direct and sync automatically.
        `,
      },
    ],
  },

  // ─── Cryptography ────────────────────────────────────────────────────────
  {
    id: "cryptography",
    label: "Cryptography",
    tag: "CRYPTOGRAPHY",
    accentColor: "amber",
    articles: [
      {
        id: "identity-keypair",
        title: "Identity Keypair System",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Identity Keypair System

Your cryptographic identity is generated entirely on your device on first launch. No accounts, no servers, no recovery mechanism beyond a QR code you export yourself.

## What Gets Generated

On first launch, Plus Ultra calls \`SEA.pair()\` to generate two keypairs via the browser's WebCrypto API:

| Keypair | Algorithm | Used for |
|---------|-----------|---------|
| Identity | ECDSA P-256 (\`pub\` / \`priv\`) | Signing messages, votes, and skill declarations |
| Encryption | ECDH P-256 (\`epub\` / \`epriv\`) | Key exchange for encrypted DMs and federation channels |

The result is a single Gun SEA pair object: \`{ pub, priv, epub, epriv }\`.

## Storage

The keypair is stored in the \`identity\` IndexedDB store. It is never written to Gun, Convex, or any external service. It never leaves the device unencrypted.

Your display name is stored separately in your member record in the \`members\` IDB store — it is not part of the keypair.

## Key Backup

Navigate to **Profile → Export Identity → QR Code**. The QR encodes the full keypair JSON. Treat it like a physical key:

- Anyone who scans it can impersonate you
- Store it offline in a secure location (printed, laminated)
- The app has no recovery server — if you lose the device and the QR, the identity is unrecoverable

## Device Loss

There is no account recovery, password reset, or trusted third party. This is by design — no server means no server to be compromised. Recommended practice:

1. Export a QR backup immediately after key generation
2. Store the backup offline (print it)
3. Import the QR on a new device via **Profile → Import Identity → Scan QR**

## Relationship to Gun SEA

Plus Ultra uses Gun's built-in SEA (Security, Encryption, Authorization) library as a thin wrapper over WebCrypto:

- \`SEA.pair()\` → generates the keypair
- \`SEA.sign(data, pair)\` → ECDSA signature
- \`SEA.verify(signed, pub)\` → signature verification
- \`SEA.secret(recipientEpub, myPair)\` → ECDH shared secret
- \`SEA.encrypt(data, secret)\` → AES-GCM encryption
- \`SEA.decrypt(encrypted, secret)\` → decryption

All crypto runs in the browser process — no native bindings, no Rust crypto. The same code path works on iOS, Android, and desktop.
        `,
      },
      {
        id: "tribe-keypairs",
        title: "Tribe Keypairs & Signing",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Tribe Keypairs & Signing

Every tribe has its own cryptographic keypair, generated at creation by the founder.

## Tribe Keypair

When a tribe is created, the founder calls \`SEA.pair()\` to generate a tribe keypair with the same structure as an identity keypair: \`{ pub, priv, epub, epriv }\`.

- **\`pub\`** — the tribe's public key. Included in invite links. Any member can use it to verify tribe-level signatures and address Gun writes to the correct path.
- **\`priv\`** — held by the founder. Used to sign tribe-level administrative actions.
- **\`epub\`** — the tribe's encryption public key. Shared with federation partners and diplomats.
- **\`epriv\`** — the tribe's encryption private key. Held by the founder and diplomats. Required to read federation channel messages.

The tribe keypair is stored in the \`my-tribes\` IDB store on the founder's device.

## Message Signing

Tribe channel messages are signed with the **sender's identity keypair** (not the tribe keypair):

\`\`\`ts
const signed = await SEA.sign(messagePayload, myIdentityPair)
gun.get(\`tribes/\${tribeId}/messages/\${msgId}\`).put(gunEscape({ content: signed }))
\`\`\`

This allows per-member attribution within the tribe. Any member can verify a message was authored by a specific member by checking the signature against the member's public key.

## Signature Verification

On receiving a message from Gun:

\`\`\`ts
const payload = await SEA.verify(rawContent, senderPub)
// payload === undefined if signature is invalid or data was tampered
if (!payload) { console.warn("Message failed verification"); return }
await db.put("messages", { ...payload, verified: true })
\`\`\`

Messages that fail verification are silently dropped and never written to IDB.

## Invite Links

A tribe invite link encodes:

- The tribe's Gun relay URL (or mesh URL in grid-down)
- The tribe's \`pub\` key (so the joining device can verify tribe signatures)
- The tribe ID

The joining device does not receive the tribe's \`priv\` or \`epriv\` — those remain with the founder and designated diplomats.
        `,
      },
      {
        id: "e2e-dms",
        title: "End-to-End Encrypted DMs",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# End-to-End Encrypted DMs

Direct messages between tribe members are end-to-end encrypted using ECDH key exchange. The Gun relay sees only ciphertext.

## Key Exchange

Each DM pair shares a unique symmetric key derived via ECDH:

\`\`\`ts
// Sender derives the shared secret:
const sharedSecret = await SEA.secret(recipientEpub, myIdentityPair)

// Recipient derives the identical shared secret:
const sharedSecret = await SEA.secret(senderEpub, myIdentityPair)
\`\`\`

\`SEA.secret()\` performs an ECDH key agreement: both sides independently derive the same 256-bit key using their own private key and the other party's public key. The result is identical on both ends.

## Encryption

Messages are encrypted before writing to Gun:

\`\`\`ts
const encrypted = await SEA.encrypt(plaintext, sharedSecret)
gun.get(\`tribes/\${tribeId}/dms/\${channelId}/\${msgId}\`).put(
  gunEscape({ content: encrypted, from: myPub })
)
\`\`\`

## Decryption

On receive:

\`\`\`ts
const raw = gunUnescape(fromGun)
const sharedSecret = await SEA.secret(senderEpub, myPair)
const plaintext = await SEA.decrypt(raw.content, sharedSecret)
\`\`\`

## DM Channel ID

Each DM pair has a deterministic channel ID derived from the sorted pair of public keys:

\`\`\`ts
const channelId = [myPub, recipientPub].sort().join(":")
\`\`\`

This ensures both parties write to and read from the same Gun path.

## Gun Path

\`\`\`
tribes/{tribeId}/dms/{channelId}/{messageId}
\`\`\`

## Reactions and Replies

Reactions are stored as delta objects keyed by \`{msgId}:reactions:{emoji}:{reactorPub}\` and merged on read. Replies reference the parent message ID in a \`replyTo\` field. Both are encrypted with the same shared secret.

## Forward Secrecy

The current implementation uses a static ECDH shared secret per pair. This means compromising one device's \`epriv\` exposes all past messages with that pair. A ratchet-based approach (Signal Protocol) would provide forward secrecy and is on the roadmap, but adds significant key management complexity.

## Security Properties

- **Confidentiality:** The relay sees only AES-GCM ciphertext. Without both parties' \`epriv\` keys, messages cannot be decrypted.
- **Integrity:** Gun SEA AES-GCM includes an authentication tag. Tampered ciphertext will fail decryption.
- **Attribution:** Each message is also signed by the sender's identity key (in addition to being encrypted).
        `,
      },
      {
        id: "federation-encryption",
        title: "Federation Encryption",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Federation Encryption

Inter-tribe federation channels use tribe-level ECDH keypairs to encrypt messages between tribes.

## How It Works

When two tribes federate, their founders exchange tribe \`epub\` keys (encryption public keys). Each tribe uses the other's \`epub\` and their own tribe \`epriv\` to derive a shared channel secret:

\`\`\`ts
// My tribe's side:
const channelSecret = await SEA.secret(otherTribeEpub, myTribeKeyPair)

// Other tribe's side (derives the same secret):
const channelSecret = await SEA.secret(myTribeEpub, otherTribeKeyPair)
\`\`\`

All federation messages are encrypted with this channel secret before being written to Gun.

## Channel ID

The federation channel ID is deterministic:

\`\`\`ts
const channelId = [myTribePub, otherTribePub].sort().join(":")
\`\`\`

## Gun Path

\`\`\`
federation/{channelId}/messages/{messageId}
federation/{channelId}/trades/{proposalId}
\`\`\`

## The Diplomat Role

The tribe's \`epriv\` (encryption private key) is normally held only by the founder. To allow other members to participate in federation, the founder grants the **Diplomat** role and shares the \`epriv\` with them.

Diplomats can:
- Read and send federation messages
- Submit and respond to trade proposals
- Receive federated threat alerts

Non-diplomat members cannot read federation channel content — they don't have the tribe \`epriv\` needed to derive the channel secret.

## Federated Threat Alerts

Allied tribes can broadcast threat alerts that appear in your dashboard's notification count. These alerts are:

1. Signed by the originating tribe's ECDSA identity key
2. Transmitted through the federation channel (encrypted with the channel secret)
3. Verified on receive against the originating tribe's \`pub\`

This means spoofed alerts (from unknown parties) are cryptographically rejected.

## Alliance Lifecycle

\`\`\`
Tribe A initiates → pending
Both founders exchange epub keys → active
Either founder can revoke → revoked (channel secret is abandoned)
\`\`\`

Alliance status is stored in \`federation-relationships\` IDB and synced via Gun within each tribe.
        `,
      },
    ],
  },

  // ─── Core Systems ─────────────────────────────────────────────────────────
  {
    id: "core-systems",
    label: "Core Systems",
    tag: "CORE SYSTEMS",
    accentColor: "green",
    articles: [
      {
        id: "authority-permissions",
        title: "Authority & Permissions Model",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Authority & Permissions Model

Plus Ultra uses a five-tier authority hierarchy. All authority is stored per-member in IDB and Gun-synced to peers.

## The Five Tiers

| Role | Assigned by | Capabilities |
|------|-------------|-------------|
| **Founder** | Automatic (tribe creator) | Full admin. Cannot be revoked by anyone. |
| **Elder Council** | Founder | Full admin. Can appoint/revoke lead, member, restricted. |
| **Lead** | Founder, Elder Council | Create events in assigned skill domains. Edit/cancel domain events. |
| **Member** | Default for new joins | Create personal events only. Can declare skills, cast votes. |
| **Restricted** | Founder, Elder Council | Read-only. Cannot create events, vote, or declare skills. |

## Domain-Scoped Leads

Leads have authority scoped to their skill domain. A Lead in the Medical domain can create and edit Medical events, but not Security events. Founders and Elder Council have cross-domain authority.

A member can hold Lead authority in multiple domains simultaneously.

## Key Permission Checks

All checks are in \`packages/core/src/permissions.ts\`:

| Function | Returns true when... |
|----------|---------------------|
| \`canCreateEvent(member, eventType)\` | Member is Founder/Elder for any type; Lead for their domain; Member for personal events only |
| \`canEditEvent(member, event)\` | Member is the event creator, or Founder/Elder, or Lead in the event's domain |
| \`canManageRoles(member)\` | Member is Founder or Elder Council |
| \`canViewFullHealth(viewer, subject)\` | Viewer holds a medical role or is Founder/Elder; otherwise only sees health status |
| \`canInitiateMuster(member)\` | Member is Lead, Elder, or Founder |
| \`canCreateProposal(member)\` | Any member in good standing (not Restricted) |
| \`canVote(member, proposal)\` | Depends on governance model: all members (direct/hybrid-major) or leads only (council/hybrid-operational) |

## Storing Authority

Authority is stored in the \`authority\` field of the member record in the \`members\` IDB store:

\`\`\`ts
interface Member {
  pub: string
  tribeId: string
  authority: "founder" | "elder_council" | "lead" | "member" | "restricted"
  leadDomains?: string[]   // Only set when authority === "lead"
  // ...
}
\`\`\`

Authority changes are written to IDB + Gun-synced. All connected peers receive the update via their \`map().on()\` subscription on the members path.

## Revoking Authority

Founders and Elder Council can downgrade a member's authority. Founders cannot be downgraded — the \`canManageRoles\` check explicitly blocks attempts to modify the founder record.
        `,
      },
      {
        id: "governance",
        title: "Governance & Proposals",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Governance & Proposals

Plus Ultra supports three governance models, each with the same proposal lifecycle but different voting eligibility rules.

## The Three Models

| Model | Who votes | Best for |
|-------|-----------|---------|
| **Council** | Domain leads only | Efficient operational decisions |
| **Direct Democracy** | All members | Maximum inclusion, slower pace |
| **Hybrid** | Leads for operational; all members for major | Balance of efficiency and inclusion |

The governance model is chosen at tribe creation and stored in the tribe record.

## Proposal Lifecycle

\`\`\`
create → open (discussion period) → voting → outcome
                                          ├─ passed (quorum met, majority yes)
                                          ├─ failed (quorum met, majority no or deadline expired)
                                          └─ withdrawn (creator withdraws while open)
\`\`\`

Proposals can only be withdrawn by their creator while in \`open\` status. Once voting begins, withdrawal is disabled.

## Quorum

Default: 51% of eligible voters must cast a vote for the result to be valid. Quorum threshold is configurable per-tribe.

**Eligible voters:**
- Council model: all members with Lead, Elder, or Founder authority
- Direct Democracy: all members with Member authority or above
- Hybrid: depends on the proposal's \`scope\` field (\`"operational"\` or \`"major"\`)

## Early-Pass Detection

When quorum is met before the deadline and the remaining unvoted members cannot mathematically flip the result, the proposal closes immediately as passed:

\`\`\`
yes_votes / (yes_votes + no_votes + remaining_votes) > 0.51
→ even if all remaining votes are "no", outcome is determined
→ proposal closes as PASSED
\`\`\`

## Hybrid Model Scope

In the Hybrid model, the proposal creator sets a \`scope\` field:

- \`"operational"\` — council votes (leads + elders + founder)
- \`"major"\` — full tribe votes (all members)

Examples: a weekly schedule change is operational; a change to the tribe charter is major.

## Discussion Threads

Each proposal has a comment thread stored in \`proposal-comments\` IDB. Comments are Gun-synced. Any member can comment during the open period.

## Proposal-to-Goal Bridge

When a proposal passes, the Elder Council can convert it directly to a tribe goal via the **Create Goal from Proposal** action. This preserves the decision context and connects governance to execution.

## IDB Stores

| Store | Key | Contains |
|-------|-----|---------|
| \`proposals\` | \`tribeId:proposalId\` | Proposal record with status, votes summary, scope |
| \`proposal-votes\` | \`proposalId:memberPub\` | Individual vote (yes/no/abstain + timestamp) |
| \`proposal-comments\` | \`proposalId:commentId\` | Discussion thread entries |
        `,
      },
      {
        id: "skills-ontology",
        title: "Skills & Role Ontology",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Skills & Role Ontology

Plus Ultra defines 53 specific roles across 11 survival domains, organized into three tiers by criticality. The registry lives in \`packages/core/src/registries/skills.ts\`.

## Three Tiers

**Tier 1 — Critical:** Skills where a gap directly threatens survival.

| Domain | Roles | Count |
|--------|-------|-------|
| Medical | Physician, Nurse, Paramedic, Dentist, Midwife, Veterinarian, Pharmacist | 7 |
| Food & Agriculture | Farmer, Livestock Handler, Hunter, Fisherman, Forager, Beekeeper, Butcher, Seed Saver, Food Preserver | 9 |
| Security & Defense | Tactical Shooter, Squad Leader, Strategic Commander, Sniper, Combat Medic, Intel/Recon, Armorer, K9 Handler | 8 |
| Water | Well Driller, Water Treatment, Plumber | 3 |

**Tier 2 — Essential:** Skills required for infrastructure and sustained operations.

| Domain | Roles | Count |
|--------|-------|-------|
| Energy & Power | Electrician, Solar Tech, Generator Mechanic, Battery Specialist | 4 |
| Construction & Engineering | Carpenter, Mason, Welder, Heavy Equipment Operator, Structural Engineer, Blacksmith, Surveyor | 7 |
| Communications & Technology | HAM Radio Operator, Network Engineer, SIGINT, Cryptographer, Drone Pilot | 5 |
| Logistics & Supply | Cook, Quartermaster, Vehicle Mechanic, Fuel Specialist | 4 |

**Tier 3 — Multipliers:** Skills that amplify the effectiveness of Tier 1 and 2 members.

| Domain | Roles | Count |
|--------|-------|-------|
| Knowledge & Training | Teacher, Skills Trainer, Historian, Chaplain | 4 |
| Governance & Administration | Strategic Planner, Mediator, Scribe, Diplomat | 4 |
| Craft & Sustainability | Seamstress, Cobbler, Potter, Soapmaker, Brewer | 5 |

## Scaling Curves

Each role specifies how many members are needed as the tribe grows:

| Curve | Formula | Example roles |
|-------|---------|--------------|
| \`linear\` | slots = population × rate | Tactical Shooter (1 per 5 members) |
| \`sqrt\` | slots = √population × factor | Medical roles (diminishing returns) |
| \`log\` | slots = log(population) × factor | Commander (1 covers a lot) |
| \`fixed\` | slots = constant | Chaplain (always 1) |

The Tribe Schematic uses these curves to show coverage gaps vs. current declared skills.

## Proficiency Levels

\`\`\`
basic → competent → proficient → expert → verified expert
\`\`\`

Level-up requires a combination of peer vouches and logged training hours (configurable per role). Elder Council approves promotions from the level-up queue on the dashboard.

## Declaring a Skill

Members navigate to **My Station → Declare Skill** and select a role. They specify:
- Proficiency level
- Sub-specializations (free text, e.g., "Wilderness EMT" for Paramedic)
- Years of experience
- Availability (full-time / part-time / on-call)

The declaration is signed with the member's identity key, stored in \`skills\` IDB, and Gun-synced to peers.

## Vouching

Any member can vouch for another member's declared skill. Vouches accumulate on the skill record. Vouches from members with higher authority or verified expertise in the same domain carry more weight in the level-up eligibility calculation.
        `,
      },
      {
        id: "asset-ontology",
        title: "Asset Ontology",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Asset Ontology

Plus Ultra tracks 48 physical assets across five categories. The registry lives in \`packages/core/src/registries/assets.ts\`.

## Categories

| Category | Count | Examples |
|----------|-------|---------|
| Land | 4 | Homestead, Farmland, Timber Lot, Water Source |
| Structures | 13 | Main House, Barn, Greenhouse, Root Cellar, Workshop, Armory, Medical Bay, Comms Room, Watchtower, Well House, Solar Array, Fuel Storage, Guesthouse |
| Equipment | 18 | Water Filtration, Solar Panels, Generator, Radio (HF/VHF/UHF), Medical Kit, Surgical Kit, Trauma Kit, Water Pump, Irrigation System, Tractor, Chainsaw, Forge, Lathe, Sewing Machine, Food Dehydrator, Pressure Canner, Seed Bank, Beehives |
| Vehicles | 6 | Pickup Truck, ATV, Motorcycle, Boat, Cargo Van, Armored Vehicle |
| Stores | 8 | Food (months), Water (gallons), Fuel (gallons), Ammo (rounds), Medicine (months), Seeds (lbs), Tools (sets), Cash/Silver |

## Criticality

Each asset is flagged \`critical: true\` or \`false\`. Critical assets affect the tribe's survivability score — a gap in a critical asset (e.g., no water filtration) reduces the score more severely than a gap in a non-critical asset (e.g., no boat).

## Scaling Curves

Assets use the same four scaling curve types as roles: \`linear\`, \`sqrt\`, \`log\`, \`fixed\`. The Tribe Schematic computes how many of each asset the tribe needs at its current population and shows the gap against what's declared in inventory.

## Inventory Data

Each asset entry in the \`inventory\` IDB store contains:

\`\`\`ts
interface InventoryItem {
  tribeId: string
  assetType: string      // e.g., "water_filtration"
  quantity: number
  unit: string           // e.g., "units", "gallons", "months"
  notes: string          // Free text: location, condition, access instructions
  lastUpdatedBy: string  // Member pubkey
  lastUpdatedAt: number  // Unix ms
}
\`\`\`

## Role-Gated Edits

Inventory edits require the Quartermaster role or Elder Council authority, except for general consumable stores (food, water, fuel, ammo, medicine) which any member can update. This prevents accidental or unauthorized changes to structural and equipment records.

## Consumption Tracking

The \`consumption-log\` store records consumption entries for stores assets. The data layer computes a rolling burn rate from recent entries and calculates days-until-depletion against the current inventory quantity. Three depletion statuses: \`healthy\`, \`warning\`, \`critical\`.

## Production Tracking

The \`production-log\` store records what the tribe produces (food from farming, water from well, etc.). Net position = inventory + (production rate − consumption rate) × days. This net figure appears in the inventory screen alongside the raw burn rate.
        `,
      },
      {
        id: "psych-engine",
        title: "Psychological Profiling Engine",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Psychological Profiling Engine

The profiling engine maps tribe members across six psychological dimensions and derives an archetype, helping the tribe understand its composition and assign roles effectively.

## The Six Dimensions

Each dimension is scored 0–100:

| Dimension | Low (0) | High (100) |
|-----------|---------|-----------|
| Decision Speed | Deliberate | Decisive |
| Stress Tolerance | Reactive | Resilient |
| Leadership Style | Directive | Collaborative |
| Conflict Approach | Avoidant | Assertive |
| Risk Appetite | Conservative | Bold |
| Social Energy | Introverted | Extraverted |

## The Six Archetypes

| Archetype | Key signals | Role in tribe |
|-----------|------------|--------------|
| **Commander** | Decisive + Resilient + Directive | High-stakes ops leadership |
| **Scout** | Bold + Decisive | Recon, first contact |
| **Strategist** | Deliberate + Resilient + Conservative | Long-range planning |
| **Connector** | High Social Energy + Collaborative | Morale, mediation |
| **Planner** | Deliberate + Conservative + Introverted | Operations, logistics |
| **Sustainer** | Resilient + Collaborative + Avoidant | Cohesion, stability |

Archetype derivation is rule-based first. If no single rule fires (ambiguous profile), the engine falls back to nearest-centroid: the archetype whose centroid vector is closest to the member's dimension scores.

## Three Scoring Inputs

### 1. Quiz (70% weight)

18-question assessment: 10 scenario-based questions and 8 forced-rank pairs. Each answer applies per-dimension delta values to a starting score of 50 for each dimension.

\`\`\`ts
// Simplified scoring:
const scores = { decisionSpeed: 50, stressTolerance: 50, ... }
answers.forEach(({ dimension, delta }) => {
  scores[dimension] = clamp(scores[dimension] + delta, 0, 100)
})
\`\`\`

### 2. Anonymous Peer Ratings (30% weight)

Members rate each other on three dimensions: Stress Tolerance, Leadership Style, and Conflict Approach. Rules:
- One rating per rater per subject per week
- Rater identity is never stored — only a deterministic week hash: \`sha256(raterPub + weekNumber)\` is stored for local dedup
- Ratings from multiple raters are averaged and blended with the quiz result at 30% weight

### 3. Passive Inference

Voting behavior passively nudges \`decisionSpeed\`:
- Voting quickly relative to the proposal deadline → +1 to Decisive
- Voting at the last moment → -1 (toward Deliberate)

This requires no user action — the nudge fires automatically after each vote is cast.

## Where Profiles Surface

| Location | What's shown |
|----------|-------------|
| Member profile → Psych tab | Full archetype card, radar chart, Big Five bars |
| Tribe dashboard → Psychology | Archetype distribution across all members |
| Proposal voter list | Archetype badge next to each voter's name |
| Role assignment dropdown | Role-fit % shown when member has a profile |

## Privacy

Peer ratings are anonymous to recipients. The rating values (dimension scores) are stored in \`peer-ratings\` IDB only on the rater's device for dedup purposes. The aggregated dimension averages sync via Gun without rater attribution.
        `,
      },
      {
        id: "grid-down-mode",
        title: "Grid-Down Operational Mode",
        readingTime: "6 min read",
        lastUpdated: "2026-03-17",
        content: `
# Grid-Down Operational Mode

Grid-down mode is a tribe-wide operational state that transforms the app's UI and prioritizes crisis-critical functions.

## Five-Stage Escalation

The app measures how long the Gun relay has been unreachable and escalates through five stages:

| Stage | Trigger | Banner | Actions |
|-------|---------|--------|---------|
| 0 | Relay reachable | None | Normal operation |
| 1 | Offline < 5 min | Small dot | None |
| 2 | Offline 5 min–3 hr | Yellow warning banner | None |
| 3 | Offline 3–6 hr | Orange banner | Infrastructure Checklist appears |
| 4 | Offline 6–12 hr | Red banner | PACE plan surfaced on dashboard |
| 5 | Offline 12–24 hr OR manual declare | Full grid-down | Nav reorder, drill mode available |

\`offlineSince\` is persisted in \`localStorage\` so stage survives page reloads, app restarts, and background kills.

## Manual Declaration

Founders and Elder Council can manually declare grid-down before the 24hr threshold — for drills or when infrastructure failure is confirmed visually before the relay is unreachable. The declaration is Gun-synced to all tribe members.

## Nav Card Reorder

In grid-down mode (Stage 5), the navigation automatically surfaces the five most critical screens first:

1. Roll Call (Muster)
2. PACE Comms Plan
3. Inventory
4. Map
5. Bug-Out Plans

Grid-up-only features (Proposals, Finances, Federation, Psychology) are dimmed but still accessible.

## Infrastructure Failure Checklist (Stage 3+)

11 infrastructure items each member can independently mark as failing in their area:

Water · Power · Stores · TV/Broadcast · Radio · Cell Service · Gas/Fuel · Banks/ATMs · Hospitals · Police/Fire · Roads

Reports are stored in \`member-infra-status\` IDB per member and Gun-synced. A collapsible **Tribe Reports** section shows all other members' checked items in real time.

## Bug-Out CTA

When **all 11 items are checked** AND the device has been offline for 24+ hours, a prominent **BUG OUT NOW** card appears on the dashboard linking directly to the active bug-out plan.

## Drill Mode

Triggered by initiating a muster with reason \`grid_down_drill\`. Drill mode shows a 4-item checklist card on the dashboard. It auto-expires after a configurable duration (3, 5, or 7 days) or can be manually cleared.

## Grid-State IDB Store

\`\`\`ts
interface GridState {
  tribeId: string
  mode: "normal" | "grid_down"
  declaredAt?: number       // unix ms
  declaredBy?: string       // member pubkey
  expiresAt?: number        // unix ms (for drill mode)
  isDrill: boolean
  offlineSince?: number     // unix ms (set by relay ping, not declaration)
}
\`\`\`

The \`grid-state\` store is synced via Gun under \`tribes/{tribeId}/grid-state\` so all members see the same declared state.
        `,
      },
      {
        id: "offline-detection",
        title: "Offline Detection & Sync Queue",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Offline Detection & Sync Queue

The offline detection system actively monitors relay connectivity rather than relying on \`navigator.onLine\`, which is unreliable for detecting actual server reachability.

## offline-tracker.ts

### The Relay Ping

Every 60 seconds, \`offline-tracker.ts\` sends a lightweight HTTP GET to the Gun relay endpoint (e.g., \`https://relay.plus-ultra.world/health\`). If the request fails or times out:

1. The failure count increments
2. \`offlineSince\` is set in \`localStorage\` (if not already set)
3. The current stage is recomputed from \`Date.now() - offlineSince\`
4. \`grid-up-changed: false\` is emitted

If the ping succeeds:
1. \`offlineSince\` is cleared from \`localStorage\`
2. \`grid-up-changed: true\` is emitted
3. \`flushSyncQueue()\` and \`flushPendingSyncs()\` are called
4. \`stopMeshMode()\` is called

### Subscribing to Changes

\`\`\`ts
import { onGridUpChanged } from "@/lib/offline-tracker"

const unsub = onGridUpChanged((isUp: boolean) => {
  // Update UI, toggle features, etc.
})
// Call unsub() to clean up
\`\`\`

The \`useIsGridUp()\` hook wraps this for React components.

## sync-queue.ts

### Accumulation

When \`getSyncTier()\` returns \`"local"\`, data-layer functions call \`queueForSync(gunPath, data)\` instead of writing to Gun:

\`\`\`ts
// Stored in queued-messages IDB:
interface QueuedWrite {
  id: string
  gunPath: string
  data: object
  queuedAt: number   // unix ms
  attempts: number
}
\`\`\`

### Flush

When \`grid-up-changed: true\` fires, \`flushSyncQueue()\` replays all queued writes in insertion order:

\`\`\`ts
async function flushSyncQueue() {
  const queued = await db.getAll("queued-messages")
  for (const item of queued) {
    gun.get(item.gunPath).put(gunEscape(item.data))
    await db.delete("queued-messages", item.id)
  }
}
\`\`\`

### Dedup

If the same Gun path is queued multiple times (e.g., repeated edits to the same message while offline), \`queueForSync()\` replaces the existing entry for that path rather than appending. The most recent value wins.

## pending-syncs (Convex Queue)

A parallel queue in \`pending-syncs\` IDB accumulates Convex mutations that couldn't fire while grid-down:

\`\`\`ts
interface PendingSync {
  id: string
  mutation: string       // e.g., "messages:send"
  args: object
  queuedAt: number
}
\`\`\`

\`flushPendingSyncs()\` in \`sync-adapter.ts\` replays them in order on grid-up restore. Failed mutations are retried up to 3 times, then dropped with a warning.
        `,
      },
    ],
  },

  // ─── Building & Self-Hosting ──────────────────────────────────────────────
  {
    id: "building",
    label: "Building & Self-Hosting",
    tag: "BUILDING & SELF-HOSTING",
    accentColor: "amber",
    articles: [
      {
        id: "dev-setup",
        title: "Development Setup",
        readingTime: "5 min read",
        lastUpdated: "2026-03-17",
        content: `
# Development Setup

Get a full local development environment running in under 10 minutes.

## Prerequisites

| Requirement | Version | Install |
|-------------|---------|---------|
| Node.js | 18+ | nodejs.org |
| Rust + Cargo | stable | \`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \\| sh\` |
| Tauri CLI prereqs | — | See tauri.app/start/prerequisites/ for your platform |

## Install

\`\`\`bash
git clone https://github.com/adam7rans/plus-ultra
cd plus-ultra
npm install
\`\`\`

## Run Development

\`\`\`bash
npm run dev
# Opens the Tauri desktop window (Vite + React + Rust shell)
# OR open http://localhost:5173 in Chrome for browser-only dev (no native features)
\`\`\`

## Environment Variables

\`packages/app/.env\` controls the Gun relay and Convex connection:

\`\`\`
VITE_GUN_RELAY=ws://localhost:8765/gun
VITE_CONVEX_URL=https://your-deployment.convex.cloud
\`\`\`

\`VITE_CONVEX_URL\` is optional — omit it to run in Gun-only mode.

## 3-Context Local Test Setup

Testing multi-user sync locally requires three concurrent processes:

\`\`\`bash
# Terminal 1 — Gun relay:
npm run relay
# → ws://localhost:8765/gun

# Terminal 2 — Tauri app (User A):
cd packages/app && npx tauri dev

# Terminal 3 — nothing needed; open in Chrome:
# http://localhost:5173 (User B)
\`\`\`

Both the Tauri app and the Chrome tab will connect to the local relay and sync in real time. Create a tribe in one and join from the other to test the full sync flow.

## Running Tests

\`\`\`bash
npm test
# Runs Vitest on packages/core — 398 tests covering scoring, permissions, registries, and sync logic
\`\`\`

## Android Development

See the **Android Setup Guide** in the P2P Mesh Sync section for the full setup including Kotlin plugin registration and permissions.

## Troubleshooting

**"Could not find Tauri configuration"** — Run from the repo root, not from \`packages/app/\`.

**Gun sync not working between contexts** — Ensure \`npm run relay\` is running and \`VITE_GUN_RELAY\` in \`.env\` points to \`ws://localhost:8765/gun\`.

**Rust compilation fails** — Run \`rustup update stable\` and ensure all Tauri platform prerequisites are installed for your OS.
        `,
      },
      {
        id: "build-targets",
        title: "Build Targets",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Build Targets

Plus Ultra builds to macOS, Windows, Linux, Android, and iOS from a single codebase.

## Build Commands

\`\`\`bash
# Web-only build (no Tauri shell):
npm run build
# Output: packages/app/dist/

# Native desktop app (current platform):
npm run build:desktop
# macOS  → packages/app/src-tauri/target/release/bundle/macos/
# Windows → packages/app/src-tauri/target/release/bundle/msi/
# Linux   → packages/app/src-tauri/target/release/bundle/appimage/

# Android APK:
npm run build:android
# Output: packages/app/src-tauri/gen/android/app/build/outputs/apk/release/

# iOS IPA (macOS only):
npm run build:ios
# Output: packages/app/src-tauri/gen/apple/build/
\`\`\`

## Platform Requirements

| Target | Additional requirements |
|--------|------------------------|
| macOS | Xcode Command Line Tools |
| Windows | Visual Studio Build Tools, WebView2 |
| Linux | \`libgtk-3-dev\`, \`libwebkit2gtk-4.1-dev\`, \`libappindicator3-dev\` |
| Android | Android Studio, NDK, Rust Android targets |
| iOS | macOS, Xcode, Apple Developer account |

## Android Build

Android requires Rust cross-compilation targets:

\`\`\`bash
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
\`\`\`

The build produces a debug or release APK. For release builds, configure a signing keystore in \`packages/app/src-tauri/gen/android/app/build.gradle.kts\` — see the Tauri Android signing documentation.

## iOS Build

\`\`\`bash
# Requires macOS + Xcode:
npm run tauri ios dev        # Run on simulator or connected device
npm run build:ios            # Build IPA for distribution
\`\`\`

Distribution requires an Apple Developer account and a provisioning profile configured in Xcode.

## Current Status

| Target | Status |
|--------|--------|
| macOS | ✅ Validated |
| iOS | Scaffold complete, device test pending |
| Android | Requires Android Studio setup |
| Windows | Untested (Tauri supports it) |
| Linux | Untested (Tauri supports it) |

## Serving the PWA

The \`dist/\` output from \`npm run build\` is a full offline-capable PWA. It can be served from any static file server for browser-only use without the Tauri shell — useful for team members who don't have a smartphone or for desktop browser access.
        `,
      },
      {
        id: "gun-relay",
        title: "Running the Gun Relay",
        readingTime: "3 min read",
        lastUpdated: "2026-03-17",
        content: `
# Running the Gun Relay

The Gun relay is a lightweight Node.js server that lets multiple devices sync in real time. It is the primary sync transport in grid-up mode.

## Local Development

\`\`\`bash
npm run relay
# → Gun relay listening on ws://localhost:8765/gun
\`\`\`

The relay persists Gun graph data to \`relay/radata/\`. Leave it running in a separate terminal alongside your dev server.

## Configuration

Set \`VITE_GUN_RELAY\` in \`packages/app/.env\` to point the app at any relay:

\`\`\`
# Local:
VITE_GUN_RELAY=ws://localhost:8765/gun

# Production:
VITE_GUN_RELAY=wss://relay.your-domain.com/gun
\`\`\`

## Relay vs. Mesh Relay

| | External Gun relay | Embedded mesh relay (Phase A) |
|---|---|---|
| Port | 8765 | 8766 |
| Location | Remote server | Inside Tauri binary |
| Active when | Grid-up | Grid-down |
| Protocol | Gun relay | Gun relay (same protocol) |

Both run the same Gun relay protocol. The mesh relay is a fallback — it activates automatically when the external relay is unreachable.

## Production Deployment

For production, the relay should be deployed on a stable server with a domain name, behind a reverse proxy with TLS:

\`\`\`nginx
# nginx example:
location /gun {
    proxy_pass http://127.0.0.1:8765;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
\`\`\`

See \`CLOUD-INFRASTRUCTURE.md\` in the repo root for the full production deployment plan (work in progress).

## Gun Relay Data

The relay stores Gun graph data in \`relay/radata/\`. This directory can grow over time. Periodically archiving or clearing old data (for retired tribes) is recommended for long-running deployments.
        `,
      },
      {
        id: "convex-deploy",
        title: "Convex Deployment",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Convex Deployment

Convex provides cloud persistence and reactive queries for grid-up scenarios. It is optional — the app runs fully on Gun alone without it.

## Prerequisites

- A Convex account at convex.dev (free tier is sufficient for small tribes)
- Convex CLI: \`npm install -g convex\`

## Deploy

From the repo root:

\`\`\`bash
npx convex deploy
\`\`\`

This deploys the schema and serverless functions from the \`convex/\` directory to your Convex project. The CLI will prompt you to log in and select a project on first run.

## Environment Variables

After deployment, set the Convex URL in \`packages/app/.env\`:

\`\`\`
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud
\`\`\`

Also set this variable in your Convex dashboard under **Settings → Environment Variables** if any serverless functions need to reference external services.

## Graceful Fallback

If \`VITE_CONVEX_URL\` is not set:
- \`convexWrite()\` becomes a no-op
- \`flushPendingSyncs()\` skips without error
- The app runs in Gun-only mode
- No UI errors, no broken features (Gun handles all sync)

This makes Convex fully opt-in. Self-hosted deployments that don't want any cloud dependency can omit it entirely.

## Convex + Gun Coexistence

Both run simultaneously in grid-up mode. They don't conflict:

- **Gun** handles real-time peer-to-peer sync (messages arriving as you type, member status changes, etc.)
- **Convex** handles cloud persistence and initial hydration when a device joins or reinstalls

IDB is the single source of truth that both write to. Reads always come from IDB, not directly from Gun or Convex.

## What Convex Syncs

| Convex table | Source IDB store | Direction |
|---|---|---|
| \`members\` | \`members\` | Bidirectional |
| \`messages\` | \`messages\` | Write: device → cloud; Read: cloud → IDB on load |
| \`tribes\` | \`tribe-cache\` | Bidirectional |
| \`skills\` | \`skills\` | Write: device → cloud |
| \`alerts\` | \`alerts\` | Bidirectional |

## Re-deploying After Schema Changes

After editing \`convex/schema.ts\` or any function file:

\`\`\`bash
npx convex deploy
\`\`\`

Convex handles schema migrations automatically for additive changes. Destructive changes (removing fields) require a migration function.
        `,
      },
      {
        id: "griddown-distribution",
        title: "Grid-Down App Distribution",
        readingTime: "4 min read",
        lastUpdated: "2026-03-17",
        content: `
# Grid-Down App Distribution

In a grid-down scenario where tribe members can't access the internet or app stores, Plus Ultra includes a local distribution server that serves the app over the LAN.

## The Serve-App Server

\`relay/serve-app.js\` is a Node.js HTTP server that:

1. Detects all non-loopback network interfaces (WiFi, hotspot, Ethernet)
2. Prints the local URL for each interface
3. Displays a QR code for each URL in the terminal
4. Serves the built PWA from \`packages/app/dist/\`
5. Serves an Android APK at \`/app.apk\` if \`relay/app.apk\` exists

## Running It

First build the app, then start the server:

\`\`\`bash
npm run build
npm run serve-app
\`\`\`

Output example:

\`\`\`
Plus Ultra — Local App Server
────────────────────────────────
Network: 192.168.1.42 (en0)
  http://192.168.1.42:3000

Hotspot: 172.20.10.1 (ap1)
  http://172.20.10.1:3000

[QR codes displayed for each URL]

APK: http://192.168.1.42:3000/app.apk
────────────────────────────────
\`\`\`

## How Members Install

**PWA (all platforms):**
1. Open the URL on their phone's browser (Chrome on Android, Safari on iOS)
2. Tap the browser menu → **Add to Home Screen** / **Install App**
3. The PWA installs to the home screen and works fully offline

**Android APK (native install):**
1. Open the APK URL on their Android phone
2. Allow installation from unknown sources when prompted
3. Install the native Tauri app for full mesh sync (WiFi Direct + BLE) support

## Prerequisites

- Build the app first: \`npm run build\`
- All devices must be on the same WiFi network or phone hotspot
- The serving phone must remain on and connected to the hotspot while others install

## Use Cases

- Distributing the app to new tribe members in the field without internet
- Updating all tribe members to the latest version via LAN push
- Serving the APK to Android devices for native installation (WiFi Direct + BLE)

## Combining with the Gun Relay

Run both the Gun relay and the app server on the same machine:

\`\`\`bash
# Terminal 1:
npm run relay
# → ws://192.168.1.42:8765/gun

# Terminal 2:
npm run serve-app
# → http://192.168.1.42:3000
\`\`\`

Members install the app via the serve-app URL, then configure \`VITE_GUN_RELAY\` to the local relay for sync. Or use the embedded mDNS mesh relay (Phase A) — which auto-starts on grid-down and requires no configuration at all.
        `,
      },
    ],
  },

  {
    id: "vetting-recruits",
    label: "Vetting Recruits",
    tag: "VETTING RECRUITS",
    accentColor: "amber",
    articles: [
      {
        id: "trust-chain-intro",
        title: "Introduction to the Trust Chain",
        readingTime: "5 min read",
        lastUpdated: "2026-02-10",
        content: `
# Introduction to the Trust Chain

Plus Ultra's trust model is built on **cryptographic trust chains** — the same concept used in SSL certificate hierarchies and PGP web-of-trust systems, adapted for tactical mesh networks.

## What Is a Trust Chain?

A trust chain is a graph of cryptographic signatures that establishes verified identity across your network. In Plus Ultra:

- Each node has a unique **keypair**
- When you vet a new contact, you **sign their public key** with yours
- This signature is stored on both devices and broadcast to your mesh
- Your mesh only relays messages from nodes that are **reachable through your trust graph**

\`\`\`
[Your Key]
    │
    ├── signs ──▶ [Alpha-1 Key]
    │                  │
    │                  └── signs ──▶ [Bravo-3 Key]
    │
    └── signs ──▶ [Charlie-7 Key]
\`\`\`

In this example, you directly trust Alpha-1 and Charlie-7. You transitively trust Bravo-3 because Alpha-1 vouches for them.

## Trust Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| 0 | ⛔ | Unknown / Untrusted |
| 1 | 🔑 | Directly vetted by you |
| 2 | 🔗 | Vouched for by a Level-1 contact |
| 3 | 🌐 | Vouched for by a Level-2 contact |

> **Best practice:** Only communicate sensitive information with Level-1 contacts. Use Level-2/3 only for non-sensitive operational coordination.

## Why This Matters

Traditional apps use centralized servers to manage contact lists. If the server goes down (or is seized), your contact list disappears. Plus Ultra's trust chain is:

- **Stored locally** on every device in your mesh
- **Cryptographically verified** — cannot be forged without your private key  
- **Propagated automatically** across your mesh network
- **Functional offline** — no server needed for trust verification
        `,
      },
      {
        id: "vetting-session",
        title: "Running a Vetting Session",
        readingTime: "8 min read",
        lastUpdated: "2026-02-28",
        content: `
# Running a Vetting Session

A vetting session is the process by which your group evaluates and cryptographically authorizes a new member. This is the most security-critical operation in Plus Ultra.

## Pre-Vetting Checklist

Before initiating a vetting session, confirm:

- [ ] You are in a **private, physically secure location**
- [ ] All existing members have their devices in **airplane mode + local mesh only**
- [ ] The new recruit has **installed Plus Ultra** and completed first-boot key generation
- [ ] At least one existing member acts as the **Session Lead**

## The Vetting Session Protocol

### Phase 1: Identity Verification (In-Person Only)

1. The recruit displays their **Node ID** and **public key fingerprint** from: \`Profile → Share Identity\`
2. The Session Lead reads the 6-word **key verification phrase** aloud
3. All members present confirm the phrase matches on their devices
4. Conduct any additional in-person identity checks your group requires

### Phase 2: Cryptographic Authorization

1. Session Lead navigates to **Contacts → Vet New Node → Begin Session**
2. All existing members receive a **vetting request notification**
3. Each member individually taps **Approve** after verifying identity
4. Once a **quorum** (configurable, default: 51% of existing members) approves, the new node is added to the trust chain
5. A **vetting certificate** is generated, signed by all approving members, and distributed to the mesh

### Phase 3: Onboarding

1. New recruit receives the **Group Mesh Config** — a signed configuration package that includes:
   - Mesh radio frequencies and channels
   - Group-specific message formats
   - Emergency protocol identifiers
2. Recruit's device performs a **proof-of-work handshake** with the mesh to prevent replay attacks
3. Member is now **MESH-ACTIVE** within your group

## Configuring Quorum Requirements

\`\`\`
Settings → Group Policy → Vetting Quorum
  ├─ Minimum approvals: [3]
  ├─ Require unanimous for Level-1: [OFF]
  └─ Require Session Lead signature: [ON]
\`\`\`

> **Security recommendation:** For groups handling sensitive operations, set quorum to 100% and require Session Lead signature.
        `,
      },
      {
        id: "revoking-access",
        title: "Revoking Node Access",
        readingTime: "4 min read",
        lastUpdated: "2026-03-05",
        content: `
# Revoking Node Access

Revoking a compromised or untrusted node is a time-sensitive operation. This guide covers the revocation protocol, propagation timing, and post-revocation security hardening.

## When to Revoke

Revoke a node immediately if:

- 🔴 The device has been **physically seized** or is missing
- 🔴 You believe the device has been **compromised by malware**
- 🔴 A member has **violated operational security** policies
- 🔴 A member has **left the group** under any circumstances
- 🟡 A member's device has been **factory reset** (they should revoke themselves and re-vet)

## Initiating Revocation

\`\`\`
Contacts → [Node Name] → Advanced → Revoke Trust → Confirm
\`\`\`

You will be asked to specify a revocation reason (stored locally for your records, not broadcast):

| Code | Reason |
|------|--------|
| R-01 | Device lost or stolen |
| R-02 | Security compromise suspected |
| R-03 | Member departure |
| R-04 | Protocol violation |

## What Happens During Revocation

1. A **signed revocation certificate** is created using your private key
2. The certificate is immediately broadcast to all nodes currently in range
3. Each node that receives it updates its trust graph and stops relaying for the revoked node
4. The revocation propagates across the full mesh — estimated **30–90 seconds** under typical conditions

## Post-Revocation Hardening

After revoking a compromised node, assume they have knowledge of:
- Your mesh radio channels and frequencies
- The rough positions of all mesh nodes
- Message formats and protocol identifiers

**Recommended post-revocation steps:**

1. **Rotate mesh channel** — \`Group Settings → Radio Config → Rotate Channel\`
2. **Issue new group keys** — \`Group Settings → Security → Rekey Mesh\`
3. **Notify all members** via an out-of-band channel (different device, in-person)
4. **Audit recent message logs** for evidence of intelligence gathering
        `,
      },
    ],
  },

  {
    id: "mesh-hardware",
    label: "Mesh Hardware Setup",
    tag: "MESH HARDWARE SETUP",
    accentColor: "green",
    articles: [
      {
        id: "hardware-overview",
        title: "Supported Hardware Overview",
        readingTime: "5 min read",
        lastUpdated: "2026-01-30",
        content: `
# Supported Hardware Overview

Plus Ultra supports multiple radio hardware configurations, from pure-software Bluetooth LE to long-range LoRa setups. This page catalogs all certified hardware.

## Tier 1: Built-In (No Additional Hardware)

All modern smartphones with Bluetooth 5.0+ can participate in a Plus Ultra mesh using built-in BLE.

| Capability | Range | Bandwidth | Power |
|------------|-------|-----------|-------|
| Bluetooth LE 5.0 | ~100m urban / 300m open | 2 Mbps | Low |
| Bluetooth LE 5.1+ | ~100m urban / 400m open | 2 Mbps | Low |

> **Recommended for:** Urban scenarios, indoor operations, quick-deploy short-range meshes.

## Tier 2: Plus Ultra LoRa Dongle (Recommended)

The official **Plus Ultra LoRa Dongle v2** connects via USB-C or Lightning and extends your range dramatically.

| Model | Frequency | Max Range | Interface |
|-------|-----------|-----------|-----------|
| PU-LoRa-2 (US) | 915 MHz | 40km line-of-sight | USB-C |
| PU-LoRa-2 (EU) | 868 MHz | 40km line-of-sight | USB-C |
| PU-LoRa-2L (Lightning) | 915 MHz | 40km line-of-sight | Lightning |

> **Regulatory note:** LoRa operates in ISM bands and does not require a license in the US and most countries. Check local regulations before deployment.

## Tier 3: Third-Party Compatible Hardware

The following third-party boards are supported via the Plus Ultra Hardware Bridge protocol:

- **Meshtastic-compatible devices** (Heltec V3, T-Beam, RAK4631)
- **LilyGO T-Deck** (standalone device with built-in LoRa + keyboard)
- **Raspberry Pi + LoRa HAT** (for fixed relay node deployments)

\`\`\`
To pair a third-party device:
Settings → Hardware → Add LoRa Device → Scan for Compatible Devices
\`\`\`

## Tier 4: Fixed Infrastructure Nodes

For base camp or home deployments, a fixed relay node dramatically expands coverage:

- Uses a Raspberry Pi 4B + LoRa HAT
- Powered by solar or UPS for grid-down resilience
- Configured via **Plus Ultra Node Manager** desktop app (macOS / Linux / Windows)
- Functions as both a relay and a **message store-and-forward buffer** for offline nodes
        `,
      },
      {
        id: "lora-config",
        title: "LoRa Dongle Configuration",
        readingTime: "9 min read",
        lastUpdated: "2026-02-18",
        content: `
# LoRa Dongle Configuration

This guide walks through pairing the Plus Ultra LoRa Dongle v2 with your device and optimizing radio settings for your deployment scenario.

## Pairing the Dongle

1. Connect the dongle to your device via USB-C or Lightning
2. Plus Ultra detects the dongle automatically and prompts for initialization
3. Allow \`Hardware Access\` permission when prompted
4. The dongle runs a self-test and displays the firmware version:
\`\`\`
PU-LoRa-2 v1.4.2 detected
Region: US-915MHz
TX Power: 17 dBm
Status: READY
\`\`\`

## Radio Configuration Parameters

Navigate to \`Settings → Hardware → PU-LoRa-2 → Radio Config\`

### Spreading Factor (SF)

The spreading factor controls the trade-off between range and data rate:

| SF | Range | Data Rate | Use Case |
|----|-------|-----------|----------|
| SF7  | ~5km  | 5.47 kbps | Urban/suburban, high traffic |
| SF9  | ~15km | 1.76 kbps | Rural, moderate traffic |
| SF11 | ~30km | 0.54 kbps | Long-range, sparse messages |
| SF12 | ~40km | 0.29 kbps | Maximum range, emergency only |

> **Recommendation:** Use SF9 for most deployments. Reserve SF12 for emergency beacon-only scenarios.

### Bandwidth

| Setting | Bandwidth | Notes |
|---------|-----------|-------|
| BW-125  | 125 kHz   | Best range, default |
| BW-250  | 250 kHz   | Shorter range, 2× throughput |
| BW-500  | 500 kHz   | Indoor/short range only |

### TX Power

| Setting | Power | Legal Max (US) |
|---------|-------|----------------|
| LOW     | 14 dBm | — |
| MEDIUM  | 17 dBm | — |
| HIGH    | 20 dBm | ✅ Max allowed on ISM |
| BOOST   | 22 dBm | ⚠️ Varies by region — verify legality |

## Channel Plan

Each group uses a dedicated **channel** (frequency offset + encryption key pair) to prevent cross-group interference:

\`\`\`
Group Settings → Radio Config → Channel Plan
  ├─ Primary:    CH-04 (915.6 MHz)
  ├─ Secondary:  CH-08 (916.4 MHz)  [fallback if CH-04 congested]
  └─ Emergency:  CH-00 (915.0 MHz)  [broadcast-only beacon channel]
\`\`\`

## Antenna Selection

The stock dongle includes a flexible 3dBi antenna suitable for most scenarios. For extended range:

- **Directional Yagi (9dBi):** Point-to-point links, up to 2× range improvement
- **Fiberglass Omni (5dBi):** Base station use, improved range in all directions
- **Magnetic Mount (3dBi):** Vehicle mounting

> All antennas use SMA connectors. An SMA-to-RP-SMA adapter is included with the dongle.
        `,
      },
      {
        id: "antenna-range",
        title: "Antenna & Range Optimization",
        readingTime: "6 min read",
        lastUpdated: "2026-03-08",
        content: `
# Antenna & Range Optimization

Getting maximum range from your mesh requires understanding RF propagation, antenna placement, and environmental factors.

## The Friis Path Loss Equation (Simplified)

Range degrades with terrain, obstacles, and RF interference. A rough field formula:

\`\`\`
Effective Range ≈ Free-Space Range × Terrain Factor

Terrain Factors:
  Open farmland / desert:  × 1.0  (full rated range)
  Light forest / suburbs:  × 0.7
  Dense urban:             × 0.4
  Heavy forest / mountain: × 0.3
\`\`\`

## Antenna Height Is Everything

Raising your antenna is the single most effective range improvement. The 2× height rule:

- **Doubling antenna height** approximately doubles the radio horizon
- A relay node at **30m elevation** can cover 3–4× the area of a ground-level node
- Rooftop, hilltop, and vehicle-roof mounting are strongly recommended for relay nodes

## Interference Mitigation

### Sources of Interference

| Source | Frequency | Impact |
|--------|-----------|--------|
| 802.11b/g Wi-Fi | 2.4 GHz | None (different band) |
| Other LoRa networks | 915 MHz | Moderate — use channel separation |
| 900 MHz cellular | ~850-900 MHz | Low in US, varies by region |
| Power lines | Broadband noise | Low — stay 5m+ away |

### Channel Separation Strategy

If you detect interference on your primary channel:

1. **Diagnostics → RF Spectrum → Scan** — visual waterfall display of band activity
2. Identify a low-noise channel slot
3. Issue a **channel migration** to all mesh members: \`Group Settings → Migrate Channel\`
4. All members automatically switch within 30 seconds via signed command broadcast

## Relay Node Placement Strategy

For maximum mesh coverage, place relay nodes at:

1. **High points** — rooftops, hilltops, water towers
2. **Edges of your coverage area** — not the center
3. **Line-of-sight corridors** — between two clusters of users
4. **Terrain transitions** — valley exits, ridge lines

\`\`\`
Optimal topology for 6-person group over 10km² area:

  [Relay-Hilltop]
       ↑
  ┌────┴────────────────────┐
  │                         │
[Alpha] ── [Bravo]     [Charlie] ── [Delta]
               ↓                ↑
            [Echo]──────────[Foxtrot]
\`\`\`
        `,
      },
    ],
  },

  {
    id: "security",
    label: "Security & OpSec",
    tag: "SECURITY & OPSEC",
    accentColor: "amber",
    articles: [
      {
        id: "encryption-arch",
        title: "Encryption Architecture",
        readingTime: "8 min read",
        lastUpdated: "2026-02-05",
        content: `
# Encryption Architecture

This document provides a technical deep dive into Plus Ultra's encryption stack. It is intended for security researchers, auditors, and technically advanced users.

## Overview

Plus Ultra uses a **double-ratchet algorithm** derived from the Signal Protocol for forward secrecy, combined with LoRa-specific optimizations for low-bandwidth environments.

\`\`\`
Message Encryption Flow:
  1. Key Exchange:   ECDH(Curve25519) → Shared Secret
  2. Key Derivation: HKDF-SHA256(Shared Secret) → Symmetric Key
  3. Encryption:     AES-256-GCM(Symmetric Key, Nonce, Message)
  4. Authentication: GCM built-in AEAD tag (128-bit)
  5. Transport:      Signed envelope (Ed25519) wraps encrypted payload
\`\`\`

## Key Exchange Protocol

### Initial Handshake (X3DH Extended Triple Diffie-Hellman)

When two nodes first communicate:

1. **Sender** generates an ephemeral keypair \`(ek_pub, ek_priv)\`
2. **Sender** computes: \`DH1 = ECDH(ik_priv, spk_pub)\` (identity × signed prekey)
3. **Sender** computes: \`DH2 = ECDH(ek_priv, ik_pub)\` (ephemeral × identity)
4. **Sender** computes: \`DH3 = ECDH(ek_priv, spk_pub)\` (ephemeral × signed prekey)
5. **Master Secret** = KDF(DH1 ∥ DH2 ∥ DH3)

This ensures **forward secrecy** — compromise of long-term keys doesn't compromise past session keys.

## Double Ratchet for Forward Secrecy

After initial handshake, the Double Ratchet algorithm provides:

- **Forward secrecy:** Past messages cannot be decrypted even if current keys leak
- **Break-in recovery:** Compromise is self-healing after a few message exchanges

\`\`\`
Chain Key Ratchet:
  CK_n → HMAC-SHA256(CK_n, 0x01) → CK_n+1
  MK_n → HMAC-SHA256(CK_n, 0x02)  (message key for message n)
\`\`\`

## LoRa Packet Format

LoRa has a maximum payload of 222 bytes at SF7/BW-125. Plus Ultra optimizes its packet structure for this constraint:

| Field | Size | Description |
|-------|------|-------------|
| Version | 1 byte | Protocol version |
| Flags | 1 byte | Packet type, hop count |
| Source Node ID | 4 bytes | Sender identity (truncated) |
| Dest Node ID | 4 bytes | Recipient identity (truncated) |
| Sequence | 2 bytes | Message deduplication |
| Nonce | 12 bytes | AES-GCM nonce |
| Payload | ≤182 bytes | Encrypted message body |
| Auth Tag | 16 bytes | AES-GCM authentication tag |

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Passive RF monitoring | AES-256-GCM encryption — ciphertext reveals nothing |
| Active MITM attack | X3DH + SAS verification during vetting |
| Replay attacks | Sequence numbers + timestamp window |
| Node impersonation | Ed25519 signatures on all packets |
| Key compromise | Double ratchet provides break-in recovery |
| Physical seizure | Hardware-backed key storage, duress wipe |
        `,
      },
      {
        id: "opsec",
        title: "OpSec Best Practices",
        readingTime: "6 min read",
        lastUpdated: "2026-03-10",
        content: `
# OpSec Best Practices

Cryptographic security is only one layer of a complete operational security posture. This guide covers the human and procedural factors that determine whether your mesh remains secure in the field.

## Device Hardening

### Before You Deploy

- [ ] Enable full-disk encryption on your device (FileVault / Android FBE)
- [ ] Set a strong PIN (8+ digits) or complex passphrase — no biometrics in high-risk scenarios
- [ ] Disable USB debugging and developer mode
- [ ] Remove all non-essential apps that request network, location, or microphone access
- [ ] Enable auto-wipe after 10 failed unlock attempts
- [ ] Store your Plus Ultra backup keyfile on a **separate, encrypted USB drive**

### In the Field

- [ ] Enable **Airplane Mode** by default — enable radios only when actively communicating
- [ ] Disable Wi-Fi scanning (Android) — it generates MAC address broadcasts even in airplane mode
- [ ] Keep screen brightness low — reduce TEMPEST-style optical surveillance risk
- [ ] Use wired earbuds for audio — reduces RF emissions vs. Bluetooth audio

## Communication Discipline

### Message Content

> **Assume your encrypted traffic metadata is observable** even if message content is not. An adversary may not read your messages, but can observe when, how often, and between which nodes communication occurs.

Best practices for message content:

- Use pre-agreed code words for sensitive locations, times, and personnel
- Never include personally identifiable information in messages
- Prefer short, high-information-density messages — reduce transmission time
- Confirm receipt with a brief acknowledgment rather than re-sending

### Transmission Timing

- Avoid regular, predictable transmission schedules (traffic analysis)
- Use **burst messaging** — compose multiple messages, send them together
- Enable **random delay jitter** in Settings → Privacy → Transmission Timing

## Physical Security

### Device Loss

If a device is lost or seized:

1. **Immediately** notify all mesh members via out-of-band channel
2. **Revoke** the lost device from your mesh (see: Revoking Node Access)
3. **Rotate** the group channel and rekey the mesh
4. **Assume** the lost device will be exploited — review what information it contained

### Faraday Storage

When not in use or during transport through unsecured areas:

- Store devices in a **Faraday cage** or bag to prevent remote location tracking
- Faraday bags block GPS, cellular, Wi-Fi, and Bluetooth simultaneously
- A properly sealed metal enclosure (ammo can, etc.) works as an improvised Faraday cage

\`\`\`
Testing your Faraday bag:
1. Place device in bag, seal completely
2. Call the device from another phone
3. It should ring once then go to voicemail immediately
4. If it rings normally, the bag has a gap — seal it
\`\`\`
        `,
      },
    ],
  },
];

// Helper: get a flat list of all articles with their category context
export interface FlatArticle extends DocArticle {
  categoryId: string;
  categoryLabel: string;
  accentColor: "green" | "amber";
}

export function getAllArticles(): FlatArticle[] {
  return docCategories.flatMap((cat) =>
    cat.articles.map((a) => ({
      ...a,
      categoryId: cat.id,
      categoryLabel: cat.label,
      accentColor: cat.accentColor,
    }))
  );
}