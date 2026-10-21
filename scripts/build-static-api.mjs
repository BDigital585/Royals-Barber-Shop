// Netlify only hosts static files, so the Express routes that listed the
// shop and haircut photos never run there. This runs after `vite build` and
// writes the same JSON those routes returned, plus copies the root public/
// folder (haircut photos, sitemap, robots.txt) that Express used to serve but
// Vite doesn't publish. netlify.toml points /api/* at these files.
import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "dist", "public");
const apiDir = path.join(outDir, "api");

if (!fs.existsSync(outDir)) {
  console.error("dist/public not found - run `vite build` first");
  process.exit(1);
}
fs.mkdirSync(apiDir, { recursive: true });

// Files Vite already published from client/public win over root public/
fs.cpSync(path.join(root, "public"), outDir, { recursive: true, force: false });

// Shop gallery: same filter and URL shape as GET /api/shop-images
const shopDir = path.join(root, "client", "public", "shop");
const shopExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp", ".jfif"];
const shopImages = fs.existsSync(shopDir)
  ? fs.readdirSync(shopDir)
      .filter((file) => shopExts.includes(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/shop/${file}`)
  : [];
fs.writeFileSync(path.join(apiDir, "shop-images.json"), JSON.stringify(shopImages));

// Haircut styles: same shape as GET /api/haircut-images ({ category: [urls] })
const haircutsDir = path.join(root, "public", "haircuts");
const imageMap = {};
if (fs.existsSync(haircutsDir)) {
  const categories = fs.readdirSync(haircutsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  for (const category of categories) {
    const files = fs.readdirSync(path.join(haircutsDir, category))
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort()
      .map((file) => `/haircuts/${encodeURIComponent(category)}/${encodeURIComponent(file)}`);
    if (files.length > 0) {
      imageMap[category] = files;
    }
  }
}
fs.writeFileSync(path.join(apiDir, "haircut-images.json"), JSON.stringify(imageMap));

// Target for the /api/* catch-all in netlify.toml
fs.writeFileSync(path.join(apiDir, "404.json"), JSON.stringify({ message: "Not found" }));

const haircutCount = Object.values(imageMap).flat().length;
console.log(`Static API: ${shopImages.length} shop images, ${Object.keys(imageMap).length} haircut categories with ${haircutCount} images`);
