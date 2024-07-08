import CancelledentsComponent from '../../../components/actual/appointments/cancelled-appointments.jsx';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb.js';
import DefaultLayout from '../../../layout/DefaultLayout.js';

const CancelleddAppointments = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cancelled Appointments" />

      <div className="flex flex-col gap-10">
        <CancelledentsComponent />
      </div>
    </DefaultLayout>
  );
};

export default CancelleddAppointments;
