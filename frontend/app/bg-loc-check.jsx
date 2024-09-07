import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
const YOUR_TASK_NAME = 'bg-loc-check'
import { getFirestore, doc, getDocs, setDoc, updateDoc, collection, query, where } from 'firebase/firestore';


const handleCheckIn = async (officeId, workerId) => {
  const db = getFirestore();
  const date = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toISOString();

  try {
      const checkInsRef = collection(db, `officers/pNEWwwYDaAQIdcpHQFRS1AFGqwJ2/offices/${officeId}/workers/${workerId}/checkins`);
      const q = query(checkInsRef, where('date', '==', date));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const docRef = doc(db, docSnap.ref.path);

          const data = docSnap.data();
          if (!data.checkInTime) {
              await updateDoc(docRef, { checkInTime: currentTime });
              console.log('Check-in time recorded.');
          } else {
              console.log('Check-in time is already recorded for today.');
          }
      } else {
          const newDocRef = doc(checkInsRef, date);
          await setDoc(newDocRef, {
              date: date,
              checkInTime: currentTime,
              checkOutTime: null,
          });
          console.log('New check-in record created.');
      }
  } catch (error) {
      console.error('Error recording check-in:', error);
  }
};

const handleCheckOut = async (officeId, workerId) => {
  const db = getFirestore();
  const date = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toISOString();

  try {
      const checkInsRef = collection(db, `officers/pNEWwwYDaAQIdcpHQFRS1AFGqwJ2/offices/${officeId}/workers/${workerId}/checkins`);
      const q = query(checkInsRef, where('date', '==', date));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const docRef = doc(db, docSnap.ref.path);

          const data = docSnap.data();
          if (!data.checkOutTime && data.checkInTime) {
              await updateDoc(docRef, { checkOutTime: currentTime });
              console.log('Check-out time recorded.');
          } else if (data.checkOutTime) {
              console.log('Check-out time is already recorded for today.');
          } else {
              console.log('No check-in record found for today.');
          }
      } else {
          console.log('No check-in record found for today.');
      }
  } catch (error) {
      console.error('Error recording check-out:', error);
  }
};


TaskManager.defineTask(YOUR_TASK_NAME, async ({ data: { eventType, region }, error }) => {
  if (error) {
      console.log(error.message);
      return;
  }

  const officeId = await AsyncStorage.getItem('officeId');
  const workerId = await AsyncStorage.getItem('workerId');

  if (!officeId || !workerId) {
      console.error('Office ID or Worker ID is missing.');
      return;
  }

  if (eventType === GeofencingEventType.Enter) {
      await handleCheckIn(officeId, workerId);
  } else if (eventType === GeofencingEventType.Exit) {
      await handleCheckOut(officeId, workerId);
      console.log("You've left the region:", region);
  }
});