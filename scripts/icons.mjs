// Gera os PNGs-fonte do icone e splash (assets/) a partir do icone key-fill
// do Bootstrap Icons. Depois: `npx capacitor-assets generate --android`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const key = (fill) => `<path fill="${fill}" d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>`;
// icone de 16x16 centralizado num canvas de `size`, ocupando `ratio` da largura
const svg = (size, ratio, fill, bg) => {
  const s = (size * ratio) / 16, off = (size - 16 * s) / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    (bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : "") +
    `<g transform="translate(${off} ${off}) scale(${s})">${key(fill)}</g></svg>`);
};

const TEAL = "#14b8a6", DARK = "#0a0e11";
mkdirSync("assets", { recursive: true });
await sharp(svg(1024, 0.5, "#ffffff", TEAL)).png().toFile("assets/icon-only.png");
await sharp(svg(1024, 0.38, "#ffffff")).png().toFile("assets/icon-foreground.png");
await sharp(svg(1024, 1, TEAL, TEAL)).png().toFile("assets/icon-background.png");
await sharp(svg(2732, 0.16, TEAL, DARK)).png().toFile("assets/splash.png");
await sharp(svg(2732, 0.16, TEAL, DARK)).png().toFile("assets/splash-dark.png");
console.log("icons: assets/*.png gerados");
