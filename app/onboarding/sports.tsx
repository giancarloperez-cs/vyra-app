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
import { Sport, getAvailableSports, getSportDisplayName } from '../../services/athlete';

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

export default function SportsScreen() {
  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    gender: string;
    weight: string;
    height: string;
  }>();

  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const availableSports = getAvailableSports();

  const toggleSport = (sport: Sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  const canContinue = selectedSports.length > 0;

  const handleContinue = () => {
    router.push({
      pathname: '/onboarding/skill-levels',
      params: {
        ...params,
        sports: selectedSports.join(','),
      },
    });
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
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>What sports do you train?</Text>
          <Text style={styles.subtitle}>
            Select all that apply. We'll personalize your coaching.
          </Text>
        </View>

        {/* Sports Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.sportsGrid}
          showsVerticalScrollIndicator={false}
        >
          {availableSports.map((sport) => {
            const isSelected = selectedSports.includes(sport);
            const color = getSportColor(sport);

            return (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.sportCard,
                  isSelected && {
                    borderColor: color,
                    backgroundColor: `${color}15`,
                  },
                ]}
                onPress={() => toggleSport(sport)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sportIcon,
                    { backgroundColor: `${color}20` },
                    isSelected && {
                      backgroundColor: `${color}30`,
                      shadowColor: color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                    },
                  ]}
                >
                  <FontAwesome5
                    name={sportIcons[sport]}
                    size={28}
                    color={color}
                  />
                </View>
                <Text
                  style={[
                    styles.sportName,
                    isSelected && { color },
                  ]}
                >
                  {getSportDisplayName(sport)}
                </Text>
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: color }]}>
                    <FontAwesome5 name="check" size={10} color={Colors.background} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
          </Text>
          <GradientButton
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            size="large"
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
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 24,
  },
  sportCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  sportIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sportName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
