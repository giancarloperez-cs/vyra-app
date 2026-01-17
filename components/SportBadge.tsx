import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors, getSportColor } from '../constants/Colors';

interface SportBadgeProps {
  sport: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
  selected?: boolean;
}

const sportIcons: Record<string, string> = {
  running: 'running',
  biking: 'biking',
  cycling: 'biking',
  swimming: 'swimmer',
  boxing: 'fist-raised',
  tennis: 'table-tennis',
  gym: 'dumbbell',
  yoga: 'spa',
  crossfit: 'fire',
  soccer: 'futbol',
  basketball: 'basketball-ball',
  general: 'heartbeat',
};

export const SportBadge: React.FC<SportBadgeProps> = ({
  sport,
  size = 'medium',
  showLabel = true,
  style,
  selected = false,
}) => {
  const color = getSportColor(sport);
  const normalizedSport = sport.toLowerCase().replace(/\s+/g, '');
  const iconName = sportIcons[normalizedSport] || sportIcons.general;

  const sizes = {
    small: { container: 28, icon: 12, text: 10 },
    medium: { container: 40, icon: 18, text: 12 },
    large: { container: 56, icon: 24, text: 14 },
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.badge,
          {
            width: currentSize.container,
            height: currentSize.container,
            backgroundColor: `${color}20`,
            borderColor: selected ? color : 'transparent',
            shadowColor: selected ? color : 'transparent',
          },
          selected && styles.selectedBadge,
        ]}
      >
        <FontAwesome5
          name={iconName}
          size={currentSize.icon}
          color={color}
        />
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { fontSize: currentSize.text, color: selected ? color : Colors.textSecondary },
          ]}
        >
          {sport.charAt(0).toUpperCase() + sport.slice(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  badge: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  selectedBadge: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    marginTop: 4,
    fontWeight: '500',
  },
});
