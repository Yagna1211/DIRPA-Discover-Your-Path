const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const illustrations = [
  { id: 'illustration1', bg1: '#fef3c7', bg2: '#fde68a', main: '🐼', badge: '🧥', border: '#b45309' },
  { id: 'illustration2', bg1: '#e0f2fe', bg2: '#bae6fd', main: '🐱', badge: '👔', border: '#0284c7' },
  { id: 'illustration3', bg1: '#fef9c3', bg2: '#fef08a', main: '🐶', badge: '🧢', border: '#ca8a04' },
  { id: 'illustration4', bg1: '#f3e8ff', bg2: '#e9d5ff', main: '🐩', badge: '👓', border: '#9333ea' },
  { id: 'illustration5', bg1: '#ffedd5', bg2: '#fed7aa', main: '🐻', badge: '🧢', border: '#ea580c' },
  { id: 'illustration6', bg1: '#ccfbf1', bg2: '#99f6e4', main: '🐨', badge: '👕', border: '#0d9488' },
  { id: 'illustration7', bg1: '#fce7f3', bg2: '#fbcfe8', main: '😸', badge: '🧣', border: '#db2777' },
  { id: 'illustration8', bg1: '#ffe4e6', bg2: '#fecdd3', main: '🐶', badge: '🎀', border: '#e11d48' },
  { id: 'illustration9', bg1: '#fee2e2', bg2: '#fca5a5', main: '🦝', badge: '🧢', border: '#dc2626' },
  { id: 'person1', bg1: '#dcfce7', bg2: '#86efac', main: '👦', badge: '🧥', border: '#16a34a' },
  { id: 'person2', bg1: '#e0f2fe', bg2: '#7dd3fc', main: '👦', badge: '⭐', border: '#0284c7' },
  { id: 'person3', bg1: '#fef08a', bg2: '#facc15', main: '👧', badge: '🧢', border: '#ca8a04' },
  { id: 'person4', bg1: '#f3e8ff', bg2: '#d8b4fe', main: '👩', badge: '👓', border: '#9333ea' },
  { id: 'person5', bg1: '#e0e7ff', bg2: '#a5b4fc', main: '👩', badge: '🧢', border: '#4f46e5' },
  { id: 'person6', bg1: '#ffedd5', bg2: '#fb923c', main: '👦', badge: '🎒', border: '#ea580c' },
  { id: 'person7', bg1: '#f3e8ff', bg2: '#c084fc', main: '👧', badge: '🧢', border: '#7e22ce' },
  { id: 'person8', bg1: '#ffe4e6', bg2: '#fda4af', main: '👧', badge: '🎀', border: '#e11d48' },
  { id: 'person9', bg1: '#fee2e2', bg2: '#f87171', main: '👦', badge: '👓', border: '#dc2626' },
  { id: 'person10', bg1: '#d1fae5', bg2: '#34d399', main: '🧔', badge: '🎓', border: '#059669' },
  { id: 'person11', bg1: '#f1f5f9', bg2: '#94a3b8', main: '👨‍💼', badge: '💼', border: '#475569' },
  { id: 'person12', bg1: '#fef08a', bg2: '#eab308', main: '👱‍♀️', badge: '🧢', border: '#ca8a04' },
  { id: 'person13', bg1: '#dbeafe', bg2: '#60a5fa', main: '👩‍🏫', badge: '👓', border: '#2563eb' },
  { id: 'person14', bg1: '#ffedd5', bg2: '#f97316', main: '🧑', badge: '🧢', border: '#c2410c' },
  { id: 'person15', bg1: '#e2e8f0', bg2: '#64748b', main: '👴', badge: '🎓', border: '#334155' }
];

const publicDir = path.join(process.cwd(), 'public', 'illustrations');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

async function buildAll() {
  for (const item of illustrations) {
    const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad_${item.id}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${item.bg1}"/>
          <stop offset="100%" stop-color="${item.bg2}"/>
        </radialGradient>
        <filter id="shadow_${item.id}" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.25"/>
        </filter>
      </defs>
      <!-- Background circle with gradient and border -->
      <circle cx="128" cy="128" r="120" fill="url(#grad_${item.id})" stroke="${item.border}" stroke-width="8"/>
      <!-- Inner soft glow rim -->
      <circle cx="128" cy="128" r="114" fill="none" stroke="#ffffff" stroke-width="3" stroke-opacity="0.6"/>
      <!-- Main character -->
      <text x="128" y="152" font-size="110" text-anchor="middle" filter="url(#shadow_${item.id})">${item.main}</text>
      <!-- Badge element -->
      <g transform="translate(170, 170)">
        <circle cx="24" cy="24" r="28" fill="#ffffff" stroke="#000000" stroke-width="4"/>
        <text x="24" y="33" font-size="30" text-anchor="middle">${item.badge}</text>
      </g>
    </svg>`;

    // Save SVG file
    const svgPath = path.join(publicDir, `${item.id}.svg`);
    fs.writeFileSync(svgPath, svg, 'utf8');

    // Convert to PNG using sharp
    const pngPath = path.join(publicDir, `${item.id}.png`);
    await sharp(Buffer.from(svg))
      .resize(256, 256)
      .png()
      .toFile(pngPath);

    console.log(`Generated ${item.id}.png and ${item.id}.svg`);
  }
  console.log('BUILD COMPLETE: All 24 illustrations generated as 100% valid PNGs and SVGs!');
}

buildAll().catch(err => {
  console.error('Error generating illustrations:', err);
  process.exit(1);
});
