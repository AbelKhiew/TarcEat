'use client';

import { QRCodeSVG } from 'qrcode.react';
export default function TableQrCard({ number, url }: { number: number; url: string }) {
  return <figure className="table-qr">
    <QRCodeSVG value={url} size={140} marginSize={4} title={`Ordering QR code for Table ${number}`} />
    <figcaption><a href={url}>Open QR link for Table {number}</a></figcaption>
  </figure>;
}
