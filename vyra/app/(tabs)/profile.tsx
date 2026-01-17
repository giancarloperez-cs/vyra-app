import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// --- MOCK DATA ---
const USER = {
  name: "Alex Runner",
  focus: "Running",
  level: "Intermediate",
  streak: 7,
  stats: {
    workouts: 3,
    minutes: 145,
    distance: "12.5 km"
  },
  goal: "Train for 5K"
};

export default function ProfileScreen() {
  
  const handleCoachPress = () => {
    router.push('/chat'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* HEADER SECTION */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={80} color="#00e0ff" />
          </View>
          <Text style={styles.userName}>{USER.name}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{USER.focus} • {USER.level}</Text>
          </View>
        </View>

        {/* STREAK SECTION */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <FontAwesome name="fire" size={32} color="#FF4500" style={styles.fireIcon} />
            <Text style={styles.streakNumber}>{USER.streak}</Text>
          </View>
          <Text style={styles.streakLabel}>Day Streak</Text>
          <Text style={styles.streakSubtext}>Stay active today to keep your streak alive!</Text>
        </View>

        {/* VYRA COACH CARD */}
        <TouchableOpacity style={styles.coachCard} onPress={handleCoachPress} activeOpacity={0.9}>
          <View style={styles.coachHeaderRow}>
            <Text style={styles.coachTitle}>VyraCoach</Text>
            <FontAwesome name="bolt" size={20} color="#000" />
          </View>
          <Text style={styles.coachSubtitle}>Your AI training partner</Text>
          <Text style={styles.coachDesc}>
            Get personalized workouts, recovery tips, and guidance based on your activity.
          </Text>
          
          <View style={styles.coachButton}>
            <Text style={styles.coachButtonText}>Chat with VyraCoach</Text>
          </View>
        </TouchableOpacity>

        {/* PROGRESS OVERVIEW */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.minutes}</Text>
            <Text style={styles.statLabel}>Active Mins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.distance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>

        {/* GOAL SECTION */}
        <Text style={styles.sectionTitle}>Current Goal</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalContent}>
            <FontAwesome name="bullseye" size={24} color="#00e0ff" style={{ marginRight: 15 }} />
            <View>
              <Text style={styles.goalText}>{USER.goal}</Text>
              <Text style={styles.goalSubtext}>On track</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0f1c' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerContainer: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  avatarContainer: { marginBottom: 10, shadowColor: '#00e0ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  badgeContainer: { backgroundColor: '#162032', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#2d3b55' },
  badgeText: { color: '#8f9bb3', fontSize: 12, fontWeight: '600' },
  streakCard: { backgroundColor: '#162032', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#2d3b55' },
  streakHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  fireIcon: { marginRight: 10 },
  streakNumber: { fontSize: 36, fontWeight: 'bold', color: '#ffffff' },
  streakLabel: { fontSize: 14, color: '#8f9bb3', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold', marginBottom: 5 },
  streakSubtext: { color: '#6e7c99', fontSize: 12 },
  coachCard: { backgroundColor: '#00e0ff', borderRadius: 16, padding: 20, marginBottom: 30, shadowColor: '#00e0ff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  coachHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  coachTitle: { fontSize: 22, fontWeight: 'bold', color: '#0a0f1c' },
  coachSubtitle: { fontSize: 14, fontWeight: '600', color: '#0a0f1c', opacity: 0.8, marginBottom: 10 },
  coachDesc: { fontSize: 14, color: '#0a0f1c', lineHeight: 20, marginBottom: 15 },
  coachButton: { backgroundColor: '#0a0f1c', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  coachButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 15, marginLeft: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: '#162032', borderRadius: 12, padding: 15, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#2d3b55' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#8f9bb3' },
  goalCard: { backgroundColor: '#162032', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2d3b55', marginBottom: 30 },
  goalContent: { flexDirection: 'row', alignItems: 'center' },
  goalText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  goalSubtext: { color: '#00e0ff', fontSize: 12, marginTop: 2 },
});