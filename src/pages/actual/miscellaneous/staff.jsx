import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb';
import { addData } from '../../../util_functions/add_data';
import uploadImage from '../../../util_functions/upload_single';
import DefaultLayout from '../../../layout/DefaultLayout';
import Swal from 'sweetalert2';
import { getData } from '../../../util_functions/get_data';
import './style/services.css'
import { updateData } from '../../../util_functions/update_data';
import staffimage from '../../../images/icon/stafficon.png'
const Staff = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([])
  const [addmodal, setAddmodal] = useState(false)
  const [staffName, setStaffName] = useState("")
  const [staffDesignation, setStaffDesignation] = useState("")

  const fetchedData = async () => {
    try {
      setLoading(true)
      const data = await getData('staff', { staffstatus: true });

      setServices(data)
      console.log("state", services)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchedData()
  }, {})


  const askDelete = async (uid) => {
    Swal.fire({
      title: "Sure, Delete this service?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: 'red',
      cancelButtonColor: "green",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateData("staff", { uid: uid }, { staffstatus: false }); // Ensure deleteDoc is awaited
          Swal.fire({
            title: '<strong style="font-size: 24px; color: #333;">Staff Deleted!</strong>',
            html: '<b style="font-size: 18px; color: #666;">Staff Added into Trash</b>',
            icon: 'success',
            confirmButtonText: '<span style="font-size: 16px; color: #fff;">OK</span>',
            confirmButtonColor: '#24403f', // Custom button color
            background: '#f9f9f9', // Background color of the popup
          });
          await fetchedData(); // Ensure fetchedData is awaited
        } catch (error) {
          console.error("Error deleting document: ", error);
          Swal.fire("Error!", "Could not delete the service.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }



  const handleSave = async () => {
    if (!staffName) {
      alert("Staff Name is required, Please enter. ")
      return
    }
    if (!staffDesignation) {
      alert("Staff Designation is required, Please Enter. ")
      return
    }
    setLoading(true)
    try {
      await addData("staff", { name: staffName, designation: staffDesignation, staffstatus: true });
      setStaffName("")
      setStaffDesignation("")

      Swal.fire({
        title: "Added Successfully!",
        text: "Staff member has been added Successfully completed",
        icon: "success",
        confirmButtonColor: "#24303f",
      });
      fetchedData()

    } catch (error) {
      setLoading(false)
      setStaffName("")
      setStaffDesignation("")
      console.error("Error in addin staff: ", error);
      Swal.fire("Error!", "Could not add the staff ", "error");
    }

    setAddmodal(false)

  };


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Current Staff" />
        {addmodal &&
          (

            <div style={{ position: 'relative' }}>
              <div className='absolute d-flex flex items-center justify-center' style={{ display: 'flex', justifyContent: "center", alignItems: 'center', width: '100%', minHeight: '80vh' }}>

                <div style={styles.modalOverlay}>
                  <div style={styles.modalContent}>
                    <div style={styles.modalHeader}>
                      <h4>Staff Details</h4>
                      <button style={styles.closeButton} onClick={() => setAddmodal(false)}>×</button>
                    </div>
                    <div style={styles.modalBody}>

                      <div>
                        <div style={styles.inputGroup}>
                          <input
                            type="text"
                            placeholder="Enter Staff Name"
                            value={staffName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 25) {
                                setStaffName(value);
                              }
                            }}
                            style={styles.input}
                          />

                        </div>
                        <div style={styles.inputGroup}>
                          <input
                            type="text"
                            placeholder="Enter Staff Designation"
                            value={staffDesignation}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 30) {
                                setStaffDesignation(value);
                              }
                            }}
                            style={styles.input}
                          />

                        </div>


                      </div>

                    </div>
                    <div style={styles.modalFooter}>
                      <button style={styles.okButton} onClick={handleSave}>{!loading ? "Add " : (<svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>)}</button>
                      <button style={styles.cancelButton} onClick={() => setAddmodal((val) => !val)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )

        }

        <div class="flex justify-between "><button class="cursor-pointer mb-4 p-2 bg-blue-500 text-white rounded " style={{ zIndex: 999 }} onClick={() => setAddmodal((val) => !val)}>Add New</button>
        </div>
        <div className='flex gap-10 flex-wrap'>
          {
            loading ? (
              <tr>
                <div style={{ position: 'absolute', top: "50%", left: "45%", width: "100%", height: "80vh" }}>
                  <div role="status">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
                <td><span className="sr-only">Loading...</span></td>
              </tr>
            ) :
              services?.length ? services.map((val, key) => (

                <div className="service-card staffcard w-[200px]  rounded overflow-hidden shadow-lg " style={{ minHeight: "100px", position: "relative", paddingTop: "1rem" }}>
                  <div onClick={() => askDelete(val.uid)} className="staff-delete-trash-icon" style={{ position: "absolute", left: "80%", top: "0%", width: "40px", zIndex: 9999 }} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </div>
                  <div className="service-image-wrapper overflow-hidden" style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                    <img className="w-25 h-25 object-cover lazyload loaded-image"
                      loading="lazy"
                      src={staffimage}
                      alt="Service Image" />
                  </div>
                  <div className="px-6 py-4 flex flex-col justify-between">
                    <div className="text-center">
                      <div className="font-bold text-xl mb-2" style={{ marginBottom: "0px" }}>{val?.name}</div>
                      <p className="text-gray-700 text-base " style={{ fontSize: "14px" }}>{val?.designation}</p>
                    </div>
                  </div>
                </div>


              )) :
                (
                  <>
                    <div style={{ position: 'absolute', top: "50%", left: "45%", width: "100%", height: "80vh" }}>
                      <div role="">
                        <h1 class="">No Data </h1>
                      </div>
                    </div>
                  </>
                )}


        </div>



      </div >
    </DefaultLayout >
  );
};


const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  modalBody: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '10px',
  },
  input: {
    width: '70%',
    padding: '8px',
    marginTop: '5px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    padding: '8px 12px',
    width: '70%',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  okButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
export default Staff;
