'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from '@/shared/auth/signIn';

export default function CustomerSignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return <section className="panel stack">
    <h1>Customer sign in</h1>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    <form className="stack" action={async data => {
      setBusy(true);
      setError('');
      const response = await signIn({ accountType: 'customer', email: String(data.get('email')), password: String(data.get('password')) });
      if (response.ok) router.refresh();
      else setError(response.error.message);
      setBusy(false);
    }}>
      <label>Email <input className="field" name="email" type="email" autoComplete="email" required /></label>
      <label>Password <input className="field" name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>
      <button className="button" disabled={busy}>Sign in</button>
    </form>
    <Link href="/register/customer">Create a customer account</Link>
  </section>;
}