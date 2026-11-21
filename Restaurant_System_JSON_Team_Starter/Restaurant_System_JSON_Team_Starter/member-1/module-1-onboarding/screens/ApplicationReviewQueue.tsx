import ActionForm from '@/member-1/screens/ActionForm';
import Field from '@/member-1/screens/Field';

import { listPendingApplications } from '../functions/listPendingApplications';
import { approveRestaurantApplication } from '../functions/approveRestaurantApplication';
import { rejectRestaurantApplication } from '../functions/rejectRestaurantApplication';

export default async function ApplicationReviewQueue() {
  const response = await listPendingApplications();
  if (!response.ok) return <p className="notice notice-error">{response.error.message}</p>;
  return <div className="stack"><h1>Review applications</h1>
    {response.data.length === 0 && <p>No pending applications.</p>}
    {response.data.map(application => <article className="panel stack" key={application.id}>
      <h2>{application.restaurantName}</h2><p>{application.address} · {application.contactPhone}</p><p>{application.bio}</p>
      <ActionForm label="Approve restaurant" run={approveRestaurantApplication.bind(null, application.id)} />
      <ActionForm label="Reject application" run={async data => {
        'use server';
        return rejectRestaurantApplication(application.id, String(data.get('reason')));
      }}><Field name="reason" label="Rejection reason" /></ActionForm>
    </article>)}
  </div>;
}
