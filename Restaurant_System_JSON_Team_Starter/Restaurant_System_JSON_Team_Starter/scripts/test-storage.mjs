import assert from 'node:assert/strict';
import { mkdtemp, readdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const temporary = await mkdtemp(path.join(os.tmpdir(), 'restaurant-json-check-'));
process.env.RESTAURANT_JSON_DATA_DIR = temporary;
try {
  for (const file of await readdir('data')) if (file.endsWith('.json')) {
    await copyFile(path.join('data', file), path.join(temporary, file));
  }
  const { store } = await import('../shared/storage/index.ts');
  const { getCollectionPath } = await import('../shared/storage/json/getCollectionPath.ts');
  const original = await store.list('menuItems');
  assert.equal(original.length, 4);
  const sample = { ...original[0], id: 'test-item-001', name: 'Storage test item' };
  await store.create('menuItems', sample);
  assert.equal((await store.get('menuItems', sample.id)).name, sample.name);
  const disk = JSON.parse(await readFile(path.join(temporary, 'menuItems.json'), 'utf8'));
  assert(disk.some(row => row.id === sample.id));
  await store.update('menuItems', sample.id, { priceSen: 1999 });
  assert.equal((await store.get('menuItems', sample.id)).priceSen, 1999);
  await assert.rejects(() => store.create('menuItems', sample), /Duplicate/);
  await assert.rejects(() => store.update('menuItems', 'missing-id', { priceSen: 1 }), /not found/);
  assert.equal(await store.remove('menuItems', sample.id), true);
  assert.equal(await store.get('menuItems', sample.id), null);
  assert.equal(await store.remove('menuItems', sample.id), false);
  await Promise.all(Array.from({ length: 20 }, (_, n) => store.create('menuItems', { ...sample, id: 'concurrent-' + n })));
  assert.equal((await store.list('menuItems')).length, original.length + 20);
  assert.equal((await store.list('restaurants', { ownerId: 'owner-001' })).length, 2);
  assert.throws(() => getCollectionPath('../package'), /Unknown/);
  await writeFile(path.join(temporary, 'menuItems.json'), '{broken JSON', 'utf8');
  await assert.rejects(() => store.list('menuItems'));
  assert(!(await readdir(temporary)).some(file => file.endsWith('.tmp')));
  console.log('PASS: read/create/update/delete actually persist to JSON; duplicate protection, filters, 20 concurrent writes, path rejection and corrupt-file errors checked. Original project data unchanged.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
