# Karpagam Physiotherapy — React (Vite + Tailwind)

One-page clinic site with booking form, smooth anchor nav, outcomes chart, and .ics calendar export.

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Free)

- **Vercel**: Import this repo; framework = Vite. It will detect `npm run build` and `dist/`.
- **Netlify**: New site → Import or drag `dist/`. Build: `npm run build`. Publish dir: `dist`.
- **GitHub Pages**: Use an action to deploy `dist/` or Netlify for easiest flow.

## Environment

- React 18
- Vite 5
- TailwindCSS 3
- Recharts + Framer Motion + Lucide

## Customize

Edit brand details in `src/index.tsx` at the top:
```ts
const BRAND = "Karpagam Physiotherapy";
const BRAND_EMAIL = "hello@karpagam.physio";
const BRAND_PHONE = "+91 99990 00111";
const BRAND_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=12.9700,77.6450";
```