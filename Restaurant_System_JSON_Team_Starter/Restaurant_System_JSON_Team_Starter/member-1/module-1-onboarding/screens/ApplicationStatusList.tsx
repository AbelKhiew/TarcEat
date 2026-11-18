import ActionForm from '@/member-1/screens/ActionForm';
import RestaurantApplicationForm from './RestaurantApplicationForm';
import { listMyApplications } from '../functions/listMyApplications';
import { deleteRejectedApplication } from '../functions/deleteRejectedApplication';

export default async function ApplicationStatusList() {
  const response = await listMyApplications();
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  return <div className="stack"><h1>Your applications</h1>
    <RestaurantApplicationForm />
    {response.data.length === 0 && <p>No applications yet.</p>}
    {response.data.map(application => <article key={application.id} className="panel stack">
      <h2>{application.restaurantName}</h2><p>Status: {application.status}</p>
      {application.reviewReason && <p>{application.reviewReason}</p>}
      {application.status === 'rejected' && <ActionForm label="Delete rejected application" run={deleteRejectedApplication.bind(null, application.id)} />}
    </article>)}
  </div>;
}
