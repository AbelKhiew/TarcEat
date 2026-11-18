import Link from "next/link";

export default function HomePage() {
  return <>
    <header className="site-header"><Link href="/" className="brand">TABLE & CO</Link><Link href="/style-guide">Shared style guide</Link></header>
    <main className="page stack">
      <section className="hero"><p className="eyebrow">Team development starter</p><h1>Good food. Simple teamwork.</h1><p>One function per file. Shared JSON data. One agreed design.</p><span className="badge">Module screens are ready for you to implement</span></section>
      <section className="grid">
        <article className="panel stack"><h2>Member 1</h2><p>Module 1 · Restaurant onboarding<br/>Module 3 · Tables & QR codes</p><Link className="button" href="/owner/applications">Open onboarding screen</Link><Link className="button button-secondary" href="/owner/tables">Open tables screen</Link></article>
        <article className="panel stack"><h2>Member 2</h2><p>Module 4 · Orders & fulfilment<br/>Module 5 · Cart & checkout</p><Link className="button" href="/owner/orders">Open kitchen screen</Link><Link className="button button-secondary" href="/cart">Open cart screen</Link></article>
        <article className="panel stack"><h2>Member 3</h2><p>Module 2 · Menu catalog<br/>Module 6 · Customers & loyalty</p><Link className="button" href="/owner/menu">Open menu screen</Link><Link className="button button-secondary" href="/account">Open customer screen</Link></article>
      </section>
      <p className="notice">Start with START_HERE.md. The JSON file helpers work; business functions and module screens are still empty.</p>
    </main>
  </>;
}
