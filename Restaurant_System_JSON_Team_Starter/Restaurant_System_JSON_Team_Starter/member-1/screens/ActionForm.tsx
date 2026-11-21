'use client';
import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { ServiceResult } from '@/shared/types';

export default function ActionForm({ children, label, run, next }: {
  children?: ReactNode;
  label: string;
  run: (data: FormData) => Promise<ServiceResult<unknown>>;
  next?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string }>();
  return <form className="stack" onSubmit={async event => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setFeedback(undefined);
    try {
      const response = await run(data);
      if (!response.ok) {
        setFeedback({ ok: false, message: response.error.message });
        return;
      }
      setFeedback({ ok: true, message: 'Saved.' });
      if (next) router.push(next);
      router.refresh();
    } catch {
      setFeedback({ ok: false, message: 'The operation failed. Please retry.' });
    } finally {
      setPending(false);
    }
  }}>
    {children}
    <button className="button" disabled={pending}>{pending ? 'Please wait…' : label}</button>
    {feedback && <p role={feedback.ok ? 'status' : 'alert'} className={feedback.ok ? 'notice' : 'notice notice-error'}>{feedback.message}</p>}
  </form>;
}
