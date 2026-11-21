import Link from "next/link";

export default function HomePage() {
  return <>
    <header className="site-header"><Link href="/" className="brand">TABLE & CO</Link><Link href="/login">Sign in</Link><Link href="/style-guide">Shared style guide</Link></header>
    <main className="page stack">
      <section className="hero"><p className="eyebrow">Team development starter</p><h1>Good food. Simple teamwork.</h1><p>One function per file. Shared JSON data. One agreed design.</p><span className="badge">Modules 1 and 3 implemented</span></section>
      <section className="grid">
        <article className="panel stack"><h2>Member 1</h2><p>Module 1 · Restaurant onboarding<br/>Module 3 · Tables & QR codes</p><Link className="button" href="/owner/applications">Open onboarding screen</Link><Link className="button button-secondary" href="/owner/tables">Open tables screen</Link></article>
        <article className="panel stack"><h2>Member 2</h2><p>Module 4 · Orders & fulfilment<br/>Module 5 · Cart & checkout</p><Link className="button" href="/owner/orders">Open kitchen screen</Link><Link className="button button-secondary" href="/cart">Open cart screen</Link></article>
        <article className="panel stack"><h2>Member 3</h2><p>Module 2 · Menu catalog<br/>Module 6 · Customers & loyalty</p><Link className="button" href="/owner/menu">Open menu screen</Link><Link className="button button-secondary" href="/account">Open customer screen</Link></article>
      </section>
      <p className="notice">Start with START_HERE.md. Modules 1 and 3 are ready for local testing. Sign in before opening owner or admin pages.</p>
    </main>
  </>;
}
