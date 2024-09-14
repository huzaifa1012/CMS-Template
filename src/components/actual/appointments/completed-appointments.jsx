import { getData } from '../../../util_functions/get_data.jsx';
import { deleteDoc } from '../../../util_functions/delete_data.jsx';
import { formattedDate } from '../../../util_functions/formateDate.jsx';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const CompletedAppointmentsComponent = () => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [appointments, setAppointment] = useState([])
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("today"); // Default filter



    const filterAppointments = (appointments) => {
        const today = new Date();
        return appointments.filter((appointment) => {
            // Convert Firestore Timestamp to JavaScript Date
            const appointmentDate = new Date(appointment.completiondate.seconds * 1000);

            switch (filter) {
                case "today":
                    return appointmentDate.toDateString() === today.toDateString();
                case "thisWeek":
                    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                    return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
                case "thisMonth":
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
                case "previousMonth":
                    const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                    return appointmentDate >= startOfPrevMonth && appointmentDate <= endOfPrevMonth;
                default:
                    return true;
            }
        });
    };



    const fetchedData = async () => {
        try {
            setLoading(true)
            const data = await getData('appointments', { appointmentstatus: "completed" });
            const filteredAppointments = filterAppointments(data); // Filter the data
            console.log("filteredAppointments", filteredAppointments)
            setAppointment(filteredAppointments)
            console.log("state", data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchedData()
    }, [filter])

    const askDelete = async (uid) => {
        Swal.fire({
            title: "Are You Sure ?",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            confirmButtonColor: 'red',
            cancelButtonColor: "green",
        }).then(async (result) => { // Ensure result is awaited
            if (result.isConfirmed) {
                try {
                    await deleteDoc("appointments", { uid: uid }); // Ensure deleteDoc is awaited
                    await fetchedData(); // Ensure fetchedData is awaited
                    Swal.fire("Deleted!", "appointment deleted successfully", "success");
                } catch (error) {
                    console.error("Error deleting document: ", error);
                    Swal.fire("Error!", "Could not delete the document.", "error");
                }
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    const handleRowClick = (index) => {
        if (expandedRows.includes(index)) {
            setExpandedRows(expandedRows.filter((i) => i !== index));
        } else {
            setExpandedRows([index]);
        }
    };


    const exportToExcel = async () => {
        // Prepare your data
        const data = appointments.map(val => ({
            Service: val?.servicename,
            Customer: val?.customername,
            CustomerPhone: val?.customerphone,
            BookingDate: val?.appointmentdate ? formattedDate(val.appointmentdate) : 'No date available',
            CompletionDate: val?.completiondate ? formattedDate(val.completiondate) : 'No date available',
            ServiceType: val?.servicetype,
            ServicePerson: val?.serviceby,
            TotalCost: val?.appointmentfinalprice,
            Status: val?.appointmentstatus,
        }));

        // Calculate the total amount of all TotalCost, ensuring that the values are numbers
        const totalAmount = appointments.reduce((sum, val) => {
            const price = parseFloat(val?.appointmentfinalprice) || 0; // Convert to number, default to 0 if NaN
            return sum + price;
        }, 0);
        console.log("totalAmount", totalAmount)

        // Create a custom header with styling
        const header = [
            { A: 'Imperial Look Salon - Appointment Report' },
            { A: 'Generated on:', B: new Date().toLocaleDateString() },
            { A: 'Imperial Look Salon - Appointment Report', B: "" },
            { A: 'Total Cost', B: totalAmount },
            {}
        ];

        // Convert the header array to a worksheet
        const headerWs = XLSX.utils.json_to_sheet(header, { skipHeader: true });

        // Merge cells for the title and total amount (spanning columns A to H)
        headerWs['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge title row
            { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }  // Merge total amount row
        ];

        // Apply basic styling to the header (optional)
        const headerStyle = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' },
        };

        // Apply style to title and total amount cells
        const titleCellRef = XLSX.utils.encode_cell({ r: 0, c: 0 });
        const totalAmountCellRef = XLSX.utils.encode_cell({ r: 2, c: 0 });

        headerWs[titleCellRef].s = headerStyle;
        headerWs[totalAmountCellRef].s = { ...headerStyle, font: { bold: true, sz: 12, color: { rgb: "FF0000" } } }; // Total amount in red

        // Continue with adding your data below the header (starting from the 5th row)
        const dataWs = XLSX.utils.json_to_sheet(data, { origin: 4 });

        // Merge the header and data worksheets
        const ws = XLSX.utils.sheet_add_json(headerWs, data, { origin: -1 });

        // Adjust column widths (optional)
        ws['!cols'] = [
            { wch: 20 }, // Service
            { wch: 20 }, // Customer
            { wch: 15 }, // CustomerPhone
            { wch: 25 }, // BookingDate
            { wch: 25 }, // CompletedDate
            { wch: 20 }, // ServiceType
            { wch: 20 }, // ServicePerson
            { wch: 15 }, // TotalCost
            { wch: 15 }, // Status
        ];

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Appointment Report');

        // Generate an Excel file and trigger a download
        XLSX.writeFile(wb, 'Appointment_Report.xlsx');
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex justify-between'>
                <button
                    onClick={exportToExcel}
                    className="cursor-pointer mb-4 p-2 bg-blue-500 text-white rounded"
                >
                    Export to Excel
                </button>

                <select
                    className="mb-4 p-2 cursor-pointer bg-white-500 text rounded"

                    value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="previousMonth">Previous Month</option>
                </select>
            </div>
            <div className="max-w-full overflow-x-auto">




                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Service
                            </th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Customer
                            </th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Customer Phone
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Booking date
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Completed On
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Service Type
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Service Person
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Total Cost
                            </th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
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

                                appointments.length ? appointments?.map((val, key) => (
                                    <>
                                        <tr key={key}>
                                            <td onClick={() => handleRowClick(key)} className="cursor-pointer border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {val?.servicename}
                                                </h5>
                                                <p className="text-sm">{val?.serviceprice && val.servicename ? `AED ${val.serviceprice}` : ''}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {val?.customername}
                                                </h5>
                                                <p className="text-sm">
                                                    {val?.customeremail}
                                                </p>
                                            </td>

                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <p className="text-sm">
                                                    {val?.customerphone}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {val?.appointmentdate ? formattedDate(val.appointmentdate) : 'No date available'}

                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {val?.completiondate ? formattedDate(val.completiondate) : 'No date available'}

                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {val?.servicetype}

                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {val?.serviceby}

                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {val?.appointmentfinalprice && `${val?.appointmentfinalprice}`}

                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p
                                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${val?.appointmentstatus === 'booked'
                                                        ? 'bg-success text-success'
                                                        : val?.appointmentstatus === 'rejected'
                                                            ? 'bg-danger text-danger'
                                                            : 'bg-warning text-warning'
                                                        }`}
                                                >
                                                    {val?.appointmentstatus}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <button onClick={() => handleRowClick(key)} className="hover:text-primary">
                                                        <svg
                                                            className="fill-current"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                    </button>



                                                    <a href={`https://wa.me/${val.customerphone}`} target='_blank' className="hover:text-primary">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                                        </svg>
                                                    </a>

                                                    <a href={`tel:${val.customerphone}`} className="hover:text-primary">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                                        </svg>
                                                    </a>

                                                    {/* Mail icon */}
                                                    <a href={`mailto:${val.customeremail}`} className="hover:text-primary">
                                                        <svg
                                                            className="fill-current"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                                            </svg>
                                                        </svg>
                                                    </a>
                                                    {/* Bin icon */}
                                                    <button onClick={async () => askDelete(val?.uid)} className="hover:text-primary">
                                                        <svg
                                                            className="fill-current"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                        <>
                                            {
                                                expandedRows.includes(key) && (
                                                    <tr className='border-b border-[#eee]  px-4 pl-9 dark:border-strokedark xl:pl-11 ' >
                                                        <td colSpan="5" className="py-5 px-4 bg-gray-100 dark:bg-gray-800">
                                                            <p className="text-black dark:text-white pb-10 px-5">
                                                                <strong>Additional Notes:</strong> <br /> {val.additionalnotes}
                                                            </p>
                                                            {/* <p className="text-black dark:text-white">
                            <strong>Phone:</strong> {val.customerphone}
                          </p> */}
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </>

                                    </>
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

                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default CompletedAppointmentsComponent;
