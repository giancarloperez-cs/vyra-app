import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors, getSportColor } from '../../constants/Colors';
import {
  AthleteProfile,
  Sport,
  SkillLevel,
  loadAthleteProfile,
  saveAthleteProfile,
  getAvailableSports,
  getSportDisplayName,
  getFullName,
} from '../../services/athlete';
import { GlowCard, GradientButton } from '../../components';

const TRAINING_PHASES: AthleteProfile['trainingPhase'][] = ['Base', 'Build', 'Peak', 'Recovery'];

const PHASE_INFO: Record<AthleteProfile['trainingPhase'], { icon: string; description: string }> = {
  Base: { icon: 'layer-group', description: 'Building foundation & endurance' },
  Build: { icon: 'chart-line', description: 'Increasing intensity & volume' },
  Peak: { icon: 'mountain', description: 'Competition ready performance' },
  Recovery: { icon: 'bed', description: 'Rest, adapt & regenerate' },
};

const sportIcons: Record<Sport, string> = {
  running: 'running',
  biking: 'biking',
  swimming: 'swimmer',
  boxing: 'fist-raised',
  tennis: 'table-tennis',
  gym: 'dumbbell',
  yoga: 'spa',
  crossfit: 'fire',
  soccer: 'futbol',
  basketball: 'basketball-ball',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const loaded = await loadAthleteProfile();
        setProfile(loaded);
        setIsLoading(false);
      };
      loadProfile();
    }, [])
  );

  const updateProfile = (updates: Partial<AthleteProfile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...updates });
    setHasChanges(true);
  };

  const toggleSport = (sport: Sport) => {
    if (!profile) return;
    const exists = profile.sports.find((s) => s.sport === sport);
    if (exists) {
      updateProfile({
        sports: profile.sports.filter((s) => s.sport !== sport),
      });
    } else {
      updateProfile({
        sports: [...profile.sports, { sport, skillLevel: 'beginner' }],
      });
    }
  };

  const updateSkillLevel = (sport: Sport, skillLevel: SkillLevel) => {
    if (!profile) return;
    updateProfile({
      sports: profile.sports.map((s) =>
        s.sport === sport ? { ...s, skillLevel } : s
      ),
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveAthleteProfile(profile);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.loadingContainer}>
            <FontAwesome5 name="user-circle" size={40} color={Colors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.avatarGradient}
            >
              <FontAwesome5
                name={profile.gender === 'female' ? 'female' : 'male'}
                size={36}
                color={Colors.background}
              />
            </LinearGradient>
            <Text style={styles.userName}>{getFullName(profile)}</Text>
            <Text style={styles.userStats}>
              {profile.sports.length} sports • {profile.weeklyTrainingDays} days/week
            </Text>
          </View>

          {/* Basic Info Card */}
          <GlowCard style={styles.card}>
            <Text style={styles.cardTitle}>Basic Information</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.firstName}
                  onChangeText={(text) => updateProfile({ firstName: text })}
                  placeholder="First name"
                  placeholderTextColor={Colors.textPlaceholder}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.lastName}
                  onChangeText={(text) => updateProfile({ lastName: text })}
                  placeholder="Last name"
                  placeholderTextColor={Colors.textPlaceholder}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.weight.toString()}
                  onChangeText={(text) => updateProfile({ weight: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor={Colors.textPlaceholder}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.height.toString()}
                  onChangeText={(text) => updateProfile({ height: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor={Colors.textPlaceholder}
                />
              </View>
            </View>
          </GlowCard>

          {/* Sports Selection */}
          <GlowCard style={styles.card}>
            <Text style={styles.cardTitle}>Your Sports</Text>
            <Text style={styles.cardSubtitle}>Tap to add/remove sports</Text>

            <View style={styles.sportsGrid}>
              {getAvailableSports().map((sport) => {
                const isSelected = profile.sports.some((s) => s.sport === sport);
                const color = getSportColor(sport);
                const selection = profile.sports.find((s) => s.sport === sport);

                return (
                  <View key={sport} style={styles.sportItem}>
                    <TouchableOpacity
                      style={[
                        styles.sportButton,
                        isSelected && { borderColor: color, backgroundColor: `${color}15` },
                      ]}
                      onPress={() => toggleSport(sport)}
                    >
                      <View style={[styles.sportIcon, { backgroundColor: `${color}20` }]}>
                        <FontAwesome5 name={sportIcons[sport]} size={18} color={color} />
                      </View>
                      <Text style={[styles.sportName, isSelected && { color }]}>
                        {getSportDisplayName(sport)}
                      </Text>
                      {isSelected && (
                        <View style={[styles.checkBadge, { backgroundColor: color }]}>
                          <FontAwesome5 name="check" size={8} color={Colors.background} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Skill Level Selector */}
                    {isSelected && (
                      <View style={styles.skillLevelRow}>
                        {(['beginner', 'moderate', 'advanced'] as SkillLevel[]).map((level) => (
                          <TouchableOpacity
                            key={level}
                            style={[
                              styles.skillButton,
                              selection?.skillLevel === level && {
                                backgroundColor: color,
                                borderColor: color,
                              },
                            ]}
                            onPress={() => updateSkillLevel(sport, level)}
                          >
                            <Text
                              style={[
                                styles.skillText,
                                selection?.skillLevel === level && { color: Colors.background },
                              ]}
                            >
                              {level.charAt(0).toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </GlowCard>

          {/* Training Phase */}
          <GlowCard style={styles.card}>
            <Text style={styles.cardTitle}>Training Phase</Text>
            <Text style={styles.cardSubtitle}>Current phase of your training cycle</Text>

            <View style={styles.phasesGrid}>
              {TRAINING_PHASES.map((phase) => {
                const info = PHASE_INFO[phase];
                const isSelected = profile.trainingPhase === phase;

                return (
                  <TouchableOpacity
                    key={phase}
                    style={[styles.phaseCard, isSelected && styles.phaseCardActive]}
                    onPress={() => updateProfile({ trainingPhase: phase })}
                  >
                    <View
                      style={[
                        styles.phaseIcon,
                        isSelected && { backgroundColor: `${Colors.primary}30` },
                      ]}
                    >
                      <FontAwesome5
                        name={info.icon}
                        size={18}
                        color={isSelected ? Colors.primary : Colors.textMuted}
                      />
                    </View>
                    <Text style={[styles.phaseName, isSelected && styles.phaseNameActive]}>
                      {phase}
                    </Text>
                    <Text style={styles.phaseDescription}>{info.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlowCard>

          {/* Weekly Training Days */}
          <GlowCard style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Training Days</Text>
            <View style={styles.daysRow}>
              {[2, 3, 4, 5, 6, 7].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    profile.weeklyTrainingDays === days && styles.dayButtonActive,
                  ]}
                  onPress={() => updateProfile({ weeklyTrainingDays: days })}
                >
                  <Text
                    style={[
                      styles.dayText,
                      profile.weeklyTrainingDays === days && styles.dayTextActive,
                    ]}
                  >
                    {days}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlowCard>

          {/* Primary Goal */}
          <GlowCard style={styles.card}>
            <Text style={styles.cardTitle}>Primary Goal</Text>
            <TextInput
              style={[styles.textInput, styles.goalInput]}
              value={profile.primaryGoal}
              onChangeText={(text) => updateProfile({ primaryGoal: text })}
              placeholder="e.g., Complete a marathon, Get stronger"
              placeholderTextColor={Colors.textPlaceholder}
              multiline
            />
          </GlowCard>

          {/* Save Button */}
          {hasChanges && (
            <GradientButton
              title={isSaving ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              loading={isSaving}
              disabled={isSaving}
              icon="save"
              size="large"
              style={styles.saveButton}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userStats: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Cards
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },

  // Inputs
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Sports
  sportsGrid: {
    gap: 12,
  },
  sportItem: {
    gap: 8,
  },
  sportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sportName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillLevelRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 52,
  },
  skillButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // Training Phase
  phasesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  phaseCard: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  phaseCardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  phaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  phaseName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  phaseNameActive: {
    color: Colors.primary,
  },
  phaseDescription: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },

  // Weekly Days
  daysRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  dayButton: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dayButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  dayTextActive: {
    color: Colors.background,
  },

  // Save Button
  saveButton: {
    marginTop: 10,
  },
});
