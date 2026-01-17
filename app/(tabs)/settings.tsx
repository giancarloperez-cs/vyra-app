import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { resetOnboarding } from '../../services/athlete';
import { GlowCard } from '../../components';

interface SettingItemProps {
  icon: string;
  label: string;
  description?: string;
  type?: 'link' | 'switch';
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  danger?: boolean;
}

function SettingItem({
  icon,
  label,
  description,
  type = 'link',
  value,
  onToggle,
  onPress,
  danger = false,
}: SettingItemProps) {
  const iconColor = danger ? Colors.danger : Colors.primary;

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={type === 'switch' ? 1 : 0.7}
      onPress={type === 'link' ? onPress : undefined}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <FontAwesome5 name={icon} size={16} color={iconColor} />
        </View>
        <View style={styles.rowTextContainer}>
          <Text style={[styles.rowLabel, danger && { color: Colors.danger }]}>
            {label}
          </Text>
          {description && (
            <Text style={styles.rowDescription}>{description}</Text>
          )}
        </View>
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.switchTrackOff, true: Colors.primary }}
          thumbColor={Colors.switchThumb}
        />
      ) : (
        <FontAwesome5 name="chevron-right" size={12} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await resetOnboarding();
          router.replace('/onboarding/welcome');
        },
      },
    ]);
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset App',
      'This will reset all your data and show the onboarding again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetOnboarding();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Customize your experience</Text>
          </View>

          {/* Account Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <GlowCard noPadding>
              <SettingItem
                icon="user-edit"
                label="Edit Profile"
                description="Update your personal information"
                onPress={() => router.push('/(tabs)/profile')}
              />
              <SettingItem
                icon="lock"
                label="Change Password"
                description="Update your security credentials"
              />
              <SettingItem
                icon="envelope"
                label="Email Preferences"
                description="Manage email notifications"
              />
            </GlowCard>
          </View>

          {/* Notifications Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
            <GlowCard noPadding>
              <SettingItem
                icon="bell"
                label="Push Notifications"
                description="Receive alerts and updates"
                type="switch"
                value={notifications}
                onToggle={() => setNotifications(!notifications)}
              />
              <SettingItem
                icon="clock"
                label="Workout Reminders"
                description="Daily training notifications"
                type="switch"
                value={workoutReminders}
                onToggle={() => setWorkoutReminders(!workoutReminders)}
              />
            </GlowCard>
          </View>

          {/* Appearance Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>APPEARANCE</Text>
            <GlowCard noPadding>
              <SettingItem
                icon="moon"
                label="Dark Mode"
                description="Use dark theme (always on)"
                type="switch"
                value={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
              />
            </GlowCard>
          </View>

          {/* Support Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>SUPPORT</Text>
            <GlowCard noPadding>
              <SettingItem
                icon="question-circle"
                label="Help Center"
                description="FAQs and support articles"
              />
              <SettingItem
                icon="comment-alt"
                label="Send Feedback"
                description="Share your thoughts with us"
              />
              <SettingItem
                icon="file-alt"
                label="Terms of Service"
              />
              <SettingItem
                icon="shield-alt"
                label="Privacy Policy"
              />
            </GlowCard>
          </View>

          {/* Developer Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>DEVELOPER</Text>
            <GlowCard noPadding>
              <SettingItem
                icon="redo"
                label="Reset Onboarding"
                description="Start fresh with a new profile"
                onPress={handleResetOnboarding}
                danger
              />
            </GlowCard>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={16} color={Colors.danger} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.versionBadge}
            >
              <FontAwesome5 name="bolt" size={12} color={Colors.background} />
            </LinearGradient>
            <Text style={styles.versionText}>VryaFit AI</Text>
            <Text style={styles.versionNumber}>Beta v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rowDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    backgroundColor: Colors.dangerBackground,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: '700',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  versionBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  versionNumber: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
