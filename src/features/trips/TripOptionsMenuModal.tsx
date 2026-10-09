import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, spacing, radii, shadows } from '../../config/theme';
import { SavedTrip } from '../../engine/types';
import { useTranslation } from '../../i18n';

interface TripOptionsMenuModalProps {
  activeMenuTripId: string | null;
  allTrips: SavedTrip[];
  onCloseMenu: () => void;
  onRename: (tripId: string, newTitle: string) => void;
  onDuplicate: (tripId: string) => void;
  onDelete: (tripId: string) => void;
}

export const TripOptionsMenuModal: React.FC<TripOptionsMenuModalProps> = ({
  activeMenuTripId,
  allTrips,
  onCloseMenu,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [renamingTripId, setRenamingTripId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleConfirmDelete = (tripId: string) => {
    Alert.alert(t('deleteConfirmTitle'), t('deleteConfirmBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('deleteTrip'), style: 'destructive', onPress: () => { onDelete(tripId); onCloseMenu(); } },
    ]);
  };

  return (
    <>
      <Modal visible={activeMenuTripId !== null} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} onPress={onCloseMenu} activeOpacity={1}>
          <View style={styles.menuBox}>
            <Text style={styles.menuHeader}>{t('tripOptions')}</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              const target = allTrips.find((x) => x.id === activeMenuTripId);
              if (target) { setRenamingTripId(target.id); setNewTitle(target.title); }
              onCloseMenu();
            }}>
              <Text style={styles.menuItemText}>{t('renameTrip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              if (activeMenuTripId) onDuplicate(activeMenuTripId);
              onCloseMenu();
            }}>
              <Text style={styles.menuItemText}>{t('duplicateTrip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => {
              if (activeMenuTripId) handleConfirmDelete(activeMenuTripId);
            }}>
              <Text style={[styles.menuItemText, { color: colors.danger }]}>{t('deleteTrip')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rename Modal */}
      <Modal visible={renamingTripId !== null} transparent animationType="fade">
        <View style={styles.menuOverlay}>
          <View style={styles.renameBox}>
            <Text style={styles.menuHeader}>{t('renameTrip')}</Text>
            <TextInput style={styles.modalInput} value={newTitle} onChangeText={setNewTitle} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRenamingTripId(null)}>
                <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={() => {
                if (renamingTripId && newTitle) {
                  onRename(renamingTripId, newTitle);
                  setRenamingTripId(null);
                }
              }}>
                <Text style={styles.saveBtnText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  menuBox: { width: 240, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, ...shadows.elevated },
  renameBox: { width: '85%', backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, ...shadows.elevated },
  menuHeader: { fontSize: 13, fontWeight: '800', color: colors.goldText, letterSpacing: 0.5, marginBottom: 8 },
  menuItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  menuItemText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  modalInput: { borderWidth: 1, borderColor: colors.border, padding: spacing.sm, borderRadius: radii.sm, marginVertical: spacing.md, fontSize: 14, color: colors.ink },
  cancelBtn: { padding: spacing.sm },
  cancelBtnText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  saveBtn: { padding: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.primary, borderRadius: radii.sm },
  saveBtnText: { fontSize: 12, fontWeight: '700', color: colors.onPrimary },
});
