import { db } from '../config/dbconfig';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export const updateData = async (collectionName, condition, updateFields) => {
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
      // Update each document found in the query
      await updateDoc(doc.ref, updateFields);
      console.log('Document updated successfully:', doc.id);
    });
  } catch (e) {
    console.error('Error updating document:', e);
  }
};
