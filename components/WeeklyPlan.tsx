import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, getSportColor, getIntensityColor } from '../constants/Colors';
import { DayPlan, WeeklyPlan as WeeklyPlanType } from '../services/workout';
import { getSportDisplayName } from '../services/athlete';

interface WeeklyPlanProps {
  plan: WeeklyPlanType;
  onDayPress?: (day: DayPlan) => void;
}

const sportIcons: Record<string, string> = {
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

export const WeeklyPlanComponent: React.FC<WeeklyPlanProps> = ({
  plan,
  onDayPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Plan</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <FontAwesome5 name="chevron-right" size={12} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {plan.map((day, index) => (
          <DayCard
            key={day.day}
            day={day}
            onPress={() => onDayPress?.(day)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface DayCardProps {
  day: DayPlan;
  onPress?: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onPress }) => {
  const sportColor = day.workout ? getSportColor(day.workout.sport) : Colors.border;
  const intensityColor = day.workout ? getIntensityColor(day.workout.intensity) : Colors.border;

  if (day.isRestDay) {
    return (
      <TouchableOpacity
        style={[styles.dayCard, styles.restDayCard, day.isToday && styles.todayCard]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {day.isToday && <View style={styles.todayIndicator} />}
        <Text style={styles.dayName}>{day.day.slice(0, 3)}</Text>
        <Text style={styles.dayDate}>{day.date}</Text>
        <View style={styles.restContent}>
          <FontAwesome5 name="moon" size={20} color={Colors.textMuted} />
          <Text style={styles.restText}>Rest</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.dayCard, day.isToday && styles.todayCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {day.isToday && <View style={styles.todayIndicator} />}
      <Text style={styles.dayName}>{day.day.slice(0, 3)}</Text>
      <Text style={styles.dayDate}>{day.date}</Text>

      {/* Sport Badge */}
      <View style={[styles.sportBadge, { backgroundColor: `${sportColor}20` }]}>
        <FontAwesome5
          name={sportIcons[day.workout!.sport] || 'heartbeat'}
          size={18}
          color={sportColor}
        />
      </View>

      {/* Workout Name */}
      <Text style={styles.workoutName} numberOfLines={2}>
        {day.workout!.name}
      </Text>

      {/* Duration & Intensity */}
      <View style={styles.workoutMeta}>
        <View style={styles.metaItem}>
          <FontAwesome5 name="clock" size={10} color={Colors.textMuted} />
          <Text style={styles.metaText}>{day.workout!.duration}m</Text>
        </View>
        <View style={[styles.intensityDot, { backgroundColor: intensityColor }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  dayCard: {
    width: 110,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
    minHeight: 160,
  },
  restDayCard: {
    justifyContent: 'center',
  },
  todayCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  todayIndicator: {
    position: 'absolute',
    top: -1,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  restContent: {
    alignItems: 'center',
    gap: 8,
  },
  restText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  sportBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
