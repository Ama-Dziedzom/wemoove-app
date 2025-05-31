"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const { isDark, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const { notificationCount } = useNotifications()

  const [language, setLanguage] = useState("en")

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    // In a real app, you would update the app's language here
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your app experience</Text>
        </View>

        {/* App Preferences */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>App Preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch between light and dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#FF8A65" }}
              thumbColor={isDark ? "#FF5722" : "#f4f3f4"}
            />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("NotificationSettings")}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Notifications</Text>
                <Text style={styles.settingDescription}>Manage your notification preferences</Text>
              </View>
            </View>
            <View style={styles.settingAction}>
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Language</Text>
                <Text style={styles.settingDescription}>Change the app language</Text>
              </View>
            </View>
            <View style={styles.settingAction}>
              <Text style={[styles.languageText, isDark && styles.textDark]}>
                {language === "en" ? "English" : language === "fr" ? "French" : "Twi"}
              </Text>
              <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Profile")}>
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Edit Profile</Text>
                <Text style={styles.settingDescription}>Update your personal information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your account password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Support</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL("https://example.com/help")}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Help Center</Text>
                <Text style={styles.settingDescription}>Get help with using the app</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL("mailto:support@example.com")}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={24} color={isDark ? "#fff" : "#333"} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDark && styles.textDark]}>Contact Us</Text>
                <Text style={styles.settingDescription}>Send us an email with your questions</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={async () => {
            await logout()
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FF5722",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: "#1E1E1E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  textDark: {
    color: "#fff",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  settingAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonDark: {
    backgroundColor: "#1E1E1E",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
  badge: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})
