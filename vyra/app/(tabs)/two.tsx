import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert, Text, View } from 'react-native'; // <--- FIXED IMPORTS
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => console.log("Logged out") }
    ]);
  };

  const SettingItem = ({ icon, label, type = 'link', value, onToggle }: any) => (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} disabled={type === 'switch'}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome name={icon} size={18} color="#00e0ff" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: "#767577", true: "#00e0ff" }}
          thumbColor={value ? "#ffffff" : "#f4f3f4"}
        />
      ) : (
        <FontAwesome name="chevron-right" size={14} color="#555" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.headerTitle}>Settings</Text>

        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.section}>
          <SettingItem icon="user" label="Edit Profile" />
          <SettingItem icon="lock" label="Change Password" />
        </View>

        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.section}>
          <SettingItem icon="bell" label="Push Notifications" type="switch" value={notifications} onToggle={() => setNotifications(!notifications)} />
          <SettingItem icon="moon-o" label="Dark Mode" type="switch" value={isDark} onToggle={() => setIsDark(!isDark)} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0f1c' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
  sectionHeader: { color: '#8f9bb3', fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 20, marginLeft: 10 },
  section: { backgroundColor: '#162032', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#2d3b55' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#2d3b55' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 30, alignItems: 'center', marginRight: 10 },
  rowLabel: { fontSize: 16, color: '#fff', fontWeight: '500' },
  logoutButton: { marginTop: 40, backgroundColor: 'rgba(255, 69, 58, 0.15)', paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 69, 58, 0.5)' },
  logoutText: { color: '#FF453A', fontWeight: 'bold', fontSize: 16 },
});