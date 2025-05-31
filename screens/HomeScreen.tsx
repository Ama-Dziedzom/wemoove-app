import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { GoTrueClient } from '@supabase/gotrue-js';
import { PostgrestClient } from '@supabase/postgrest-js';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native-paper";

const HomeScreen = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [leavingDate, setLeavingDate] = useState<Date>(new Date());
  const [passengers, setPassengers] = useState(2);
  const [tripType, setTripType] = useState('one-way');

  const [departureOptions, setDepartureOptions] = useState<string[]>([]);
  const [arrivalOptions, setArrivalOptions] = useState<string[]>([]);

  const [filteredDepartureOptions, setFilteredDepartureOptions] = useState<string[]>([]);
  const [filteredArrivalOptions, setFilteredArrivalOptions] = useState<string[]>([]);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data: departureData, error: departureError } = await db
          .from('buses')
          .select('departure_location');

        if (departureError) throw departureError;

        const uniqueDepartureLocations = Array.from(new Set(departureData.map(item => item.departure_location).filter(Boolean)));
        setDepartureOptions(uniqueDepartureLocations);
        console.log('Departure Locations:', uniqueDepartureLocations);

        const { data: arrivalData, error: arrivalError } = await db
          .from('buses')
          .select('arrival_location');

        if (arrivalError) throw arrivalError;

        const uniqueArrivalLocations = Array.from(new Set(arrivalData.map(item => item.arrival_location).filter(Boolean)));
        setArrivalOptions(uniqueArrivalLocations);
        console.log('Arrival Locations:', uniqueArrivalLocations);

      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (origin === '') {
      setFilteredDepartureOptions([]);
    } else {
      setFilteredDepartureOptions(
        departureOptions.filter(location =>
          location.toLowerCase().includes(origin.toLowerCase())
        )
      );
    }
  }, [origin, departureOptions]);

  useEffect(() => {
    if (destination === '') {
      setFilteredArrivalOptions([]);
    } else {
      setFilteredArrivalOptions(
        arrivalOptions.filter(location =>
          location.toLowerCase().includes(destination.toLowerCase())
        )
      );
    }
  }, [destination, arrivalOptions]);

  const handleSelectOrigin = (location: string) => {
    setOrigin(location);
    setFilteredDepartureOptions([]);
  };

  const handleSelectDestination = (location: string) => {
    setDestination(location);
    setFilteredArrivalOptions([]);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

const handleConfirmDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
  if (event.type === 'dismissed') {
    hideDatePicker();
    return;
  }
  hideDatePicker();
  selectedDate && setLeavingDate(selectedDate);
};

