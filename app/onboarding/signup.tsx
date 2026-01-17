import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientButton } from '../../components';
import { Gender } from '../../services/athlete';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');

  const canContinue = firstName.trim().length > 0;

  const handleContinue = () => {
    router.push({
      pathname: '/onboarding/sports',
      params: {
        firstName,
        lastName,
        gender,
        weight,
        height,
      },
    });
  };

  return (
    <LinearGradient
      colors={['#0a0f1c', '#0d1526', '#162032']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <FontAwesome5 name="arrow-left" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '33%' }]} />
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                This helps Vrya Coach create personalized workouts
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Fields */}
              <View style={styles.row}>
                <View style={styles.inputHalf}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="John"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
              </View>

              {/* Gender Selection */}
              <View style={styles.inputFull}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderOption,
                        gender === g && styles.genderSelected,
                      ]}
                      onPress={() => setGender(g)}
                    >
                      <FontAwesome5
                        name={g === 'male' ? 'mars' : g === 'female' ? 'venus' : 'genderless'}
                        size={20}
                        color={gender === g ? Colors.primary : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          gender === g && styles.genderTextSelected,
                        ]}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Weight & Height */}
              <View style={styles.row}>
                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <View style={styles.measureInput}>
                    <TextInput
                      style={styles.measureValue}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="70"
                      placeholderTextColor={Colors.textPlaceholder}
                    />
                    <Text style={styles.measureUnit}>kg</Text>
                  </View>
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <View style={styles.measureInput}>
                    <TextInput
                      style={styles.measureValue}
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="numeric"
                      placeholder="175"
                      placeholderTextColor={Colors.textPlaceholder}
                    />
                    <Text style={styles.measureUnit}>cm</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.footer}>
            <GradientButton
              title="Continue"
              onPress={handleContinue}
              disabled={!canContinue}
              size="large"
            />
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 32,
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
    marginBottom: 32,
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
  form: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputFull: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  genderSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  genderTextSelected: {
    color: Colors.primary,
  },
  measureInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingRight: 16,
  },
  measureValue: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  measureUnit: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
});
