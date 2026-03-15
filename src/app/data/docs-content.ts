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