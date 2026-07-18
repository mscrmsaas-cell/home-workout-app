import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors, Typography, Spacing, Radius } from '../utils/constants';

export function ProfileScreen() {
  const { isDark, settings, updateSettings, appState } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;
  const [name, setName] = useState(settings.name);
  const [editingName, setEditingName] = useState(false);

  const handleNameSave = () => {
    updateSettings({ name });
    setEditingName(false);
  };

  const handleClearData = () => {
    Alert.alert(
      '清除所有数据',
      '这将删除所有锻炼记录和设置，此操作不可撤销。确定要继续吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            // 重置所有数据
            updateSettings({
              name: '健身达人',
              dailyReminder: true,
              reminderTime: '08:00',
              restDuration: 30,
              soundEnabled: true,
              voiceEnabled: false,
              darkMode: 'system',
              reduceMotion: false,
              weeklyGoal: 4,
            });
            setName('健身达人');
          },
        },
      ]
    );
  };

  const renderSwitchItem = (
    label: string,
    value: boolean,
    onToggle: () => void,
    description?: string
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: themeColors.separator }]}>
      <View style={styles.settingLeft}>
        <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>{label}</Text>
        {description && (
          <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E5EA', true: Colors.success }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E5EA"
      />
    </View>
  );

  const renderSelectItem = (
    label: string,
    value: string,
    options: { label: string; value: string }[],
    onSelect: (v: string) => void
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: themeColors.separator }]}>
      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>{label}</Text>
      <View style={styles.selectGroup}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.selectChip,
              {
                backgroundColor:
                  value === opt.value ? Colors.primary : themeColors.inputBg,
              },
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text
              style={[
                styles.selectText,
                {
                  color: value === opt.value ? '#FFFFFF' : themeColors.textPrimary,
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>个人设置</Text>

        {/* 用户头像区域 */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.card }]}>
          <View style={[styles.avatar, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={styles.avatarEmoji}>🏋️</Text>
          </View>
          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    color: themeColors.textPrimary,
                    borderColor: Colors.primary,
                    backgroundColor: themeColors.inputBg,
                  },
                ]}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={12}
              />
              <TouchableOpacity onPress={handleNameSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>✓</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={[styles.nameText, { color: themeColors.textPrimary }]}>{settings.name}</Text>
              <Text style={[styles.nameHint, { color: themeColors.textSecondary }]}>点击修改名称</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 统计摘要 */}
        <View style={styles.statsRow}>
          <View style={[styles.miniStat, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.miniStatValue, { color: Colors.primary }]}>
              {appState.currentStreak}
            </Text>
            <Text style={[styles.miniStatLabel, { color: themeColors.textSecondary }]}>连续天</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.miniStatValue, { color: Colors.success }]}>
              {appState.records.length}
            </Text>
            <Text style={[styles.miniStatLabel, { color: themeColors.textSecondary }]}>总次数</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.miniStatValue, { color: Colors.warning }]}>
              {settings.weeklyGoal}
            </Text>
            <Text style={[styles.miniStatLabel, { color: themeColors.textSecondary }]}>周目标</Text>
          </View>
        </View>

        {/* 外观设置 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>外观</Text>
        <View style={[styles.group, { backgroundColor: themeColors.card }]}>
          {renderSelectItem(
            '深色模式',
            settings.darkMode,
            [
              { label: '跟随系统', value: 'system' },
              { label: '浅色', value: 'light' },
              { label: '深色', value: 'dark' },
            ],
            v => updateSettings({ darkMode: v as any })
          )}
          {renderSwitchItem(
            '减少动态效果',
            settings.reduceMotion,
            () => updateSettings({ reduceMotion: !settings.reduceMotion }),
            '禁用大部分动画效果，适合敏感用户'
          )}
        </View>

        {/* 训练偏好 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>训练偏好</Text>
        <View style={[styles.group, { backgroundColor: themeColors.card }]}>
          {renderSwitchItem(
            '音效',
            settings.soundEnabled,
            () => updateSettings({ soundEnabled: !settings.soundEnabled })
          )}
          {renderSwitchItem(
            '语音播报',
            settings.voiceEnabled,
            () => updateSettings({ voiceEnabled: !settings.voiceEnabled }),
            '动作切换时语音提示'
          )}
          {renderSelectItem(
            '休息时长',
            settings.restDuration.toString(),
            [
              { label: '15秒', value: '15' },
              { label: '30秒', value: '30' },
              { label: '45秒', value: '45' },
              { label: '60秒', value: '60' },
            ],
            v => updateSettings({ restDuration: parseInt(v) })
          )}
          {renderSelectItem(
            '周目标',
            settings.weeklyGoal.toString(),
            [
              { label: '2次', value: '2' },
              { label: '3次', value: '3' },
              { label: '4次', value: '4' },
              { label: '5次', value: '5' },
              { label: '7次', value: '7' },
            ],
            v => updateSettings({ weeklyGoal: parseInt(v) })
          )}
        </View>

        {/* 通知 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>通知</Text>
        <View style={[styles.group, { backgroundColor: themeColors.card }]}>
          {renderSwitchItem(
            '每日提醒',
            settings.dailyReminder,
            () => updateSettings({ dailyReminder: !settings.dailyReminder })
          )}
        </View>

        {/* 数据管理 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>数据管理</Text>
        <View style={[styles.group, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity
            style={[styles.dangerRow, { borderBottomColor: themeColors.separator }]}
            onPress={handleClearData}
          >
            <Text style={[styles.dangerText, { color: Colors.danger }]}>清除所有数据</Text>
          </TouchableOpacity>
        </View>

        {/* 关于 */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>关于</Text>
        <View style={[styles.group, { backgroundColor: themeColors.card }]}>
          <View style={[styles.infoRow, { borderBottomColor: themeColors.separator }]}>
            <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>版本</Text>
            <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>1.0.0</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: themeColors.separator }]}>
            <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>设计</Text>
            <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>Apple Design + Emil Kowalski</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>设备优化</Text>
            <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>三星 S25 Ultra</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  title: {
    ...Typography.largeTitle,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  nameText: {
    ...Typography.title2,
    textAlign: 'center',
  },
  nameHint: {
    ...Typography.callout,
    textAlign: 'center',
    marginTop: 4,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    minWidth: 160,
    textAlign: 'center',
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  miniStat: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 13,
  },
  sectionTitle: {
    ...Typography.title2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  group: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  settingLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.body,
    fontWeight: '500',
  },
  settingDesc: {
    ...Typography.footnote,
    marginTop: 2,
  },
  selectGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  selectChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  selectText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dangerRow: {
    padding: Spacing.md,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  dangerText: {
    ...Typography.body,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 48,
  },
});