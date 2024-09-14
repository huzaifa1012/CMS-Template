import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb';
import { addData } from '../../../util_functions/add_data';
import uploadImage from '../../../util_functions/upload_single';
import DefaultLayout from '../../../layout/DefaultLayout';
import Swal from 'sweetalert2';
import { getData } from '../../../util_functions/get_data';
import './style/deleted-services.css'
import { updateData } from '../../../util_functions/update_data';
import { deleteDoc } from '../../../util_functions/delete_data';
const DeletedServices = () => {
  const [values, setValues] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([])



  const fetchedData = async () => {
    try {
      const data = await getData('services', { servicestatus: "deleted" });

      setServices(data)
      console.log("state", services)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchedData()
  }, {})






  // Old
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    console.log(values)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file)
      const reader = new FileReader();

      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null)
    setImageSrc(null);
    document.getElementById('fileInput').value = ''; // Clear the file input
  };

  const saveService = async (event) => {
    try {
      event.preventDefault();
      setLoading(true)
      await addData("services", { ...values, servicethumbnail: await uploadImage(imageFile) })
      setLoading(false)
      Swal.fire({
        title: "Service Saved!",
        text: "Successfully saved the service!",
        icon: "success",
      });
      setValues()
      setImageSrc()
      setImageFile()
    } catch (error) {
      setLoading(false)
      console.log("error in data saving", error)
    }
  };
  // Old end

  const clearAll = async (uid) => {
    Swal.fire({
      title: "Clear All ?",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      confirmButtonColor: 'green',
      cancelButtonColor: "gray",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc("services", { servicestatus: "deleted" }); // Ensure deleteDoc is awaited
          await fetchedData(); // Ensure fetchedData is awaited
          Swal.fire("Trash Cleaned!", "All deleted service is now removed ", "success");
        } catch (error) {
          console.error("Error deleting document: ", error);
          Swal.fire("Error!", "Could not delete the services.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Faild to delete", "", "info");
      }
    });
  }
  const askDelete = async (uid) => {
    Swal.fire({
      title: "Restore this service?",
      showCancelButton: true,
      confirmButtonText: "Restore",
      confirmButtonColor: 'green',
      cancelButtonColor: "gray",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateData("services", { uid: uid }, { servicestatus: "active" }); // Ensure deleteDoc is awaited
          await fetchedData(); // Ensure fetchedData is awaited
          Swal.fire("Restored!", "Service has been activated now ", "success");
        } catch (error) {
          console.error("Error deleting document: ", error);
          Swal.fire("Error!", "Could not delete the service.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">

        <button className='primary-btn btn' onClick={clearAll} >Clear All</button>
        <Breadcrumb pageName="Deleted Service" />
        <div className='flex gap-10 flex-wrap'>


          {services?.length ? services.map((val, key) => (

            <div className="service-card myservicecard w-[300px] h-[400px] rounded overflow-hidden shadow-lg ">
              <div onClick={() => askDelete(val.uid)} className="restore-icon" style={{ position: "relative", left: "85%", top: "7%", width: "40px", zIndex: 9999 }} >
             
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-recycle" viewBox="0 0 16 16">
                  <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z" />
                </svg>
              </div>
              <div className="service-image-wrapper w-full h-[250px] overflow-hidden">
                <img className="w-full h-full object-cover lazyload loaded-image"
                  loading="lazy"
                  src={val.servicethumbnail}
                  alt="Service Image" />
              </div>
              <div className="px-6 py-4 flex flex-col justify-between">
                <div className="">
                  <div className="font-bold text-xl mb-2">{val?.servicetitle}</div>
                  <div className="text-gray-700 text-base">AED <span className="font-bold">{val?.serviceprice}</span></div>
                </div>
                <hr style={{ opacity: "0.2", paddingBottom: '2px', paddingTop: "2px" }} />
                <p className="text-gray-700 text-base">{val.servicedetail || 'Service details go here.'}</p>
              </div>
            </div>


          )) : (


            <div style={{ width: "100%", height: "80vh", display: 'flex', justifyContent: 'center', alignItems: "center" }}>
              <div role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>

          )}

        </div>



      </div >
    </DefaultLayout >
  );
};

export default DeletedServices;
