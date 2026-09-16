const fs = require('fs');
const src = fs.readFileSync('data/tools.ts', 'utf8');

// Split registry into per-tool chunks on `slug: '...'`
const slugRe = /slug:\s*'([^']+)'/g;
const slugs = [];
let m;
while ((m = slugRe.exec(src))) slugs.push({ slug: m[1], index: m.index });

const all = new Set(slugs.map((s) => s.slug));
console.log('total tool entries:', slugs.length);
console.log('unique slugs:', all.size);

const seen = new Map();
for (const s of slugs) {
  if (seen.has(s.slug)) console.log('DUPLICATE SLUG:', s.slug);
  seen.set(s.slug, true);
}

// relatedSlugs referencing unknown slugs
const relRe = /relatedSlugs:\s*\[([^\]]*)\]/g;
const broken = new Set();
while ((m = relRe.exec(src))) {
  const list = m[1].match(/'([^']+)'/g) || [];
  for (const raw of list) {
    const slug = raw.slice(1, -1);
    if (!all.has(slug)) broken.add(slug);
  }
}
console.log('broken relatedSlugs targets:', broken.size ? [...broken].sort() : 'none');

// entries with no component -> render as "Soon"
const chunks = [];
for (let i = 0; i < slugs.length; i++) {
  const start = slugs[i].index;
  const end = i + 1 < slugs.length ? slugs[i + 1].index : src.length;
  chunks.push({ slug: slugs[i].slug, body: src.slice(start, end) });
}
const noComponent = chunks.filter((c) => !/\bcomponent:/.test(c.body)).map((c) => c.slug);
console.log('entries without a component:', noComponent.length ? noComponent : 'none');

// category coverage
const cats = {};
for (const c of chunks) {
  const cm = c.body.match(/category:\s*'([^']+)'/);
  if (cm) cats[cm[1]] = (cats[cm[1]] || 0) + 1;
}
console.log('per-category counts:', cats);
