import AppointmentsTable from '../../../components/actual/appointments/appointments';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';

const Appointments = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Appointments" />

      <div className="flex flex-col gap-10">
        <AppointmentsTable />
      </div>
    </DefaultLayout>
  );
};

export default Appointments;
