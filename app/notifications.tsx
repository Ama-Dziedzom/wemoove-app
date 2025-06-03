import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Trash2
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import NotificationItem from '@/components/NotificationItem';
import Button from '@/components/Button';

export default function NotificationsScreen() {
  const { 
    settings, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    clearNotifications
  } = useAppStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];

  const handleClearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearNotifications,
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleNotificationPress = (id: string) => {
    markNotificationAsRead(id);
    // In a real app, navigate to the relevant screen based on notification type
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={20} color={themeColors.info} />;
      case 'success':
        return <CheckCircle size={20} color={themeColors.success} />;
      case 'warning':
        return <AlertTriangle size={20} color={themeColors.warning} />;
      case 'error':
        return <XCircle size={20} color={themeColors.error} />;
      default:
        return <Bell size={20} color={themeColors.primary} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {notifications.length > 0 ? (
        <>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <Button
                title="Mark All as Read"
                variant="outline"
                onPress={handleMarkAllAsRead}
                style={styles.headerButton}
              />
              <Button
                title="Clear All"
                variant="outline"
                onPress={handleClearAll}
                style={styles.headerButton}
                icon={<Trash2 size={16} color={themeColors.error} />}
                textColor={themeColors.error}
              />
            </View>
          </View>
          
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <NotificationItem
                notification={item}
                onPress={() => handleNotificationPress(item.id)}
                icon={getNotificationIcon(item.type)}
                formattedDate={formatDate(item.date)}
              />
            )}
            contentContainerStyle={styles.notificationsList}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={60} color={themeColors.subtext} />
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            No Notifications
          </Text>
          <Text style={[styles.emptySubtitle, { color: themeColors.subtext }]}>
            You don't have any notifications at the moment.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  notificationsList: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});