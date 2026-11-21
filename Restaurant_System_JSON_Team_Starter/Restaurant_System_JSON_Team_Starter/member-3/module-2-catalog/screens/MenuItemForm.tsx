'use client';

import type { FormEvent } from 'react';
import type { Category, MenuItem, MenuItemInput } from '@/shared/types';
import MenuImageField from './MenuImageField';

export default function MenuItemForm({ item, categories, busy, save, cancel }: {
  item: MenuItem | null;
  categories: Category[];
  busy: boolean;
  save: (input: MenuItemInput) => Promise<boolean>;
  cancel: () => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const [whole, decimal = ''] = String(data.get('price') ?? '').split('.');
    const saved = await save({
      name: String(data.get('name') ?? ''),
      categoryId: String(data.get('categoryId') ?? ''),
      description: String(data.get('description') ?? ''),
      priceSen: Number(whole) * 100 + Number(decimal.padEnd(2, '0')),
      imageUrl: String(data.get('imageUrl') ?? '').trim() || null,
      isAvailable: data.has('isAvailable'),
    });
    if (saved && !item) form.reset();
  }

  return <form className="panel stack" onSubmit={submit}>
    <h2>{item ? 'Edit menu item' : 'Add menu item'}</h2>
    <label>Name <input className="field" name="name" defaultValue={item?.name} required maxLength={120} /></label>
    <label>Category <select className="field" name="categoryId" defaultValue={item?.categoryId} required>
      {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
    </select></label>
    <label>Description <textarea className="field" name="description" defaultValue={item?.description} maxLength={1000} /></label>
    <label>Price (RM) <input className="field" name="price" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" defaultValue={item ? (item.priceSen / 100).toFixed(2) : ''} required /></label>
    <MenuImageField imageUrl={item?.imageUrl ?? ''} />
    <label><input name="isAvailable" type="checkbox" defaultChecked={item?.isAvailable ?? true} /> Available</label>
    <div><button className="button" disabled={busy}>Save item</button>{' '}
      {item && <button type="button" className="button-secondary" disabled={busy} onClick={cancel}>Cancel</button>}
    </div>
  </form>;
}