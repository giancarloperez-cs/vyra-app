import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

interface GlowCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  gradient?: readonly [string, string, ...string[]];
  noPadding?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  style,
  glowColor = Colors.glow.primary,
  gradient,
  noPadding = false,
}) => {
  return (
    <View style={[styles.container, { shadowColor: glowColor }, style]}>
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, noPadding && styles.noPadding]}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={[styles.card, styles.solidCard, noPadding && styles.noPadding]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  solidCard: {
    backgroundColor: Colors.cardBackground,
  },
  noPadding: {
    padding: 0,
  },
});