const increasePassengers = () =>
  setPassengers((prev) => (prev < 50 ? prev + 1 : prev)); // Reasonable max limit

 const decreasePassengers = () =>
   setPassengers((prev) => (prev > 1 ? prev - 1 : prev));

  const handleFindTickets = () => {
    console.log('Finding tickets with:', {
      origin,
      destination,
      leavingDate: leavingDate.toDateString(),
      passengers,
      tripType,
    });
  };

  const swapOriginDestination = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const formattedLeavingDate = leavingDate.toDateString();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>Let's book bus tickets!</Text>
        {/* Placeholder for image illustration */}
        <View style={styles.illustrationPlaceholder}></View>
      </View>

      {/* Form and Find Tickets Button Container */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* FROM Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>FROM</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.inputText}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Enter origin"
              />
            </View>
            {filteredDepartureOptions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredDepartureOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectOrigin(item)}>
                      <Text style={styles.suggestionItem}>{item}</Text>
                    </Pressable>
                  )}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            )}
          </View>

          {/* Swap Button */}
          <Pressable onPress={swapOriginDestination} style={styles.swapButtonPlaceholder}>
            <Text style={styles.iconPlaceholderText}>Swap</Text>
          </Pressable>

          {/* TO Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>TO</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.inputText}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination"
              />
            </View>
            {filteredArrivalOptions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredArrivalOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectDestination(item)}>
                      <Text style={styles.suggestionItem}>{item}</Text>
                    </Pressable>
                  )}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            )}
          </View>

          {/* Leaving Date */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>LEAVING</Text>
            <View style={[styles.inputField, styles.datePickerField]}>
               <Text style={styles.inputText}>{formattedLeavingDate}</Text>
               <Pressable onPress={showDatePicker} style={styles.calendarIconPlaceholder}>
                  <Text style={styles.iconPlaceholderText}>Cal</Text>
               </Pressable>
            </View>
          </View>

          {/* Passengers */}
           <View style={styles.inputRow}>
            <Text style={styles.label}>PASSENGERS</Text>
            <View style={[styles.inputField, styles.passengersField]}>
               <Text style={styles.subText}>How many travelers?</Text>
               <View style={styles.passengerControls}>
                  <Pressable onPress={decreasePassengers} style={styles.controlButton}><Text>-</Text></Pressable>
                  <Text style={styles.passengerCount}>{passengers}</Text>
                  <Pressable onPress={increasePassengers} style={styles.controlButton}><Text>+</Text></Pressable>
               </View>
            </View>
          </View>
        </View>

        {/* Find Tickets Button */}
        <Pressable onPress={handleFindTickets} style={styles.findTicketsButtonPlaceholder}>
           <Text style={styles.findTicketsButtonText}>Find tickets</Text>
        </Pressable>
      </View>

      {/* Date Picker Modal */}
      {isDatePickerVisible && (
        <DateTimePicker
          testID="datePicker"
          value={leavingDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleConfirmDate}
        />
      )}

      {/* Popular Routes Section */}
      {/* Removed Popular Routes Section */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E", // Dark background for the header section
  },
  header: {
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    height: 200, // Adjust height as needed
  },
  headerTitle: {
    color: "#fff", // White text color
    marginTop: 20, // Add some margin from the top
    fontSize: 30, // Larger font size
    fontWeight: 'bold',
  },
  illustrationPlaceholder: {
    width: '100%',
    height: 100, // Placeholder for the illustration
    backgroundColor: '#333', // Still using dark grey placeholder for illustration area
    marginTop: 20,
  },
  content: {
    flex: 1,
    padding: 20, // Add padding similar to the old content view
  },
  formContainer: {
    backgroundColor: "#fff", // White background for the form section
    borderTopLeftRadius: 30, // Curved top-left corner
    borderTopRightRadius: 30, // Curved top-right corner
    padding: 20, // Keep padding
    marginTop: -30, // Pull the form container up to overlap with the header
  },
  inputRow: {
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: '#f0f0f0', // Light grey background
    padding: 15,
    borderRadius: 5,
  },
  inputText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: '#555',
  },
   swapButtonPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#1A1A2E', // Dark background for swap button
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: -20,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIconPlaceholder: {
    width: 34,
    height: 34,
    backgroundColor: '#1A1A2E', // Dark background for calendar icon
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
   passengersField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1, // Add border to see the button area clearly
    borderColor: '#ccc',
  },
  passengerCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
   findTicketsButtonPlaceholder: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A1A2E', // Dark button background
    borderRadius: 5,
    marginTop: 20, // Restore marginTop
    alignItems: 'center', // Keep alignment
    justifyContent: 'center', // Keep justification
  },
  findTicketsButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconPlaceholderText: {
    color: '#fff', // White text for icon placeholders
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
})
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
/* Optionally assert */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in env variables');
}

// Auth client setup
export const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  autoRefreshToken: true,
  persistSession: true,
  storageKey: 'supabase.auth.token',
  storage: AsyncStorage,
  fetch: fetch, // Use native fetch API for networking
});

// DB client setup (for querying data)
export const db = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
  fetch: fetch, // Use native fetch API
});

// You might also need a way to access the combined client if you use functions
// that require both auth and db, but often you can use auth and db separately.
// If you need the combined client for specific cases (like invoking functions),
// you might need a different approach or a polyfill for ws if you do use Realtime.

export default HomeScreen;
