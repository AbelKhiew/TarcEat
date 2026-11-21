'use client';

import { useEffect, useState } from 'react';
import type { Category, MenuItem } from '@/shared/types';
import { listCategories } from '../functions/listCategories';
import { listMenuItems } from '../functions/listMenuItems';

export default function CustomerMenu() {
  const [menu, setMenu] = useState<{ categories: Category[]; items: MenuItem[] } | null>(null);
  const [message, setMessage] = useState('Loading the menu…');
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('restaurant');
    if (!id) { setMessage('Choose a restaurant to view its menu.'); return; }
    let current = true;
    void Promise.all([listCategories(id), listMenuItems(id)]).then(([categories, items]) => {
      if (!current) return;
      if (!categories.ok) setMessage(categories.error.message);
      else if (!items.ok) setMessage(items.error.message);
      else setMenu({ categories: categories.data, items: items.data });
    }).catch(() => { if (current) setMessage('The menu could not be loaded. Please refresh.'); });
    return () => { current = false; };
  }, []);
  return <section className="stack">
    <h1>TarcEat menu</h1>
    {!menu && <p role="status" className="notice">{message}</p>}
    {menu?.items.length === 0 && <p className="muted">No menu items yet.</p>}
    {menu?.categories.map(category => {
      const items = menu.items.filter(item => item.categoryId === category.id);
      return items.length > 0 && <section className="stack" key={category.id}>
        <h2>{category.name}</h2>
        <div className="grid">{items.map(item => <article className="panel stack" key={item.id}>
          {item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" width={240} />}
          <h3>{item.name}</h3>
          {item.description && <p>{item.description}</p>}
          <p>RM {(item.priceSen / 100).toFixed(2)} {!item.isAvailable && <span className="badge">Sold out</span>}</p>
        </article>)}</div>
      </section>;
    })}
  </section>;
}