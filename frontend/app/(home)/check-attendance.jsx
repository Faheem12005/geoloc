import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckAttendance = () => {
  const data = [
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.table}>
        <View style={styles.row}>
          <Text style={styles.header}>Employee ID</Text>
          <Text style={styles.header}>Name</Text>
          <Text style={styles.header}>Check In</Text>
          <Text style={styles.header}>Check Out</Text>
        </View>
        {data.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.checkIn}</Text>
            <Text style={styles.cell}>{item.checkOut}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  table: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default CheckAttendance;
