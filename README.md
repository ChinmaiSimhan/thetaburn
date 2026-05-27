# ThetaBurn 🔥

An interactive, beginner-friendly **Black-Scholes options simulator** built with React + TypeScript + Vite.

---

## File Structure

```
thetaburn/
├── index.html                    # Entry HTML (loads Google Fonts)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js            # Custom design tokens
├── postcss.config.js
├── netlify.toml                  # Netlify deploy config
├── public/
│   └── favicon.svg               # θ symbol
└── src/
    ├── main.tsx                  # React root
    ├── App.tsx                   # Page router (landing ↔ dashboard)
    ├── index.css                 # Global styles, custom slider CSS
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    ├── lib/
    │   └── blackScholes.ts       # Real Black-Scholes math + chart generators
    └── components/
        ├── LandingPage.tsx       # Hero section with animated Greek symbols
        ├── Dashboard.tsx         # Main layout + all state management
        ├── ControlsPanel.tsx     # Sliders + option/side selectors
        ├── SliderControl.tsx     # Individual slider with fill gradient
        ├── PremiumCard.tsx       # Animated premium display + P&L tracker
        ├── GreeksPanel.tsx       # Delta, Gamma, Theta, Vega, Rho cards
        ├── ChartsPanel.tsx       # 3 Recharts (Premium Curve, P&L, Theta Decay)
        ├── QuickSimPanel.tsx     # Preset scenario buttons
        └── ExplanationPanel.tsx  # Dynamic beginner explanations
```

---

## Setup & Run Locally

### 1. Prerequisites
- Node.js 18+ and npm

### 2. Install
```bash
cd thetaburn
npm install
```

### 3. Start dev server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 4. Production build
```bash
npm run build
```
Output goes to `dist/`. Preview it locally:
```bash
npm run preview
```

---

## Deploy to Netlify

### Option A — Drag & Drop (fastest)
1. Run `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder onto the page
4. Done — you get a live URL instantly

### Option B — GitHub + Netlify CI
1. Push this repo to GitHub
2. In Netlify dashboard → **Add new site** → **Import from Git**
3. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy — Netlify auto-deploys on every push

### Option C — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

The `netlify.toml` in the root already configures build command, publish dir, and SPA redirect rules.

---

## Features

| Feature | Details |
|---|---|
| **Black-Scholes** | Accurate Abramowitz & Stegun approximation for N(x) |
| **Greeks** | Delta, Gamma, Theta (per day), Vega (per 1% IV), Rho (per 1% rate) |
| **Charts** | Premium Curve, P&L at Expiry, Theta Decay — all using Recharts |
| **Quick Sims** | Stock ±5%, IV Crush/Spike, 7 Days Pass, Expiry Day |
| **P&L Tracker** | Set entry premium, watch live P&L update |
| **Explanations** | Dynamic beginner text that explains every change |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** (build tool)
- **TailwindCSS 3** (styling)
- **Framer Motion 11** (animations)
- **Recharts 2** (charts)
- **lucide-react** (icons)

---

*For educational purposes only. Not financial advice.*
