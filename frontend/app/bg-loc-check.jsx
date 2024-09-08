import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
const YOUR_TASK_NAME = 'bg-loc-check'
import { doc, getDocs, setDoc, updateDoc, collection, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const handleCheckIn = async (officeId, workerId) => {
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
            const sessions = data.sessions || [];
  
            // Add a new session with the check-in time, check-out time is null for now
            sessions.push({ checkInTime: currentTime, checkOutTime: null });
  
            await updateDoc(docRef, { sessions: sessions });
            console.log('New check-in session added.');
        } else {
            // Create a new document with the first check-in session for today
            const newDocRef = doc(checkInsRef, date);
            await setDoc(newDocRef, {
                date: date,
                sessions: [{ checkInTime: currentTime, checkOutTime: null }],
            });
            console.log('New check-in record created with first session.');
        }
    } catch (error) {
        console.error('Error recording check-in:', error);
    }
  };
  
  const handleCheckOut = async (officeId, workerId) => {
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
            const sessions = data.sessions || [];
  
            // Find the last session where checkOutTime is null
            const lastSession = sessions[sessions.length - 1];
            if (lastSession && !lastSession.checkOutTime) {
                lastSession.checkOutTime = currentTime; // Update check-out time
                await updateDoc(docRef, { sessions: sessions });
                console.log('Check-out time recorded for the last session.');
            } else {
                console.log('No check-in session without check-out found for today.');
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
  }
});