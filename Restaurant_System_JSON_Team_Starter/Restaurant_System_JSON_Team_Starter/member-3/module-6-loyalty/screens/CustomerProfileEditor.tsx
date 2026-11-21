'use client';

import { useState } from 'react';
import type { Profile, ServiceResult } from '@/shared/types';

export default function CustomerProfileEditor({ profile, save, deactivate }: {
  profile: Profile;
  save: (data: FormData) => Promise<ServiceResult<Profile>>;
  deactivate: () => Promise<string>;
}) {
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(profile);
  const [busy, setBusy] = useState(false);
  return <form className="stack" key={JSON.stringify(details)} action={async data => {
    setBusy(true);
    const response = await save(data);
    if (response.ok) setDetails(response.data);
    setMessage(response.ok ? 'Profile saved.' : response.error.message);
    setBusy(false);
  }}>
    <p>{details.email}</p>
    <label>Full name <input className="field" name="name" defaultValue={details.fullName} required maxLength={120} /></label>
    <label>Phone <input className="field" name="phone" type="tel" defaultValue={details.phone} required maxLength={20} /></label>
    <label>Address <textarea className="field" name="address" defaultValue={details.address ?? ''} maxLength={500} /></label>
    {message && <p className="notice" role="status">{message}</p>}
    <div>
      <button className="button" disabled={busy}>Save profile</button>{' '}
      <button type="button" className="button-secondary" disabled={busy} onClick={async () => {
        if (!window.confirm('Deactivate your customer account?')) return;
        setBusy(true);
        setMessage(await deactivate());
        setBusy(false);
      }}>Deactivate account</button>
    </div>
  </form>;
}
