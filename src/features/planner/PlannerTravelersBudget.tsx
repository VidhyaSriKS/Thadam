import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { CalendarPickerModal } from './CalendarPickerModal';
import { useTranslation } from '../../i18n';

interface PlannerTravelersBudgetProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  durationText: string;
  dateError: string;
  adults: number;
  children: number;
  seniors: number;
  onAdultsChange: (val: number) => void;
  onChildrenChange: (val: number) => void;
  onSeniorsChange: (val: number) => void;
  budget: number;
  onBudgetChange: (val: number) => void;
}

export const PlannerTravelersBudget: React.FC<PlannerTravelersBudgetProps> = ({
  startDate, endDate, onStartDateChange, onEndDateChange,
  durationText, dateError, adults, children, seniors,
  onAdultsChange, onChildrenChange, onSeniorsChange, budget, onBudgetChange,
}) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'start' | 'end'>('start');
  const { t, isTamil } = useTranslation();
  const totalTravelers = adults + children + seniors;

  const renderCounter = (label: string, count: number, onChange: (n: number) => void, min = 0) => (
    <View style={styles.counterCol}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => onChange(Math.max(min, count - 1))}
          activeOpacity={0.7}
        >
          <Text style={styles.counterBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.counterVal}>{count}</Text>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => onChange(count + 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* 3. Travel Dates */}
      <Text style={styles.sectionHeading}>{t('secDates')}</Text>
      <View style={styles.splitRow}>
        <View style={styles.flex1}>
          <Text style={styles.fieldLabel}>{t('startDateLabel')}</Text>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => { setCalendarMode('start'); setShowCalendarModal(true); }}
            activeOpacity={0.8}
          >
            <Text style={styles.datePickerText}>📅 {startDate || t('selectDate')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flex1}>
          <Text style={styles.fieldLabel}>{t('endDateLabel')}</Text>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => { setCalendarMode('end'); setShowCalendarModal(true); }}
            activeOpacity={0.8}
          >
            <Text style={styles.datePickerText}>📅 {endDate || t('selectDate')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {dateError ? <Text style={styles.errText}>{dateError}</Text> : null}

      <TouchableOpacity
        style={styles.durationBadge}
        onPress={() => { setCalendarMode('start'); setShowCalendarModal(true); }}
        activeOpacity={0.85}
      >
        <Text style={styles.durationBadgeText}>🗓️ {durationText} ({t('tapToChangeCalendar')})</Text>
      </TouchableOpacity>

      {/* 4. Travelers */}
      <View style={styles.divider} />
      <View style={styles.travelersHeaderRow}>
        <Text style={styles.sectionHeading}>{t('secTravelers')}</Text>
        <Text style={styles.totalBadge}>{t('totalTravelersBadge')} {totalTravelers}</Text>
      </View>

      <View style={styles.countersGrid}>
        {renderCounter(isTamil ? 'பெரியவர்கள்' : 'Adults', adults, onAdultsChange, 1)}
        {renderCounter(isTamil ? 'குழந்தைகள்' : 'Children', children, onChildrenChange, 0)}
        {renderCounter(isTamil ? 'முதியவர்கள்' : 'Seniors', seniors, onSeniorsChange, 0)}
      </View>

      {/* 5. Budget */}
      <View style={styles.divider} />
      <Text style={styles.sectionHeading}>{t('secBudget')}</Text>
      <Text style={styles.fieldLabel}>{t('budgetLabel')}</Text>
      <TextInput
        style={[styles.input, styles.budgetInput]}
        value={String(budget)}
        onChangeText={(txt) => onBudgetChange(Math.max(1000, parseInt(txt, 10) || 1000))}
        keyboardType="numeric"
      />

      <View style={styles.presetsRow}>
        {[10000, 25000, 50000].map((amt) => (
          <TouchableOpacity
            key={amt}
            style={[styles.presetChip, budget === amt && styles.presetChipActive]}
            onPress={() => onBudgetChange(amt)}
          >
            <Text style={[styles.presetChipText, budget === amt && styles.presetChipTextActive]}>
              ₹{amt.toLocaleString('en-IN')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar Picker Modal */}
      <CalendarPickerModal
        visible={showCalendarModal}
        mode={calendarMode}
        currentDate={calendarMode === 'start' ? startDate : endDate}
        minDate={calendarMode === 'end' ? startDate : undefined}
        onSelectDate={(date) => {
          if (calendarMode === 'start') onStartDateChange(date);
          else onEndDateChange(date);
        }}
        onClose={() => setShowCalendarModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  splitRow: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  datePickerBtn: { minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: 12, backgroundColor: colors.background, justifyContent: 'center' },
  datePickerText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  input: { minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, paddingHorizontal: 12, backgroundColor: colors.background, fontSize: 14, color: colors.ink },
  budgetInput: { fontWeight: '700', fontSize: 16, color: colors.primary },
  errText: { color: colors.danger, fontSize: 12, marginTop: 4, fontWeight: '600' },
  durationBadge: { alignSelf: 'flex-start', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8, borderWidth: 1, borderColor: colors.border },
  durationBadgeText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },
  travelersHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalBadge: { fontSize: 12, fontWeight: '700', color: colors.primary },
  countersGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  counterCol: { flex: 1, alignItems: 'center', backgroundColor: colors.background, borderRadius: radii.md, padding: 8 },
  counterLabel: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  counterBtnText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  counterVal: { fontSize: 15, fontWeight: '800', color: colors.ink, minWidth: 16, textAlign: 'center' },
  presetsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  presetChip: { flex: 1, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, alignItems: 'center' },
  presetChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  presetChipText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  presetChipTextActive: { color: colors.onPrimary, fontWeight: '700' },
});
