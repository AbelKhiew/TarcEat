import { getMyPoints } from '../functions/getMyPoints';

export default async function PointsBalance() {
  const result = await getMyPoints();
  if (!result.ok) return <p className="notice notice-error" role="alert">{result.error.message}</p>;
  return <p className="badge">{result.data.toLocaleString('en-MY')} points</p>;
}