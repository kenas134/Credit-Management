// mobile/app/notification/index.js
// Notifications screen — payment reminders and overdue alerts

import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../src/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

const TYPE_ICON = {
  PAYMENT_REMINDER: { name: 'notifications', color: COLORS.primary },
  OVERDUE_ALERT: { name: 'alert-circle', color: COLORS.danger },
  PAYMENT_RECEIVED: { name: 'checkmark-circle', color: COLORS.success },
  CREDIT_LIMIT_WARNING: { name: 'warning', color: COLORS.warning },
  SYSTEM: { name: 'information-circle', color: COLORS.primary },
};

function NotifItem({ item, onPress }) {
  const isRead = item.status === 'READ';
  const icon = TYPE_ICON[item.type] || { name: 'mail', color: COLORS.textMuted };
  
  return (
    <TouchableOpacity
      style={[styles.item, !isRead && styles.itemUnread]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: icon.color + '20' }]}>
        <Ionicons name={icon.name} size={24} color={icon.color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, !isRead && styles.itemTitleBold]}>
          {item.title || (item.type?.replace(/_/g, ' ') || 'Notification')}
        </Text>
        <Text style={styles.itemBody} numberOfLines={3}>
          {item.message || item.body || 'No message content'}
        </Text>
        <Text style={styles.itemTime}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      {!isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useNotifications();
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAll } = useMarkAllAsRead();

  // Handle both array and object response
  const notifications = Array.isArray(data?.data) ? data.data : data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount ?? notifications.filter((n) => n.status === 'UNREAD').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount} new</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={() => markAll()} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotifItem item={item} onPress={(id) => item.status === 'UNREAD' && markRead(id)} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptyText}>No notifications at the moment.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  backBtn: {
    width: 40, height: 40, backgroundColor: COLORS.bgDark,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitleWrap: { flex: 1, marginLeft: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  unreadCountBadge: { backgroundColor: COLORS.primaryBg, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 },
  unreadCountText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.bgDark, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  markAllText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 16 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  itemUnread: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primaryBg },
  iconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  itemTitleBold: { fontWeight: '700', color: COLORS.textPrimary },
  itemBody: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  itemTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 10, marginTop: 4 },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 20 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 22 },
});
