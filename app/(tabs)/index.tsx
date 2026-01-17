import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, getSportColor } from '../../constants/Colors';
import {
  AthleteProfile,
  loadAthleteProfile,
  getCoachMessage,
  getFullName,
  getTrainedMuscleGroups,
  checkOnboardingComplete,
} from '../../services/athlete';
import {
  generateWeeklyPlan,
  getTodayWorkout,
  WeeklyPlan,
  getWeeklyStats,
} from '../../services/workout';
import {
  GlowCard,
  GradientButton,
  IntensityIndicator,
  AthleteBody,
  WeeklyPlanComponent,
} from '../../components';

export default function HomeScreen() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const isOnboarded = await checkOnboardingComplete();
        if (!isOnboarded) {
          router.replace('/onboarding/welcome');
          return;
        }

        const loaded = await loadAthleteProfile();
        setProfile(loaded);
        setWeeklyPlan(generateWeeklyPlan(loaded));
        setIsLoading(false);
      };
      init();
    }, [])
  );

  if (isLoading || !profile) {
    return (
      <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.loadingContainer}>
            <FontAwesome5 name="bolt" size={40} color={Colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const todayWorkout = getTodayWorkout(weeklyPlan);
  const coachMessage = getCoachMessage(profile.trainingPhase);
  const trainedMuscles = getTrainedMuscleGroups(profile);
  const weeklyStats = getWeeklyStats(weeklyPlan);

  return (
    <LinearGradient colors={Colors.gradients.dark} style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{getFullName(profile)}</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <FontAwesome5 name="user-circle" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Today's Workout Card */}
          {todayWorkout ? (
            <GlowCard
              style={styles.todayCard}
              glowColor={getSportColor(todayWorkout.sport)}
            >
              <View style={styles.todayHeader}>
                <View>
                  <Text style={styles.cardLabel}>TODAY'S WORKOUT</Text>
                  <Text style={styles.todayWorkoutName}>{todayWorkout.name}</Text>
                </View>
                <View
                  style={[
                    styles.sportIconLarge,
                    { backgroundColor: `${getSportColor(todayWorkout.sport)}20` },
                  ]}
                >
                  <FontAwesome5
                    name={getSportIcon(todayWorkout.sport)}
                    size={24}
                    color={getSportColor(todayWorkout.sport)}
                  />
                </View>
              </View>

              <View style={styles.todayMeta}>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="clock" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{todayWorkout.duration} min</Text>
                </View>
                <IntensityIndicator level={todayWorkout.intensity} />
              </View>

              <GradientButton
                title="Start Today's Workout"
                icon="play"
                onPress={() => {}}
                style={styles.startButton}
                size="large"
              />
            </GlowCard>
          ) : (
            <GlowCard style={styles.restDayCard}>
              <View style={styles.restDayContent}>
                <FontAwesome5 name="moon" size={32} color={Colors.primary} />
                <Text style={styles.restDayTitle}>Rest Day</Text>
                <Text style={styles.restDaySubtitle}>
                  Recovery is part of training. Take it easy today.
                </Text>
              </View>
            </GlowCard>
          )}

          {/* Weekly Plan */}
          <WeeklyPlanComponent plan={weeklyPlan} />

          {/* Progress Section with Athlete Body */}
          <View style={styles.progressSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Training Focus</Text>
            </View>

            <View style={styles.progressContent}>
              {/* Athlete Body Visualization */}
              <View style={styles.athleteContainer}>
                <AthleteBody
                  gender={profile.gender}
                  highlightedMuscles={trainedMuscles}
                  size={140}
                />
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{weeklyStats.workoutCount}</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{weeklyStats.totalDuration}</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.sports.length}</Text>
                  <Text style={styles.statLabel}>Sports</Text>
                </View>
              </View>

              {/* Trained Muscles */}
              <View style={styles.musclesList}>
                {trainedMuscles.slice(0, 5).map((muscle) => (
                  <View key={muscle} style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Coach Quote */}
          <GlowCard style={styles.coachQuoteCard}>
            <View style={styles.coachQuoteHeader}>
              <View style={styles.coachAvatar}>
                <FontAwesome5 name="robot" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.coachQuoteLabel}>VRYA COACH</Text>
            </View>
            <Text style={styles.coachQuoteText}>"{coachMessage}"</Text>
          </GlowCard>

          {/* Ask Coach CTA */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.askCoachCard}
            >
              <View style={styles.askCoachContent}>
                <View style={styles.askCoachIcon}>
                  <FontAwesome5 name="bolt" size={20} color={Colors.background} />
                </View>
                <View style={styles.askCoachText}>
                  <Text style={styles.askCoachTitle}>Ask Coach</Text>
                  <Text style={styles.askCoachSubtitle}>
                    Get personalized guidance anytime
                  </Text>
                </View>
                <FontAwesome5
                  name="chevron-right"
                  size={16}
                  color={Colors.background}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getSportIcon(sport: string): string {
  const icons: Record<string, string> = {
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
  return icons[sport] || 'heartbeat';
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Today's Workout Card
  todayCard: {
    marginBottom: 24,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  todayWorkoutName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sportIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  startButton: {
    marginTop: 4,
  },

  // Rest Day Card
  restDayCard: {
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  restDayContent: {
    alignItems: 'center',
    gap: 12,
  },
  restDayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  restDaySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },

  // Progress Section
  progressSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  athleteContainer: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  muscleTag: {
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  muscleTagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Coach Quote Card
  coachQuoteCard: {
    marginBottom: 20,
  },
  coachQuoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  coachAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachQuoteLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
  },
  coachQuoteText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Ask Coach Card
  askCoachCard: {
    borderRadius: 16,
    padding: 18,
  },
  askCoachContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  askCoachIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  askCoachText: {
    flex: 1,
  },
  askCoachTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  askCoachSubtitle: {
    fontSize: 13,
    color: Colors.background,
    opacity: 0.8,
  },
});
