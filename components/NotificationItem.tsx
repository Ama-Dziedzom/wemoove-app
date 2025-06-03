import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  icon: React.ReactNode;
  formattedDate: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress, 
  icon,
  formattedDate
}) => {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: notification.read ? themeColors.card : `${themeColors.primary}10`,
          borderColor: themeColors.border
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {notification.title}
        </Text>
        <Text style={[styles.message, { color: themeColors.subtext }]}>
          {notification.message}
        </Text>
        <Text style={[styles.timestamp, { color: themeColors.subtext }]}>
          {formattedDate}
        </Text>
      </View>
      
      {!notification.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: themeColors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default NotificationItem;