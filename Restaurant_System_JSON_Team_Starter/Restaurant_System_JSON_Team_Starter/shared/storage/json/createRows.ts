import 'server-only';
import type { CollectionName, RowOf } from '../types.ts';
import { readCollection } from './readCollection.ts';
import { writeCollection } from './writeCollection.ts';
import { withJsonLock } from './withJsonLock.ts';

export async function createRows<K extends CollectionName>(collection: K, additions: RowOf<K>[]): Promise<RowOf<K>[]> {
  return withJsonLock(async () => {
    const existing = await readCollection(collection);
    const ids = [...existing, ...additions].map(row => row.id);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate record ID');
    await writeCollection(collection, [...existing, ...additions]);
    return additions;
  });
}
