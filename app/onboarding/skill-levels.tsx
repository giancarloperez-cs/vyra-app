import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors, getSportColor } from '../../constants/Colors';
import { GradientButton } from '../../components';
import {
  Sport,
  SkillLevel,
  SportSelection,
  getSportDisplayName,
  Gender,
  AthleteProfile,
  saveAthleteProfile,
  setOnboardingComplete,
} from '../../services/athlete';

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

const skillLevels: { level: SkillLevel; label: string; description: string }[] = [
  { level: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { level: 'moderate', label: 'Moderate', description: 'Some experience' },
  { level: 'advanced', label: 'Advanced', description: 'Highly skilled' },
];

export default function SkillLevelsScreen() {
  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    gender: string;
    weight: string;
    height: string;
    sports: string;
  }>();

  const sports = (params.sports?.split(',') || []) as Sport[];
  const [skillMap, setSkillMap] = useState<Record<Sport, SkillLevel>>(
    sports.reduce((acc, sport) => ({ ...acc, [sport]: 'beginner' }), {} as Record<Sport, SkillLevel>)
  );
  const [loading, setLoading] = useState(false);

  const setSkillLevel = (sport: Sport, level: SkillLevel) => {
    setSkillMap((prev) => ({ ...prev, [sport]: level }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const sportSelections: SportSelection[] = sports.map((sport) => ({
        sport,
        skillLevel: skillMap[sport],
      }));

      const profile: AthleteProfile = {
        firstName: params.firstName || '',
        lastName: params.lastName || '',
        gender: (params.gender || 'male') as Gender,
        weight: parseInt(params.weight || '70', 10),
        height: parseInt(params.height || '175', 10),
        sports: sportSelections,
        primaryGoal: '',
        weeklyTrainingDays: 4,
        trainingPhase: 'Base',
      };

      await saveAthleteProfile(profile);
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0f1c', '#0d1526', '#162032']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Your skill level</Text>
          <Text style={styles.subtitle}>
            This helps us tailor workout intensity
          </Text>
        </View>

        {/* Sports List with Skill Selection */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sports.map((sport) => {
            const color = getSportColor(sport);
            const currentLevel = skillMap[sport];

            return (
              <View key={sport} style={styles.sportSection}>
                {/* Sport Header */}
                <View style={styles.sportHeader}>
                  <View style={[styles.sportIcon, { backgroundColor: `${color}20` }]}>
                    <FontAwesome5 name={sportIcons[sport]} size={20} color={color} />
                  </View>
                  <Text style={styles.sportName}>{getSportDisplayName(sport)}</Text>
                </View>

                {/* Skill Level Options */}
                <View style={styles.skillOptions}>
                  {skillLevels.map(({ level, label, description }) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.skillOption,
                        currentLevel === level && {
                          borderColor: color,
                          backgroundColor: `${color}10`,
                        },
                      ]}
                      onPress={() => setSkillLevel(sport, level)}
                    >
                      <View style={styles.skillContent}>
                        <Text
                          style={[
                            styles.skillLabel,
                            currentLevel === level && { color },
                          ]}
                        >
                          {label}
                        </Text>
                        <Text style={styles.skillDescription}>{description}</Text>
                      </View>
                      {currentLevel === level && (
                        <View style={[styles.skillCheck, { backgroundColor: color }]}>
                          <FontAwesome5 name="check" size={10} color={Colors.background} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <GradientButton
            title="Start Training"
            onPress={handleFinish}
            loading={loading}
            size="large"
            icon="bolt"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  sportSection: {
    gap: 12,
  },
  sportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  skillOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  skillOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillContent: {
    flex: 1,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  skillDescription: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  skillCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
});
