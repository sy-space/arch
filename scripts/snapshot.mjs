// Saves the current site as a named version for the preview's version switch.
//   node scripts/snapshot.mjs                 -> saves as "before"
//   node scripts/snapshot.mjs 1-arial         -> saves as "1-arial" (label ARIAL; the number only sets the order)
//   node scripts/snapshot.mjs --current "AFTER"  -> names the live dist/ version in the switch
//   node scripts/snapshot.mjs --clear         -> removes every saved version
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const compare = fileURLToPath(new URL('../.compare/', import.meta.url));
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const [first, second] = process.argv.slice(2);

if (first === '--clear') {
  await rm(compare, { recursive: true, force: true });
  console.log('Removed every saved version.');
} else if (first === '--current') {
  await mkdir(compare, { recursive: true });
  await writeFile(`${compare}CURRENT`, second || 'AFTER');
  console.log(`The live site is labelled ${second || 'AFTER'} in the switch.`);
} else {
  const name = first || 'before';
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Use lowercase letters, digits and dashes for the version name.');
  const target = `${compare}${name}/`;
  await rm(target, { recursive: true, force: true });
  // Media is not copied: saved versions read dist/assets through the preview server.
  await cp(dist, target, { recursive: true, filter: source => !source.includes('/assets') });
  console.log(`Saved the current site as ${name} in ${target}`);
}
