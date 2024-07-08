import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb';
import { addData } from '../../../util_functions/add_data';
import uploadImage from '../../../util_functions/upload_single';
import deleteImageByUrl from '../../../util_functions/delete_single';
import DefaultLayout from '../../../layout/DefaultLayout';
import Swal from 'sweetalert2';
import { getData } from '../../../util_functions/get_data';
import './style/services.css'
import { updateData } from '../../../util_functions/update_data';
const Services = () => {
  const [values, setValues] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([])



  const fetchedData = async () => {
    try {
      const data = await getData('services', { servicestatus: "active" });

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
          await updateData("services", { uid: uid }, { servicestatus: "deleted" }); // Ensure deleteDoc is awaited
          await fetchedData(); // Ensure fetchedData is awaited
          Swal.fire("delete!", "Service Added into Trash ", "success");
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
        <Breadcrumb pageName="Active Service" />
        <div className='flex gap-10 flex-wrap'>


          {services?.length ? services.map((val, key) => (

            <div className="service-card myservicecard w-[300px]  rounded overflow-hidden shadow-lg " style={{minHeight:"400px"}}>
              <div onClick={() => askDelete(val.uid)} className="delete-icon" style={{ position: "relative", left: "85%", top: "7%", width: "40px", zIndex: 9999 }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
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

export default Services;
