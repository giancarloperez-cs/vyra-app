import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientButton } from '../../components';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#0a0f1c', '#0d1526', '#162032']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.logoGradient}
              >
                <FontAwesome5 name="bolt" size={40} color={Colors.background} />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>VryaFit AI</Text>
            <Text style={styles.tagline}>Your Personal AI Coach</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <FeatureItem
              icon="brain"
              title="AI-Powered Coaching"
              description="Personalized workouts generated just for you"
            />
            <FeatureItem
              icon="chart-line"
              title="Track Progress"
              description="Visualize your training and muscle development"
            />
            <FeatureItem
              icon="running"
              title="Multi-Sport Training"
              description="From running to boxing, we've got you covered"
            />
          </View>

          {/* Auth Buttons */}
          <View style={styles.authSection}>
            <GradientButton
              title="Continue with Apple"
              icon="apple"
              onPress={() => router.push('/onboarding/signup')}
              style={styles.authButton}
              gradient={['#ffffff', '#e0e0e0']}
              textStyle={{ color: '#000' }}
            />
            <GradientButton
              title="Continue with Google"
              icon="google"
              onPress={() => router.push('/onboarding/signup')}
              style={styles.authButton}
              variant="secondary"
            />
            <GradientButton
              title="Sign up with Email"
              icon="envelope"
              onPress={() => router.push('/onboarding/signup')}
              style={styles.authButton}
              variant="outline"
            />
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <FontAwesome5 name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  featuresSection: {
    gap: 20,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  authSection: {
    gap: 12,
  },
  authButton: {
    width: '100%',
  },
  terms: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
