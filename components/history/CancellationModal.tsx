import { StyleSheet, View, Text, Modal, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface CancellationModalProps {
  bookingId: string
  onConfirm: (bookingId: string) => void
  onCancel: () => void
  loading: boolean
}

export default function CancellationModal({ bookingId, onConfirm, onCancel, loading }: CancellationModalProps) {
  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Ionicons name="alert-triangle" size={24} color="#f44336" />
            <Text style={styles.title}>Cancel Booking</Text>
          </View>

          <Text style={styles.description}>
            Are you sure you want to cancel this booking? You will receive a refund according to our cancellation
            policy.
          </Text>

          <View style={styles.policyContainer}>
            <Text style={styles.policyTitle}>Cancellation Policy:</Text>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Cancellations made 24+ hours before departure: 100% refund</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Cancellations made 12-24 hours before departure: 50% refund</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Cancellations made less than 12 hours before departure: No refund</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelButtonText}>Keep Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(bookingId)} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Yes, Cancel Booking</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  policyContainer: {
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 8,
  },
  policyItem: {
    marginBottom: 4,
  },
  policyText: {
    fontSize: 13,
    color: "#795548",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#333",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
})
