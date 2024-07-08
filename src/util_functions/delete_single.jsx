import { getStorage, ref, deleteObject } from 'firebase/storage';

// Initialize Firebase Storage
const storage = getStorage();

const deleteImageByUrl = async (imageUrl) => {
    try {
        // Extract the image path from the URL
        const imagePath = decodeURIComponent(new URL(imageUrl).pathname).replace(/^\/images/, '');

        // Create a reference to the image
        const imageRef = ref(storage, imagePath);

        // Delete the image
        await deleteObject(imageRef);

        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error; // Propagate the error
    }
};

export default deleteImageByUrl;
