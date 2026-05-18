# Apex Mining

A professional cryptocurrency mining, investment, and education platform built with modern web technologies.

## Overview

Apex Mining is a multi-page static website featuring:

- **Cloud Mining Contracts** — 6 tiers from Starter ($500) to Institutional ($250,000+)
- **Investment Programs** — 8 programs across crypto funds, staking, managed portfolios, and yield farming
- **Professional Courses** — 6 courses from beginner to advanced levels
- **Live Market Data** — Real-time crypto prices via CoinGecko API
- **User Dashboard** — Portfolio tracking, transaction history, and withdrawal flow
- **Payment System** — Multiple payment methods (Crypto, Bank, Cash App, Venmo, Zelle, Apple Pay)

## Tech Stack

- **HTML5** — Semantic markup
- **Tailwind CSS** — Utility-first styling via CDN
- **Font Awesome** — Icons
- **Google Fonts** — Inter & Space Grotesk
- **Vanilla JavaScript** — All interactivity
- **CoinGecko API** — Live market data (free, no key required)

## File Structure

apex-mining/
├── index.html          # Homepage with hero, stats, features, CTA
├── mining.html         # Cloud mining contracts
├── courses.html        # Professional crypto education
├── investments.html    # Investment programs with filtering
├── dashboard.html      # User portfolio & transaction history
├── markets.html        # Live crypto market data
├── about.html          # Company info, team, partners
├── payment.html        # Payment methods & proof upload
├── script.js           # Shared JavaScript (auth, modals, ticker, etc.)
└── README.md           # This file

## Features

### Design
- Dark premium fintech theme (navy #0a0e1a, cyan #06b6d4, gold #f59e0b)
- Glass morphism cards with backdrop blur
- Gradient text effects
- Button shine animations
- Hover lift effects
- Custom scrollbar
- Mobile-responsive hamburger menu

### Functionality
- **Authentication** — Login/signup modals with localStorage persistence
- **Live Price Ticker** — Animated header ticker with real CoinGecko data
- **Investment Filtering** — Category tabs (All, Funds, Staking, Managed, Yield)
- **Payment Methods** — 6 methods with detailed instructions per selection
- **Drag & Drop Upload** — Payment proof file upload zone
- **Copy to Clipboard** — Wallet addresses and bank details
- **Toast Notifications** — Success/error feedback

## Getting Started

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. No build step or server required — fully static

## Deployment

### GitHub Pages
1. Push all files to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Your site will be live at `https://yourusername.github.io/repo-name`

### Custom Domain
1. Add a `CNAME` file with your domain
2. Configure DNS A records to GitHub Pages IPs
3. Enable HTTPS in repository settings

## API Notes

The CoinGecko API is used for live market data:
- Free tier: 10-30 calls/minute
- No API key required
- Fallback data displays if API is unavailable

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari & Chrome

## License

© 2026 Apex Mining. All rights reserved.
