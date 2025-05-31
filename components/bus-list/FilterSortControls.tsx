"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import Slider from "@react-native-community/slider"
import CheckBox from "@react-native-community/checkbox"

interface FilterSortControlsProps {
  onFilterChange: (filters: any) => void
  onSortChange: (sortBy: string) => void
  sortBy: string
  filters: {
    minPrice: number
    maxPrice: number
    amenities: string[]
    operators: string[]
  }
}

export default function FilterSortControls({ onFilterChange, onSortChange, sortBy, filters }: FilterSortControlsProps) {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const handlePriceChange = (values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }))
  }

  const handleAmenityChange = (amenity: string, isChecked: boolean) => {
    setLocalFilters((prev) => {
      if (isChecked) {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        }
      } else {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        }
      }
    })
  }

  const handleOperatorChange = (operator: string, isChecked: boolean) => {
    setLocalFilters((prev) => {
      if (isChecked) {
        return {
          ...prev,
          operators: [...prev.operators, operator],
        }
      } else {
        return {
          ...prev,
          operators: prev.operators.filter((o) => o !== operator),
        }
      }
    })
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
    setIsFilterModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterModalVisible(true)}>
        <Ionicons name="filter" size={18} color="#333" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <View style={styles.sortContainer}>
        <Ionicons name="swap-vertical" size={18} color="#666" />
        <Picker selectedValue={sortBy} onValueChange={onSortChange} style={styles.sortPicker}>
          <Picker.Item label="Departure Time" value="departureTime" />
          <Picker.Item label="Price: Low to High" value="price" />
          <Picker.Item label="Price: High to Low" value="priceDesc" />
          <Picker.Item label="Duration" value="duration" />
          <Picker.Item label="Rating" value="rating" />
        </Picker>
      </View>

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range (GHS)</Text>
                <Slider
                  value={localFilters.minPrice}
                  onValueChange={(value) => handlePriceChange([value, localFilters.maxPrice])}
                  minimumValue={0}
                  maximumValue={500}
                  step={10}
                  minimumTrackTintColor="#FF5722"
                  maximumTrackTintColor="#ddd"
                />
                <View style={styles.priceLabels}>
                  <Text>GHS {localFilters.minPrice}</Text>
                  <Text>GHS {localFilters.maxPrice}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              {/* Amenities */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Amenities</Text>
                {["AC", "Wi-Fi", "Charging Port", "Refreshments"].map((amenity) => (
                  <View key={amenity} style={styles.checkboxRow}>
                    <CheckBox
                      value={localFilters.amenities.includes(amenity)}
                      onValueChange={(newValue) => handleAmenityChange(amenity, newValue)}
                      tintColors={{ true: "#FF5722", false: "#ddd" }}
                    />
                    <Text style={styles.checkboxLabel}>{amenity}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.separator} />

              {/* Operators */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Operators</Text>
                {["VIP Jeoun", "STC", "OA Travel & Tours", "Metro Mass Transit"].map((operator) => (
                  <View key={operator} style={styles.checkboxRow}>
                    <CheckBox
                      value={localFilters.operators.includes(operator)}
                      onValueChange={(newValue) => handleOperatorChange(operator, newValue)}
                      tintColors={{ true: "#FF5722", false: "#ddd" }}
                    />
                    <Text style={styles.checkboxLabel}>{operator}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortPicker: {
    width: 180,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#FF5722",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
