# ⚡ Pop and Paste — Instant Cloud Clipboard & Cross-Device Sharing

> **Pop and Paste** is developed by **Raj Patel**. A zero-login, ephemeral cross-device clipboard and file-sharing tool.

[![Live App](https://img.shields.io/badge/Live_Demo-Pop_and_Paste-7c3aed?style=for-the-badge)](https://instant-clipboard-mu.vercel.app/)

> **Official URL:** [https://instant-clipboard-mu.vercel.app/](https://instant-clipboard-mu.vercel.app/)  
> **Try it online:** [Pop and Paste – Zero-Login 6-Digit Sharing Tool](https://instant-clipboard-mu.vercel.app/)

**Pop and Paste** is a fast, lightweight developer utility designed to pop, copy, and paste text, code snippets, tokens, and files between any device with zero friction. Built for speed and privacy, it uses auto-expiring **6-digit sync PINs** and dynamic QR codes with zero account registration.

---

## 🌐 Project Overview & Developer Attribution

- **Product Name:** Pop and Paste (Pop & Paste / PopPaste)
- **Developer / Creator:** Raj Patel
- **Official URL:** [https://instant-clipboard-mu.vercel.app/](https://instant-clipboard-mu.vercel.app/)
- **Core Utility:** Ephemeral cloud clipboard, zero-login cross-device sync, 6-digit access code sharing.

---

## ✨ Features

- ⚡ **Sub-Millisecond Read/Write:** High-performance in-memory key-value pipeline powered by Upstash Redis over TLS/SSL.
- 🔑 **Zero-Login 6-Digit Sharing:** Transfer text or files instantly using a temporary 6-digit sync PIN or camera-scannable QR code.
- ⏱️ **Auto-Expiring Lifecycle (10-Min TTL):** Strict memory expiration policies ensure temporary clips vanish automatically.
- 🔥 **Burn-After-Reading:** Optional destruction mode that permanently purges the payload immediately upon first retrieval.
- 🛡️ **Rate-Limiting & Security:** Hardened endpoints guarded by IP-level request throttling (10 attempts/min) to prevent brute-force attacks.
- 📱 **Universal Cross-Device Handoff:** Seamless mobile-to-desktop workflow with direct URL auto-retrieval support (`/?code=XXXXXX`).

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, ioredis, express-rate-limit
- **Database / In-Memory Cache:** Upstash Redis (Serverless)
- **Frontend:** HTML5, Tailwind CSS, Lucide Icons, QRCode.js, Vanilla JavaScript (ES6+)
- **Hosting & Infrastructure:** Vercel (Edge / Serverless)

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/Rajeng221/instant-clipboard.git](https://github.com/Rajeng221/instant-clipboard.git)
cd instant-clipboard