import { db } from '../config/dbconfig';
import { collection, query, where, getDocs, deleteDoc as deleteDocument } from 'firebase/firestore';

export const deleteDoc = async (collectionName, condition) => {
  try {
    // Build the query based on the conditions provided
    let q = collection(db, collectionName);
    Object.keys(condition).forEach(key => {
      q = query(q, where(key, '==', condition[key]));
    });

    // Execute the query to get the document snapshot
    const querySnapshot = await getDocs(q);

    // Iterate through each document in the query result
    querySnapshot.forEach(async doc => {
      // Delete each document found in the query
      await deleteDocument(doc.ref);
      console.log('Document deleted successfully:', doc.id);
    });
  } catch (e) {
    console.error('Error deleting document:', e);
  }
};
