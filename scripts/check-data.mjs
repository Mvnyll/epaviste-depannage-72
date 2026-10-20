import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { centers, serviceAreas } from "../src/js/data/centers.js";
import { searchServiceAreas } from "../src/js/services/area-search-service.js";
import { haversineDistanceKm } from "../src/js/services/distance-service.js";

assert.equal(serviceAreas.length, 54, "There must be exactly 54 service areas.");
assert.equal(serviceAreas.filter((area) => area.department === "72").length, 21);
assert.equal(serviceAreas.filter((area) => area.department === "53").length, 20);
assert.equal(serviceAreas.filter((area) => area.department === "41").length, 8);
assert.equal(serviceAreas.filter((area) => area.department === "61").length, 5);
assert.ok(serviceAreas.every((area) => /^\d{5}$/.test(area.postalCode)), "Postal codes must be five-character strings.");
assert.equal(new Set(serviceAreas.map((area) => area.id)).size, serviceAreas.length, "Area ids must be unique.");
assert.ok(serviceAreas.every((area) => area.mapsUrl.startsWith("https://www.google.com/maps/")));
assert.equal(centers.length, 0, "No physical center may be added without confirmed details.");

const gallerySource = readFileSync("src/js/data/gallery.js", "utf8");
const galleryImages = [...new Set(gallerySource.match(/parc-vehicules-\d{2}\.jpeg/g) || [])].sort();
assert.deepEqual(galleryImages, Array.from({ length: 6 }, (_, index) => `parc-vehicules-${String(index + 1).padStart(2, "0")}.jpeg`));
assert.ok(galleryImages.every((image) => existsSync(`public/assets/images/${image}`)), "Every gallery image must exist in public assets.");
assert.ok(existsSync("public/assets/images/logo-epaviste.png"), "The displayed logo must exist in public assets.");

assert.deepEqual(searchServiceAreas("72000").map((area) => area.city), ["Le Mans"]);
assert.deepEqual(searchServiceAreas("laval").map((area) => area.city), ["Laval", "Bonchamp-lès-Laval"]);
assert.deepEqual(searchServiceAreas("la fleche").map((area) => area.city), ["La Flèche"]);
assert.equal(searchServiceAreas("  CHÂTEAU-GONTIER  ").length, 1);
assert.equal(searchServiceAreas("41").length, 8);
assert.equal(searchServiceAreas("53").length, 20);
assert.equal(searchServiceAreas("61").length, 5);
assert.equal(searchServiceAreas("72").length, 21);
assert.deepEqual(
  ["Blois", "Vineuil", "La Chaussée-Saint-Victor", "Mer", "Contres (Le Controis-en-Sologne)", "Vendôme", "Romorantin-Lanthenay", "Montrichard Val de Cher", "Alençon", "Damigny", "Saint-Germain-du-Corbéis", "Arçonnay", "Sées", "Mamers", "Fresnay-sur-Sarthe", "Argentan"]
    .map((city) => serviceAreas.find((area) => area.city === city)?.postalCode),
  ["41000", "41350", "41260", "41500", "41700", "41100", "41200", "41400", "61000", "61250", "61000", "72610", "61500", "72600", "72130", "61200"],
);
assert.equal(searchServiceAreas("ville inconnue").length, 0);
assert.ok(Math.abs(haversineDistanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }) - 111.19) < 0.2);

function collectJavaScript(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectJavaScript(path) : path.endsWith(".js") ? [path] : [];
  });
}

for (const file of collectJavaScript("src/js")) {
  const source = readFileSync(file, "utf8");
  for (const unsafePattern of [/\binnerHTML\b/, /\bouterHTML\b/, /\binsertAdjacentHTML\s*\(/, /\beval\s*\(/, /\bnew\s+Function\b/, /\bdocument\.write\s*\(/]) {
    assert.doesNotMatch(source, unsafePattern, `${file} contains a dangerous HTML/code injection sink.`);
  }
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(result.status, 0, `${file}: ${result.stderr || result.stdout}`);
}

for (const page of ["index.html", "404.html", "mentions-legales.html", "politique-confidentialite.html"]) {
  const html = readFileSync(page, "utf8");
  assert.match(html, /http-equiv="Content-Security-Policy"/, `${page} must declare a Content Security Policy.`);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i, `${page} must not use inline event handlers.`);
  assert.doesNotMatch(html, /\sstyle\s*=/i, `${page} must not use inline styles.`);
}

const hostingHeaders = JSON.parse(readFileSync("firebase.json", "utf8")).hosting.headers;
const contentSecurityPolicy = hostingHeaders.flatMap((entry) => entry.headers).find((header) => header.key === "Content-Security-Policy")?.value;
assert.ok(contentSecurityPolicy?.includes("script-src 'self'"), "Hosting CSP must only allow same-origin scripts.");
assert.ok(contentSecurityPolicy?.includes("object-src 'none'"), "Hosting CSP must disable plugin content.");
assert.ok(contentSecurityPolicy?.includes("frame-src https://www.google.com https://maps.google.com"), "Hosting CSP must allow the embedded Google Maps frame.");

const homePage = readFileSync("index.html", "utf8");
assert.match(homePage, /src="\/src\/js\/main\.js"/, "The home page must load the source application entry point.");
assert.match(homePage, /href="\/src\/css\/main\.css"/, "The home page must load the source stylesheet.");
assert.match(homePage, /logo-epaviste\.png/, "The home page must reference the supplied logo.");
assert.match(homePage, /<iframe\b[^>]*src="https:\/\/www\.google\.com\/maps\?[^"]+output=embed"/i, "The contact section must embed the Google Maps location.");

const privacyPage = readFileSync("politique-confidentialite.html", "utf8");
assert.match(privacyPage, /ni formulaire, ni compte utilisateur.*ni base de données/s, "Privacy information must reflect the static site without visitor forms or a database.");
assert.match(privacyPage, /L’éditeur du site ne dépose, ne conserve ni ne traite aucun cookie/, "Privacy information must state that the site owner does not handle cookies.");
assert.match(privacyPage, /carte Google Maps intégrée.*susceptible de déposer ou lire ses propres cookies/s, "Privacy information must disclose possible cookies from embedded Google Maps.");

console.log("OK: zones et recherche, distances, JavaScript, CSP, pages sans code inline et vérification des sinks XSS.");
