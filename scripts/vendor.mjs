// Copia as bibliotecas de terceiros de node_modules para www/vendor, para o app
// funcionar sem internet (antes eram carregadas via CDN). As versoes ficam
// fixadas no package.json; rodar `npm run vendor` depois de qualquer npm install.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = join(root, "node_modules");
const out = join(root, "www", "vendor");

const files = {
  "bootstrap/dist/css/bootstrap.min.css": "bootstrap/bootstrap.min.css",
  "bootstrap/dist/js/bootstrap.bundle.min.js": "bootstrap/bootstrap.bundle.min.js",
  "bootstrap-icons/font/bootstrap-icons.min.css": "bootstrap-icons/bootstrap-icons.min.css",
  "bootstrap-icons/font/fonts": "bootstrap-icons/fonts",
};

rmSync(out, { recursive: true, force: true });
for (const [src, dest] of Object.entries(files)) {
  const target = join(out, dest);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(nm, src), target, { recursive: true });
}
console.log(`vendor: ${Object.keys(files).length} itens copiados para www/vendor`);
