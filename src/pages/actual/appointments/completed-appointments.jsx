import CompletedAppointmentsComponent from '../../../components/actual/appointments/completed-appointments.jsx';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb.tsx';
import DefaultLayout from '../../../layout/DefaultLayout.tsx';

const CompletedAppointments = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Completed Appointments" />

      <div className="flex flex-col gap-10">
        <CompletedAppointmentsComponent />
      </div>
    </DefaultLayout>
  );
};

export default CompletedAppointments;
