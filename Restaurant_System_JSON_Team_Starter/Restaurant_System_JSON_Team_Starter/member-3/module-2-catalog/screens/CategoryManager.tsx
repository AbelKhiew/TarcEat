'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSession } from '@/shared/auth/getSession';
import type { Category } from '@/shared/types';
import { createCategory } from '../functions/createCategory';
import { deleteCategory } from '../functions/deleteCategory';
import { listCategories } from '../functions/listCategories';
import { updateCategory } from '../functions/updateCategory';

export default function CategoryManager() {
  const [restaurantId, setRestaurantId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);
  const load = useCallback(async () => {
    const session = await getSession();
    const id = session.ok && session.data.role === 'owner' ? session.data.selectedRestaurantId : null;
    if (!id) {
      setError('Sign in as an owner and select a restaurant.');
      setBusy(false);
      return;
    }
    setRestaurantId(id);
    const response = await listCategories(id);
    if (response.ok) setCategories(response.data);
    else setError(response.error.message);
    setBusy(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function save(form: FormData, id?: string) {
    setBusy(true);
    setError('');
    const input = { name: String(form.get('name') ?? '') };
    const response = id ? await updateCategory(id, input) : await createCategory(restaurantId, input);
    if (response.ok) await load();
    else { setError(response.error.message); setBusy(false); }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this category?')) return;
    setBusy(true);
    setError('');
    const response = await deleteCategory(id);
    if (response.ok) await load();
    else { setError(response.error.message); setBusy(false); }
  }

  return <section className="panel stack">
    <h1>Menu categories</h1>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    {restaurantId && <>
      <form className="stack" action={save}>
        <label>New category <input className="field" name="name" required maxLength={80} /></label>
        <button className="button" disabled={busy}>Add category</button>
      </form>
      {!busy && !categories.length && <p className="muted">No categories yet.</p>}
      {categories.map(category => <form className="panel stack" key={category.id} action={form => save(form, category.id)}>
        <label>Category name <input className="field" name="name" defaultValue={category.name} required maxLength={80} /></label>
        <div>
          <button className="button-secondary" disabled={busy}>Save</button>{' '}
          <button className="button-secondary" type="button" disabled={busy} onClick={() => void remove(category.id)}>Delete</button>
        </div>
      </form>)}
    </>}
  </section>;
}