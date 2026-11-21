'use client';

import { useState } from 'react';
import { previewMenuImage } from '../functions/previewMenuImage';

export default function MenuImageField({ imageUrl = '' }: { imageUrl?: string }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  return <div className="stack">
    <label>Image URL <input className="field" name="imageUrl" type="url" defaultValue={imageUrl} maxLength={2048} /></label>
    <label>Preview a local image <input className="field" type="file" accept="image/png,image/jpeg,image/webp" onChange={async event => {
      setPreview('');
      setError('');
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      if (file.size > 512 * 1024) { setError('Choose an image up to 512 KB.'); return; }
      const response = await previewMenuImage(file);
      if (response.ok) setPreview(response.data);
      else setError(response.error.message);
    }} /></label>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    {preview && <img src={preview} alt="Menu image preview" width={180} />}
  </div>;
}