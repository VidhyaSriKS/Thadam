import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useProfileStore } from '../../store/useProfileStore';
import { DataBadge } from '../../components/ui/DataBadge';
import { useTranslation } from '../../i18n';

interface NotificationCenterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDestination?: (destId: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  visible,
  onClose,
  onSelectDestination,
}) => {
  const { notifications, unreadCount, markAllRead, markAsRead } = useNotificationStore();
  const { profile, updateProfile } = useProfileStore();
  const { isTamil } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState<'FOR_YOU' | 'TRIP_UPDATE' | 'BOOKINGS'>('FOR_YOU');
  const [showSettings, setShowSettings] = useState(false);

  const filtered = notifications.filter((n) => n.group === selectedGroup);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{isTamil ? 'அறிவிப்பு மையம்' : 'Notification Center'}</Text>
              <Text style={styles.subtitle}>
                {unreadCount > 0
                  ? (isTamil ? `${unreadCount} புதிய அறிவிப்புகள்` : `${unreadCount} unread update(s)`)
                  : (isTamil ? 'அனைத்தும் படிக்கப்பட்டது' : 'All caught up')}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>⚙</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showSettings ? (
            <View style={styles.settingsBox}>
              <Text style={styles.settingsTitle}>
                {isTamil ? 'விருப்ப அறிவிப்பு அமைப்புகள்' : 'PREFERENCE NOTIFICATION SETTINGS'}
              </Text>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{isTamil ? 'பரிந்துரைகள் (உங்களுக்காக)' : "Recommendations ('For You')"}</Text>
                <Switch
                  value={profile.notifications.recommendations}
                  onValueChange={(val) =>
                    updateProfile({ notifications: { ...profile.notifications, recommendations: val } })
                  }
                  trackColor={{ false: colors.line, true: colors.primary }}
                />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{isTamil ? 'பயணத் திட்ட எச்சரிக்கைகள்' : 'Trip Disruption Alerts'}</Text>
                <Switch
                  value={profile.notifications.tripUpdates}
                  onValueChange={(val) =>
                    updateProfile({ notifications: { ...profile.notifications, tripUpdates: val } })
                  }
                  trackColor={{ false: colors.line, true: colors.primary }}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.groupTabs}>
                {(['FOR_YOU', 'TRIP_UPDATE', 'BOOKINGS'] as const).map((grp) => (
                  <TouchableOpacity
                    key={grp}
                    style={[styles.groupTab, selectedGroup === grp && styles.groupTabActive]}
                    onPress={() => setSelectedGroup(grp)}
                  >
                    <Text style={[styles.groupTabText, selectedGroup === grp && styles.groupTabTextActive]}>
                      {grp === 'FOR_YOU'
                        ? (isTamil ? 'உங்களுக்காக' : 'For You')
                        : grp === 'TRIP_UPDATE'
                        ? (isTamil ? 'பயண மாற்றங்கள்' : 'Trip Updates')
                        : (isTamil ? 'முன்பதிவுகள்' : 'Bookings')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {unreadCount > 0 && (
                <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
                  <Text style={styles.markAllText}>
                    {isTamil ? 'அனைத்தையும் படித்ததாகக் குறி' : 'Mark all as read'}
                  </Text>
                </TouchableOpacity>
              )}

              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {filtered.length === 0 ? (
                  <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>
                      {isTamil ? 'அறிவிப்புகள் எதுவும் இல்லை' : 'No notifications in this group'}
                    </Text>
                    <Text style={styles.emptySub}>
                      {isTamil ? 'விருப்பப் பொருத்தங்களும் புதுப்பிப்புகளும் இங்கு தோன்றும்.' : 'Preference matches and updates will appear here.'}
                    </Text>
                  </View>
                ) : (
                  filtered.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.itemCard, !item.read && styles.itemCardUnread]}
                      onPress={() => {
                        markAsRead(item.id);
                        if (item.destinationId && onSelectDestination) {
                          onSelectDestination(item.destinationId);
                          onClose();
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <DataBadge status="DEMO" />
                      </View>
                      <Text style={styles.itemBody}>{item.body}</Text>
                      {item.destinationId && (
                        <View style={styles.actionRow}>
                          <Text style={styles.viewPlaceLink}>
                            {isTamil ? 'இட விவரங்களைப் பார் →' : 'View Place Details →'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(58, 15, 24, 0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, maxHeight: '82%', minHeight: '60%', padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceSubtle, justifyContent: 'center', alignItems: 'center' },
  iconBtnText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  groupTabs: { flexDirection: 'row', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, padding: 3, marginBottom: spacing.sm },
  groupTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.pill },
  groupTabActive: { backgroundColor: colors.primary },
  groupTabText: { fontSize: 11, fontWeight: '700', color: colors.ink },
  groupTabTextActive: { color: colors.onPrimary },
  markAllBtn: { alignSelf: 'flex-end', marginBottom: spacing.xs },
  markAllText: { fontSize: 11, fontWeight: '700', color: colors.goldText },
  list: { flex: 1 },
  itemCard: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  itemCardUnread: { backgroundColor: colors.surfaceSubtle, borderColor: colors.gold },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: colors.ink, flex: 1, marginRight: 8 },
  itemBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  actionRow: { marginTop: 6 },
  viewPlaceLink: { fontSize: 11, fontWeight: '700', color: colors.primary },
  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  emptySub: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  settingsBox: { padding: spacing.md, backgroundColor: colors.surfaceSubtle, borderRadius: radii.md },
  settingsTitle: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: spacing.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  settingLabel: { fontSize: 13, fontWeight: '600', color: colors.ink },
});
