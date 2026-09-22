# ⚡ QuickClip Share — Instant Clip Share & Ephemeral Cloud Clipboard

> **Live Web App:** [https://instant-clipboard-mu.vercel.app/](https://instant-clipboard-mu.vercel.app/)  
> **Try it online:** [QuickClip Share – Instant Clip Share Across Devices](https://instant-clipboard-mu.vercel.app/)

**QuickClip Share** is a secure developer tool designed to **share clip online** with zero friction. Built for fast cross-device sync, it delivers **instant clip share** functionality for text snippets, secrets, code blocks, and files using auto-expiring 6-digit sync keys and dynamic QR codes.

---

## 🌐 Live Deployment & Target Keywords

- **Official URL:** [https://instant-clipboard-mu.vercel.app/](https://instant-clipboard-mu.vercel.app/)
- **Core Functionality:** Quick clip share, instant clip share, ephemeral cloud clipboard, share clip online without login.
- **Creator / Developer:** Raj Patel

---

## ✨ Features

- ⚡ **Sub-Millisecond Read/Write:** High-performance data pipelines powered by Upstash Redis over TLS/SSL.
- 🔑 **Zero Authentication Required:** Share clip online instantly using auto-generated 6-digit access codes or camera-scannable QR codes.
- ⏱️ **Auto-Expiring Lifecycle:** Strict 10-minute Time-To-Live (TTL) memory policies ensure no stale data remains stored.
- 🔥 **Burn-After-Reading:** One-time retrieval mode that permanently destroys payload immediately upon being read.
- 🛡️ **Brute-Force & Abuse Defense:** Hardened API endpoints protected by IP-based rate limiting (10 attempts/min).
- 📱 **Seamless Cross-Device Sync:** Designed for mobile-to-desktop clipboard handoffs with direct URL auto-fetching (`/?code=XXXXXX`).

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, ioredis, express-rate-limit
- **Database / Cache:** Upstash Redis (Serverless In-Memory Data Store)
- **Frontend:** HTML5, Tailwind CSS, Lucide Icons, QRCode.js, Vanilla JavaScript (ES6+)
- **Deployment Platform:** Vercel (Serverless Functions)

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/Rajeng221/instant-clipboard.git](https://github.com/Rajeng221/instant-clipboard.git)
cd instant-clipboard