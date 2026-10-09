import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { TN_DISTRICTS } from './districtData';
import { useTranslation } from '../../i18n';

interface DistrictSelectModalProps {
  visible: boolean;
  selectedDistrict: string;
  onSelect: (district: string) => void;
  onClose: () => void;
}

export const DistrictSelectModal: React.FC<DistrictSelectModalProps> = ({
  visible,
  selectedDistrict,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const filtered = TN_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('selectStartDistrict')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder={t('searchDistrictPlaceholder')}
            placeholderTextColor={colors.goldText}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selectedDistrict === item;
              return (
                <TouchableOpacity
                  style={[styles.itemRow, isSelected && styles.itemRowActive]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.itemText, isSelected && styles.itemTextActive]}>
                    {item}
                  </Text>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(58, 15, 24, 0.45)', justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  modalCard: { width: '100%', maxWidth: 380, maxHeight: '80%', backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontFamily: typography.fontFamilyHeading, fontSize: 18, fontWeight: '700', color: colors.ink },
  closeBtn: { padding: 6 },
  closeBtnText: { fontSize: 16, color: colors.textSecondary, fontWeight: '700' },
  searchInput: { minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: spacing.sm, fontSize: 14, color: colors.ink, backgroundColor: colors.background, marginBottom: spacing.sm },
  list: { marginTop: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  itemRowActive: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.sm },
  itemText: { fontSize: 14, color: colors.ink, fontWeight: '500' },
  itemTextActive: { color: colors.primary, fontWeight: '700' },
  checkmark: { color: colors.primary, fontWeight: '800', fontSize: 14 },
});
