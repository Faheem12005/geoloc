import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckAttendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([
    {
      id: 'E001',
      name: 'John Doe',
      checkIn: '08:00 AM',
      checkOut: '05:00 PM'
    },
    {
      id: 'E002',
      name: 'Jane Smith',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM'
    }
  ]);

  // Filter data based on search query
  const filteredData = data.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 p-4 h-full bg-primary">
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 placeholder:font-psemibold text-white focus:border-white"
          placeholder="Search by Employee ID"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <ScrollView contentContainerStyle="p-2">
        <View className="flex-row border-b border-gray-300 mb-2">
          <Text className="flex-1 font-psemibold text-white p-2">ID</Text>
          <Text className="flex-1 font-psemibold text-white p-2">Name</Text>
          <Text className="flex-1 font-psemibold text-white p-2">Check In</Text>
          <Text className="flex-1 font-psemibold text-white p-2">Check Out</Text>
        </View>
        {filteredData.map((item) => (
          <View key={item.id} className="flex-row border-b border-gray-200 mb-1">
            <Text className="flex-1 text-white p-2">{item.id}</Text>
            <Text className="flex-1 text-white p-2">{item.name}</Text>
            <Text className="flex-1 text-white p-2">{item.checkIn}</Text>
            <Text className="flex-1 text-white p-2">{item.checkOut}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckAttendance;




// import React, { useEffect, useState } from 'react';
// import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const CheckAttendance = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://example.com/api/attendance'); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         setError(error);
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 bg-white p-4 items-center justify-center">
//         <ActivityIndicator size="large" color="#0000ff" />
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView className="flex-1 bg-white p-4 items-center justify-center">
//         <Text className="text-red-500 font-psemibold">Error fetching data</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white p-4">
//       <ScrollView contentContainerStyle="p-2">
//         <View className="flex-row border-b border-gray-300 mb-2">
//           <Text className="flex-1 font-psemibold text-white p-2">Employee ID</Text>
//           <Text className="flex-1 font-psemibold text-white p-2">Name</Text>
//           <Text className="flex-1 font-psemibold text-white p-2">Check In</Text>
//           <Text className="flex-1 font-psemibold text-white p-2">Check Out</Text>
//         </View>
//         {data.map((item) => (
//           <View key={item.id} className="flex-row border-b border-gray-200 mb-1">
//             <Text className="flex-1 text-white p-2">{item.id}</Text>
//             <Text className="flex-1 text-white p-2">{item.name}</Text>
//             <Text className="flex-1 text-white p-2">{item.checkIn}</Text>
//             <Text className="flex-1 text-white p-2">{item.checkOut}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default CheckAttendance;
