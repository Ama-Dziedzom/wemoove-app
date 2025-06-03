import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';

interface SeatSelectionProps {
  busId: string;
  unavailableSeats: string[];
  selectedSeats: string[];
  onSeatSelect: (seatNumber: string) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ 
  busId, 
  unavailableSeats = [], 
  selectedSeats = [],
  onSeatSelect 
}) => {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  // Generate a seat map with 10 rows (A-J) and 4 seats per row
  const generateSeatMap = () => {
    const rows = 10;
    const layout = [];
    
    // Convert unavailable and selected seats to Sets for faster lookups
    const unavailableSeatsSet = new Set(unavailableSeats);
    const selectedSeatsSet = new Set(selectedSeats);
    
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      const rowSeats = [];
      
      for (let j = 1; j <= 4; j++) {
        const seatId = `${rowLetter}${j}`;
        const isUnavailable = unavailableSeatsSet.has(seatId);
        const isSelected = selectedSeatsSet.has(seatId);
        
        rowSeats.push({
          id: seatId,
          status: isUnavailable ? 'unavailable' : isSelected ? 'selected' : 'available'
        });
      }
      
      layout.push({
        row: rowLetter,
        seats: rowSeats
      });
    }
    
    return layout;
  };

  const seatMap = generateSeatMap();

  const handleSeatPress = (seatId: string, status: string) => {
    if (status !== 'unavailable') {
      onSeatSelect(seatId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.driverSection}>
        <View style={[styles.steeringWheel, { borderColor: themeColors.border }]}>
          <Text style={{ color: themeColors.subtext, fontSize: 10 }}>Driver</Text>
        </View>
      </View>
      
      <View style={styles.seatMap}>
        {seatMap.map(row => (
          <View key={row.row} style={styles.row}>
            <Text style={[styles.rowLabel, { color: themeColors.subtext }]}>{row.row}</Text>
            
            <View style={styles.seats}>
              <View style={styles.seatGroup}>
                {row.seats.slice(0, 2).map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seat,
                      { borderColor: themeColors.border },
                      seat.status === 'unavailable' && [styles.unavailableSeat, { backgroundColor: themeColors.error + '40' }],
                      seat.status === 'selected' && [styles.selectedSeat, { backgroundColor: themeColors.primary }]
                    ]}
                    onPress={() => handleSeatPress(seat.id, seat.status)}
                    disabled={seat.status === 'unavailable'}
                  >
                    <Text 
                      style={[
                        styles.seatText,
                        { color: themeColors.text },
                        (seat.status === 'unavailable' || seat.status === 'selected') && styles.unavailableSeatText
                      ]}
                    >
                      {seat.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.aisle} />
              
              <View style={styles.seatGroup}>
                {row.seats.slice(2, 4).map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seat,
                      { borderColor: themeColors.border },
                      seat.status === 'unavailable' && [styles.unavailableSeat, { backgroundColor: themeColors.error + '40' }],
                      seat.status === 'selected' && [styles.selectedSeat, { backgroundColor: themeColors.primary }]
                    ]}
                    onPress={() => handleSeatPress(seat.id, seat.status)}
                    disabled={seat.status === 'unavailable'}
                  >
                    <Text 
                      style={[
                        styles.seatText,
                        { color: themeColors.text },
                        (seat.status === 'unavailable' || seat.status === 'selected') && styles.unavailableSeatText
                      ]}
                    >
                      {seat.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.entranceSection}>
        <View style={[styles.entrance, { borderColor: themeColors.border }]}>
          <Text style={{ color: themeColors.subtext, fontSize: 10 }}>Entrance</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  steeringWheel: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatMap: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  rowLabel: {
    width: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableSeat: {
    borderWidth: 0,
  },
  selectedSeat: {
    borderWidth: 0,
  },
  seatText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unavailableSeatText: {
    color: '#FFFFFF',
  },
  aisle: {
    width: 20,
  },
  entranceSection: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  entrance: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SeatSelection;