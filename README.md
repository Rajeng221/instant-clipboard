# ⚡ QuickClip — Ephemeral Cloud Clipboard & File Transfer

QuickClip is an instant, zero-login cloud clipboard system built to transfer text snippets, code blocks, secrets, and files seamlessly across devices using short-lived 6-digit access keys and dynamic QR codes.

---

## ✨ Features

- ⚡ **Sub-Millisecond Read/Write:** Powered by Serverless Cloud Redis (Upstash) over TLS/SSL.
- 🔑 **Zero Authentication Required:** Instant access using an auto-generated 6-digit access code or dynamic QR code.
- ⏱️ **Auto-Expiring Lifecycle:** Strict 10-minute Time-To-Live (TTL) memory policies prevent stale data retention.
- 🔥 **Burn-After-Reading:** Automatically purges records permanently immediately upon initial receiver retrieval.
- 🛡️ **Brute-Force & Abuse Defense:** Hardened API endpoints with custom IP-based rate limiting (10 attempts/min).
- 📱 **Cross-Device Ready:** Responsive interface with automatic clipboard copy triggers and URL-parameter auto-fetching.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, ioredis, express-rate-limit
- **Database / Cache:** Upstash Redis (Serverless In-Memory Data Store)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS, Lucide Icons, QRCode.js
- **Deployment:** Vercel (Serverless Functions)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/Rajeng221/instant-clipboard.git](https://github.com/Rajeng221/instant-clipboard.git)
cd instant-clipboard