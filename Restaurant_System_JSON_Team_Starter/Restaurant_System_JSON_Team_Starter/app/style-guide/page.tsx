import Link from "next/link";

export default function StyleGuidePage() {
  return <><header className="site-header"><Link href="/" className="brand">TABLE & CO</Link><Link href="/">Home</Link></header><main className="page stack">
    <section className="hero"><p className="eyebrow">Shared design</p><h1>Same colours. Every module.</h1><p>Use the classes in styles/theme.css. This is a visual reference, not a working order screen.</p></section>
    <section className="grid"><article className="panel stack"><h2>Buttons & fields</h2><button className="button" type="button">Primary button</button><button className="button button-secondary" type="button">Secondary button</button><label>Restaurant name<input className="field" placeholder="Jade Bowl Kitchen" /></label><span className="badge">Ready</span></article>
    <article className="panel stack"><h2>Messages</h2><p className="notice">Your changes were saved.</p><p className="notice notice-warning">Waiting for approval.</p><p className="notice notice-error">Please check the required fields.</p></article></section>
    <section className="panel"><h2>Table example</h2><table className="data-table"><thead><tr><th>Item</th><th>Price</th><th>Status</th></tr></thead><tbody><tr><td>Chicken Rice</td><td>RM 18.00</td><td>Available</td></tr></tbody></table></section>
  </main></>;
}
