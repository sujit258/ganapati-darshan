const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dest = path.join(__dirname, '../public/images/ganpati/fallback.webp');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C2D12"/>
      <stop offset="50%" stop-color="#C2410C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)" rx="24"/>
  <circle cx="600" cy="400" r="220" fill="#FFFFFF" fill-opacity="0.12" stroke="#FDE047" stroke-width="4" stroke-dasharray="12,8"/>
  <text x="600" y="460" font-size="160" text-anchor="middle" font-family="system-ui">🪔</text>
  <text x="600" y="680" font-family="Noto Sans Devanagari, system-ui, sans-serif" font-size="56" font-weight="bold" fill="#FFFFFF" text-anchor="middle">गणपती दर्शन</text>
  <text x="600" y="750" font-family="Noto Sans Devanagari, system-ui, sans-serif" font-size="32" font-weight="500" fill="#FDE047" text-anchor="middle">पुणे गणेशोत्सव मार्गदर्शक</text>
</svg>
`;

sharp(Buffer.from(svg))
  .webp({ quality: 85 })
  .toFile(dest)
  .then(() => {
    console.log('Created fallback.webp successfully');
  })
  .catch(err => console.error(err));
