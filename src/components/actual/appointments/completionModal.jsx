import React, { useEffect, useState } from 'react';
import { updateData } from '../../../util_functions/update_data';
import Swal from 'sweetalert2';
import { getData } from '../../../util_functions/get_data';

const CompletionModal = ({ isOpen, toggle, appointmentData, onSave }) => {
    const [price, setPrice] = useState('');
    const [serviceBy, setServiceBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState([])


    const fetchedStaff = async () => {
        try {
            const data = await getData('staff', { staffstatus: true });
            setStaffs(data)
            console.log("state", data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchedStaff()
    }, [])

    useEffect(() => {
        if (isOpen) {
            setPrice('');
        }
    }, [isOpen, appointmentData]);

    const handleSave = async () => {
        if (!price) {
            alert("What was the final price, Please enter. ")
            return
        }
        if (!serviceBy) {
            alert("who was the service provider, Please select. ")
            return
        }
        setLoading(true)
        try {
            await updateData("appointments", { uid: appointmentData.uid }, { appointmentstatus: "completed", appointmentfinalprice: price, serviceby: serviceBy, completiondate: new Date() }); // Ensure deleteDoc is awaited
            setPrice("")
            setServiceBy("")
            if (onSave) {
                onSave()
            }
            Swal.fire({
                title: "Marked As Completed!",
                text: "Appointment is marked as Successfully completed",
                icon: "success",
                confirmButtonColor: "#24303f",
            });

        } catch (error) {
            setLoading(false)
            setPrice("")
            setServiceBy("")
            console.error("Error deleting appointment: ", error);
            Swal.fire("Error!", "Could not update the appointment.", "error");
        }



        toggle();

    };

    if (!isOpen) {
        return null;
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h4>Appointment Details</h4>
                    <button style={styles.closeButton} onClick={toggle}>×</button>
                </div>
                <div style={styles.modalBody}>
                    {appointmentData && (
                        <>
                            <div>
                                <span>Customer </span>
                                <p><strong>Name :</strong> {appointmentData.customername}</p>
                                <p><strong>Email:</strong> {appointmentData.customeremail}</p>
                                <p><strong>Phone:</strong> {appointmentData.customerphone}</p>
                            </div>
                            <br />
                            <div>
                                <span>Service </span>
                                <p><strong>Name :</strong> {appointmentData.servicename || "Appointment"}</p>
                                <p><strong>Type:</strong> {appointmentData.servicetype}</p>
                                <p><strong>Base Price:</strong> AED {appointmentData.serviceprice || "0"} </p>
                                <br />
                            </div>
                        </>
                    )}
                    <div>
                        {/* Final Price  */}
                        <p><strong>Final Price:</strong> {price && "AED " + price} </p>
                        <div style={styles.inputGroup}>
                            {/* <label htmlFor="price">Enter Final Price:</label> */}
                            <input
                                type="number"
                                id="price"
                                placeholder="Enter Final price"
                                value={price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 10) {
                                        setPrice(value);
                                    }
                                }}
                                style={styles.input}
                            />

                        </div>

                        {/* Service By  */}
                        <p><strong>Service By:</strong> {price && "AED " + price} </p>
                        <div style={styles.inputGroup}>
                            <select
                                name="mySelect"
                                id="mySelect"
                                style={styles.select}
                                onChange={(event) => setServiceBy(event.target.value)}
                                value={serviceBy}
                            >
                                <option value="">Select Staff Person</option>
                                {staffs.map((data, i) =>
                                    <>
                                        <option value={data.name}>{data.name}</option>
                                    </>
                                )}
                            </select>
                        </div>

                    </div>

                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.okButton} onClick={handleSave}>{!loading ? "OK" : (<svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>)}</button>
                    <button style={styles.cancelButton} onClick={toggle}>Cancel</button>
                </div>
            </div>
        </div>
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

export default CompletionModal;
