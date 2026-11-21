'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getSession } from '@/shared/auth/getSession';
import type { Category, MenuItem, MenuItemInput } from '@/shared/types';
import { archiveMenuItem } from '../functions/archiveMenuItem';
import { createMenuItem } from '../functions/createMenuItem';
import { listCategories } from '../functions/listCategories';
import { listMenuItems } from '../functions/listMenuItems';
import { setItemAvailability } from '../functions/setItemAvailability';
import { updateMenuItem } from '../functions/updateMenuItem';
import MenuItemForm from './MenuItemForm';
import AvailabilityToggle from './AvailabilityToggle';

export default function MenuItemList() {
  const [restaurantId, setRestaurantId] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
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
    const [menu, groups] = await Promise.all([listMenuItems(id), listCategories(id)]);
    if (menu.ok) setItems(menu.data);
    else setError(menu.error.message);
    if (groups.ok) setCategories(groups.data);
    else setError(groups.error.message);
    setBusy(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function save(input: MenuItemInput) {
    setBusy(true);
    setError('');
    const response = editing ? await updateMenuItem(editing.id, input) : await createMenuItem(restaurantId, input);
    if (response.ok) {
      setEditing(null);
      await load();
    } else { setError(response.error.message); setBusy(false); }
    return response.ok;
  }

  async function change(item: MenuItem, archive: boolean) {
    if (archive && !window.confirm('Archive this menu item?')) return;
    setBusy(true);
    setError('');
    const response = archive ? await archiveMenuItem(item.id) : await setItemAvailability(item.id, !item.isAvailable);
    if (response.ok) {
      if (editing?.id === item.id) setEditing(null);
      await load();
    } else { setError(response.error.message); setBusy(false); }
  }

  return <section className="panel stack">
    <h1>Menu items</h1>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    {busy && <p role="status" className="muted">Loading or saving menu…</p>}
    {restaurantId && <>
      <Link href="/owner/categories">Manage categories</Link>
      {categories.length > 0 && <MenuItemForm key={editing?.id ?? 'new'} item={editing} categories={categories} busy={busy} save={save} cancel={() => setEditing(null)} />}
      {!busy && !items.length && <p className="muted">No menu items yet.</p>}
      <div className="grid">
        {items.map(item => <article className="panel stack" key={item.id}>
          <h2>{item.name}</h2>
          <p>RM {(item.priceSen / 100).toFixed(2)} · {item.isAvailable ? 'Available' : 'Sold out'}</p>
          <div>
            <button type="button" className="button-secondary" disabled={busy} onClick={() => setEditing(item)}>Edit</button>{' '}
            <AvailabilityToggle isAvailable={item.isAvailable} disabled={busy} toggle={() => void change(item, false)} />{' '}
            <button type="button" className="button-secondary" disabled={busy} onClick={() => void change(item, true)}>Archive</button>
          </div>
        </article>)}
      </div>
    </>}
  </section>;
}