'use client';

import Link from 'next/link';
import { useState } from 'react';
import { registerCustomer } from '../functions/registerCustomer';

export default function CustomerRegistrationForm() {
  const [message, setMessage] = useState('');
  const [registered, setRegistered] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(form: FormData) {
    setBusy(true);
    const response = await registerCustomer({
      fullName: String(form.get('name') ?? ''), email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''), password: String(form.get('password') ?? ''),
    });
    setRegistered(response.ok);
    setMessage(response.ok ? 'Your customer account is ready.' : response.error.message);
    setBusy(false);
  }

  return <section className="panel stack">
    <h1>Create a TarcEat customer account</h1>
    {message && <p role="status" className="notice">{message}</p>}
    {registered ? <Link className="button" href="/account">Sign in</Link> : <form className="stack" action={submit}>
      <label>Full name <input className="field" name="name" autoComplete="name" required maxLength={120} /></label>
      <label>Email <input className="field" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>Phone <input className="field" name="phone" type="tel" autoComplete="tel" required maxLength={20} /></label>
      <label>Password <input className="field" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></label>
      <button className="button" disabled={busy}>Create account</button>
    </form>}
  </section>;
}