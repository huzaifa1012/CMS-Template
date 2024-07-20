import React, { useState } from 'react';
import Swal from 'sweetalert2';
import CancelledAppointmentsComponent from '../../../components/actual/appointments/cancelled-appointments.jsx';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb.js';
import { deleteDoc } from '../../../util_functions/delete_data';
import DefaultLayout from '../../../layout/DefaultLayout.js';

const CancelleddAppointments = () => {
  // State to trigger re-render
  const [refresh, setRefresh] = useState(false);


  const clearAll = async () => {
    Swal.fire({
      title: "Clear All ?",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      confirmButtonColor: 'green',
      cancelButtonColor: "gray",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc("appointments", { appointmentstatus: "cancelled" }); // Ensure deleteDoc is awaited
          Swal.fire("Cancelled Appointments removed!", "All cancelled appointments are now removed", "success");
          // Trigger re-render by toggling the refresh state
          setRefresh(prev => !prev);
        } catch (error) {
          console.error("Error deleting document: ", error);
          Swal.fire("Error!", "Could not delete the services.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Failed to delete", "", "info");
      }
    });
  };

  return (
    <DefaultLayout>
      <button className='primary-btn btn' onClick={clearAll}>Clear All</button>
      <Breadcrumb pageName="Cancelled Appointments" />
      <div className="flex flex-col gap-10">
        <CancelledAppointmentsComponent key={refresh} /> {/* Use key to force re-render */}
      </div>
    </DefaultLayout>
  );
};

export default CancelleddAppointments;
