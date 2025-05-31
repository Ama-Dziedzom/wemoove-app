import { StyleSheet, View, Text, Image } from "react-native"

interface OperatorLogoProps {
  name: string
  logo: string
}

export default function OperatorLogo({ name, logo }: OperatorLogoProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: logo }} style={styles.logo} />
      <Text style={styles.name}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})
