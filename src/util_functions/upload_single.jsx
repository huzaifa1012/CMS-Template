import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Initialize Firebase Storage
const storage = getStorage();

const uploadImage = async (file) => {
    if (!file) {
        throw new Error("No file provided");
    }

    // Create a storage reference
    const storageRef = ref(storage, `images/${file.name + new Date()?.toString()?.slice(6)}`);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wait for the upload to complete
    await new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                // Handle unsuccessful uploads
                reject(error);
            },
            () => {
                // Handle successful uploads on complete
                resolve();
            }
        );
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log('File available at', downloadURL);
    return downloadURL;
};

export default uploadImage;
