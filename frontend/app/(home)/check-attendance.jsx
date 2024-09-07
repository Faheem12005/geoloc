import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../components/CustomButton';

const db = getFirestore();

const CheckAttendance = () => {
  const [workerId, setWorkerId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [offices, setOffices] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true);
      setError(null);

      try {
        const officerId = await AsyncStorage.getItem('userId');
        const officeIds = await AsyncStorage.getItem('officeIds');
        if (officeIds) {
          setOffices(JSON.parse(officeIds));
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching offices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchAttendanceRecords = async () => {
    if (!workerId || !officeId) {
      Alert.alert('Error', 'Please enter both Worker ID and select an Office ID');
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);

    try {
      const officerId = await AsyncStorage.getItem('userId');
      const workerCheckInsRef = collection(db, `officers/${officerId}/offices/${officeId}/workers/${workerId}/checkins`);
      const snapshot = await getDocs(workerCheckInsRef);

      if (snapshot.empty) {
        Alert.alert('No Records', 'No attendance records found for this Worker ID in the selected office.');
        setLoading(false);
        return;
      }

      const fetchedData = snapshot.docs.map(doc => ({
        date: doc.id,
        ...doc.data()
      }));

      setData(fetchedData);
    } catch (error) {
      setError(error);
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <View className="mb-4">
        <TextInput
          className="border-2 border-black-100 rounded-md px-4 py-2 text-white font-psemibold focus:border-white"
          placeholder="Enter Worker ID"
          placeholderTextColor="white"
          value={workerId}
          onChangeText={text => setWorkerId(text)}
        />
        <View className="border border-gray-300 rounded p-2 bg-black-100">
          <Picker
            selectedValue={officeId}
            onValueChange={(itemValue) => setOfficeId(itemValue)}
          >
            <Picker.Item label="Select Office ID" value="" />
            {offices.map((office) => (
              <Picker.Item key={office} label={office} value={office} />
            ))}
          </Picker>
        </View>
        <CustomButton
        title={'Fetch Attendance Records'}
        handlePress={fetchAttendanceRecords}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : error ? (
        <Text className="text-red-500">Error fetching data</Text>
      ) : (
        <ScrollView contentContainerStyle="p-2">
          <View className="flex-row border-b border-gray-300 mb-2">
            <Text className="flex-1 font-semibold text-white p-2">Date</Text>
            <Text className="flex-1 font-semibold text-white p-2">Check In</Text>
            <Text className="flex-1 font-semibold text-white p-2">Check Out</Text>
          </View>
          {data.map((item) => (
            <View key={item.date} className="flex-row border-b border-gray-200 mb-1">
              <Text className="flex-1 text-white p-2">{item.date}</Text>
              <Text className="flex-1 text-white p-2">{formatTime(item.checkInTime) || 'N/A'}</Text>
              <Text className="flex-1 text-white p-2">{formatTime(item.checkOutTime) || 'N/A'}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CheckAttendance;
