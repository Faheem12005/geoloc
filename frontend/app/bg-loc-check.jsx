import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
const YOUR_TASK_NAME = 'bg-loc-check'
 TaskManager.defineTask(YOUR_TASK_NAME, async({ data: { eventType, region }, error }) => {
  if (error) {
    console.log(error.message)
    return;
  }
  if (eventType === GeofencingEventType.Enter) {
    const userId = await AsyncStorage.getItem('userId');

  } else if (eventType === GeofencingEventType.Exit) {
    const userId = await AsyncStorage.getItem('userId');
    console.log("You've left region:", region);
  }
}); 
