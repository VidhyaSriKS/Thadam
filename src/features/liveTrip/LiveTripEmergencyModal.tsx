import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTranslation } from '../../i18n';

interface LiveTripEmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LiveTripEmergencyModal: React.FC<LiveTripEmergencyModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <View style={styles.emergencyOverlay}>
      <View style={styles.emergencySheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.emergencySheetTitle}>{t('emergencyContactsTitle')}</Text>
        <Text style={styles.emergencySheetSub}>{t('emergencyContactsSub')}</Text>

        <View style={styles.emergencyContactList}>
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{t('nationalEmergency')}</Text>
            <Text style={styles.contactNumber}>112</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{t('touristPolice')}</Text>
            <Text style={styles.contactNumber}>044-2538-4444</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{t('ambulanceHelpline')}</Text>
            <Text style={styles.contactNumber}>108</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeEmergencyBtn} onPress={onClose}>
          <Text style={styles.closeEmergencyText}>{t('dismiss')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emergencyOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(24, 36, 63, 0.45)',
    justifyContent: 'flex-end',
  },
  emergencySheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    padding: spacing.xl,
    ...shadows.elevated,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  emergencySheetTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emergencySheetSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  emergencyContactList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  contactName: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
  },
  contactNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: '800',
    color: colors.coral,
  },
  closeEmergencyBtn: {
    height: 44,
    borderRadius: radii.button,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeEmergencyText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
