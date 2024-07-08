import { db } from '../config/dbconfig';
import { collection, addDoc } from 'firebase/firestore';

export const addData = async (collectionName, data) => {
  try {
    console.log("data before", data)

    data = {
      ...data,
      uid: await GenerateUid()
    }
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID: ', docRef.id);
    return docRef
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};



const GenerateUid = async () => {
  try {
    const prefix = "imp-"
    const randomNo = Math.random().toFixed(5).slice(2).toString()
    const date = Date.now().toString()
    return prefix
      + randomNo
      + date
  } catch (error) {
    console.log("faild to generate unique id ", error)
  }
}