import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { useTranslation } from '../../i18n';

interface ProfilePrivacySectionProps {
  personalisation: boolean;
  onTogglePersonalisation: () => void;
  onExportData: () => string;
}

export const ProfilePrivacySection: React.FC<ProfilePrivacySectionProps> = ({
  personalisation,
  onTogglePersonalisation,
  onExportData,
}) => {
  const { t } = useTranslation();
  const [exportedJson, setExportedJson] = useState<string | null>(null);

  const handleExport = () => {
    const data = onExportData();
    setExportedJson(data);
  };

  return (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t('privacyAiPersonalisation')}</Text>
        <View style={styles.switchRow}>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchLabel}>{t('aiPersonalisation')}</Text>
            <Text style={styles.switchSub}>{t('aiPersonalisationSub')}</Text>
          </View>
          <Switch
            value={personalisation}
            onValueChange={onTogglePersonalisation}
            trackColor={{ false: colors.line, true: colors.primary }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchLabel}>{t('useTravelHistory')}</Text>
            <Text style={styles.switchSub}>{t('useTravelHistorySub')}</Text>
          </View>
          <Switch value={true} trackColor={{ false: colors.line, true: colors.primary }} />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchLabel}>{t('locationPermission')}</Text>
            <Text style={styles.switchSub}>{t('locationPermissionSub')}</Text>
          </View>
          <View style={styles.permissionBadge}>
            <Text style={styles.permissionText}>{t('activeOnlyBadge')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t('dataRightsTitle')}</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleExport}>
          <Text style={styles.actionBtnText}>{t('exportDataJson')}</Text>
        </TouchableOpacity>

        {exportedJson && (
          <View style={styles.exportBox}>
            <Text style={styles.exportText} numberOfLines={6}>{exportedJson}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.danger, marginTop: spacing.md }]}
          onPress={() => Alert.alert(t('deleteAccount'), t('demoAccountCleared'))}
        >
          <Text style={[styles.actionBtnText, { color: colors.danger }]}>{t('deleteAccount')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  switchTextCol: { flex: 1, paddingRight: spacing.sm },
  switchLabel: { fontSize: 14, fontWeight: '700', color: colors.ink },
  switchSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  permissionBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.gold },
  permissionText: { fontSize: 10, fontWeight: '800', color: colors.goldText },
  actionBtn: { paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.gold, borderRadius: radii.md, marginTop: 8 },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  exportBox: { marginTop: 8, padding: 8, backgroundColor: colors.surfaceSubtle, borderRadius: radii.sm },
  exportText: { fontSize: 10, fontFamily: 'monospace', color: colors.ink },
});
