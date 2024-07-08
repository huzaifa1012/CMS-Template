import { db } from '../config/dbconfig';
import { collection, getDocs, where, query } from 'firebase/firestore';

export const getData = async (collectionName, queryParams) => {
  try {
    const collectionRef = collection(db, collectionName);

    // Initialize the query with the collection reference and where clauses if provided
    let q;
    if (queryParams) {
      const whereClauses = Object.keys(queryParams).map((key) =>
        where(key, '==', queryParams[key]),
      );
      q = query(collectionRef, ...whereClauses);
    } else {
      q = collectionRef;
    }

    const snapshot = await getDocs(q);
    const results = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (e) {
    console.error('Error fetching documents: ', e);
  }
};