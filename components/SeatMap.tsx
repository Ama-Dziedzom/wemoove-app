import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';

interface SeatMapProps {
  busId: string;
  unavailableSeats: string[];
  bookedSeats?: string[];
  onViewSeats: () => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ 
  busId, 
  unavailableSeats, 
  bookedSeats = [],
  onViewSeats 
}) => {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  // Generate a simplified preview of the seat map
  const generatePreviewMap = () => {
    // Show just first 2 rows (8 seats) as a preview
    const rows = 2;
    const layout = [];
    
    // Convert unavailable and booked seats to Sets for faster lookups
    const unavailableSeatsSet = new Set(unavailableSeats);
    const bookedSeatsSet = new Set(bookedSeats);
    
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      const rowSeats = [];
      
      for (let j = 1; j <= 4; j++) {
        const seatId = `${rowLetter}${j}`;
        const isUnavailable = unavailableSeatsSet.has(seatId);
        const isBooked = bookedSeatsSet.has(seatId);
        
        rowSeats.push({
          id: seatId,
          status: isUnavailable ? 'unavailable' : isBooked ? 'booked' : 'available'
        });
      }
      
      layout.push({
        row: rowLetter,
        seats: rowSeats
      });
    }
    
    return layout;
  };

  const previewMap = generatePreviewMap();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Seat Map</Text>
        <TouchableOpacity onPress={onViewSeats}>
          <Text style={[styles.viewAllButton, { color: themeColors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.mapPreview}>
        {previewMap.map(row => (
          <View key={row.row} style={styles.row}>
            <Text style={[styles.rowLabel, { color: themeColors.subtext }]}>{row.row}</Text>
            
            <View style={styles.seats}>
              <View style={styles.seatGroup}>
                {row.seats.slice(0, 2).map(seat => (
                  <View
                    key={seat.id}
                    style={[
                      styles.seat,
                      seat.status === 'unavailable' && [styles.unavailableSeat, { backgroundColor: themeColors.inactive }],
                      seat.status === 'booked' && [styles.bookedSeat, { backgroundColor: themeColors.warning }]
                    ]}
                  >
                    <Text 
                      style={[
                        styles.seatText,
                        (seat.status === 'unavailable' || seat.status === 'booked') && styles.unavailableSeatText
                      ]}
                    >
                      {seat.id}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.aisle} />
              
              <View style={styles.seatGroup}>
                {row.seats.slice(2, 4).map(seat => (
                  <View
                    key={seat.id}
                    style={[
                      styles.seat,
                      seat.status === 'unavailable' && [styles.unavailableSeat, { backgroundColor: themeColors.inactive }],
                      seat.status === 'booked' && [styles.bookedSeat, { backgroundColor: themeColors.warning }]
                    ]}
                  >
                    <Text 
                      style={[
                        styles.seatText,
                        (seat.status === 'unavailable' || seat.status === 'booked') && styles.unavailableSeatText
                      ]}
                    >
                      {seat.id}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} />
          <Text style={[styles.legendText, { color: themeColors.text }]}>Available</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: themeColors.warning }]} />
          <Text style={[styles.legendText, { color: themeColors.text }]}>Booked</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: themeColors.inactive }]} />
          <Text style={[styles.legendText, { color: themeColors.text }]}>Unavailable</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapPreview: {
    marginBottom: 12,
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
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    backgroundColor: '#FFFFFF',
  },
  unavailableSeat: {
    borderWidth: 0,
  },
  bookedSeat: {
    borderWidth: 0,
  },
  seatText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  unavailableSeatText: {
    color: '#FFFFFF',
  },
  aisle: {
    width: 15,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 10,
  },
});

export default SeatMap;