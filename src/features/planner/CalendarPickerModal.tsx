import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTranslation, MONTH_NAMES, DAY_NAMES } from '../../i18n';

export type DatePickerMode = 'start' | 'end';

interface CalendarPickerModalProps {
  visible: boolean;
  mode: DatePickerMode;
  currentDate: string;
  minDate?: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

function parseYMD(dateStr: string) {
  if (!dateStr) return { year: 2026, month: 9, day: 15 };
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y || 2026, month: m ? m - 1 : 9, day: d || 15 };
}

export const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
  visible,
  mode,
  currentDate,
  minDate,
  onSelectDate,
  onClose,
}) => {
  const { t, lang } = useTranslation();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    if (visible) {
      setSelectedDate(currentDate);
      const target = currentDate || (mode === 'end' && minDate ? minDate : '2026-10-15');
      const { year, month } = parseYMD(target);
      setCurrentYear(year);
      setCurrentMonth(month);
    }
  }, [visible, currentDate, minDate, mode]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day: number) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    setSelectedDate(`${currentYear}-${mStr}-${dStr}`);
  };

  const handleConfirm = () => {
    if (selectedDate) onSelectDate(selectedDate);
    onClose();
  };

  const isEndDate = mode === 'end';
  const modalTitle = isEndDate ? t('calSelectEndDate') : t('calSelectStartDate');
  const selectionLabel = isEndDate ? t('calSelectedEndDate') : t('calSelectedStartDate');
  const monthNames = MONTH_NAMES[lang];
  const dayLabels = DAY_NAMES[lang];

  const renderDaysGrid = () => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <View style={styles.daysGrid}>
        {cells.map((day, idx) => {
          if (day === null) return <View key={`empty-${idx}`} style={styles.dayCell} />;

          const mStr = String(currentMonth + 1).padStart(2, '0');
          const dStr = String(day).padStart(2, '0');
          const dateStr = `${currentYear}-${mStr}-${dStr}`;
          const isSelected = selectedDate === dateStr;
          const isBeforeMin = isEndDate && !!minDate && dateStr < minDate;

          return (
            <TouchableOpacity
              key={`day-${day}`}
              style={[styles.dayCell, isSelected && styles.dayCellSelected, isBeforeMin && styles.dayCellDimmed]}
              onPress={() => handleDateClick(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isBeforeMin && styles.dayTextDimmed]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{modalTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectionCard}>
            <Text style={styles.selectionLabel}>{selectionLabel}</Text>
            <Text style={styles.selectionValue}>📅 {selectedDate || t('selectDate')}</Text>
          </View>

          <View style={styles.monthNavRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekHeadersRow}>
            {dayLabels.map((w) => (
              <Text key={w} style={styles.weekHeader}>{w}</Text>
            ))}
          </View>

          {renderDaysGrid()}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>{t('confirmDate')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(58, 15, 24, 0.45)', justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  modalCard: { width: '100%', maxWidth: 390, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontFamily: typography.fontFamilyHeading, fontSize: 18, fontWeight: '700', color: colors.ink },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 16, color: colors.textSecondary, fontWeight: '700' },
  selectionCard: { backgroundColor: colors.surfaceSubtle, padding: 10, borderRadius: radii.sm, marginBottom: 12, borderWidth: 1, borderColor: colors.line },
  selectionLabel: { fontSize: 10, fontWeight: '700', color: colors.goldText, textTransform: 'uppercase' },
  selectionValue: { fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 2 },
  monthNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  navBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  navBtnText: { fontSize: 24, color: colors.primary, fontWeight: '700' },
  monthTitle: { fontFamily: typography.fontFamilyHeading, fontSize: 16, fontWeight: '700', color: colors.ink },
  weekHeadersRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  weekHeader: { width: 38, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.goldText },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  dayCell: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginVertical: 2, borderRadius: 19 },
  dayCellSelected: { backgroundColor: colors.primary, borderRadius: 19 },
  dayCellDimmed: { opacity: 0.35 },
  dayText: { fontSize: 13, color: colors.ink, fontWeight: '500' },
  dayTextSelected: { color: colors.onPrimary, fontWeight: '800' },
  dayTextDimmed: { color: colors.textSecondary },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  cancelBtnText: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  confirmBtn: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: 16 },
  confirmBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
});
