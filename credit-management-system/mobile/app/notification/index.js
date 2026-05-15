// mobile/app/notification/index.js
// Notifications screen — payment reminders and overdue alerts

import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../src/hooks/useNotifications';
import COLORS from '../../src/constants/colors';

const TYPE_EMOJI = {
  PAYMENT_REMINDER: '🔔',
  OVERDUE_ALERT: '🚨',
  PAYMENT_RECEIVED: '✅',
  CREDIT_LIMIT_WARNING: '⚠️',
  SYSTEM: '📢',
};

function NotifItem({ item, onPress }) {
  const isRead = item.isRead;
  return (
    <TouchableOpacity
      style={[styles.item, !isRead && styles.itemUnread]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{TYPE_EMOJI[item.type] || '📬'}</Text>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, !isRead && styles.itemTitleBold]}>{item.title}</Text>
        <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
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

  const notifications = data?.data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.unreadBadge}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => markAll()} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotifItem item={item} onPress={(id) => !item.isRead && markRead(id)} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔕</Text>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border }} />}
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
  },
  backBtn: {
    width: 40, height: 40, backgroundColor: COLORS.bgCard,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backIcon: { fontSize: 18, color: COLORS.textPrimary },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  unreadBadge: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.primaryBg, borderRadius: 10 },
  markAllText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 8 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16, marginVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  itemUnread: { borderColor: COLORS.primary + '60', backgroundColor: COLORS.primaryBg },
  emoji: { fontSize: 24, marginRight: 14 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, color: COLORS.textSecondary },
  itemTitleBold: { fontWeight: '700', color: COLORS.textPrimary },
  itemBody: { fontSize: 13, color: COLORS.textSecondary, marginTop: 3, lineHeight: 18 },
  itemTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 5 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 8 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
