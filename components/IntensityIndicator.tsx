import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, getIntensityColor } from '../constants/Colors';

interface IntensityIndicatorProps {
  level: 'low' | 'moderate' | 'high' | 'recovery';
  showLabel?: boolean;
  style?: ViewStyle;
}

const intensityLabels: Record<string, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  recovery: 'Recovery',
};

export const IntensityIndicator: React.FC<IntensityIndicatorProps> = ({
  level,
  showLabel = true,
  style,
}) => {
  const color = getIntensityColor(level);
  const bars = level === 'low' ? 1 : level === 'moderate' ? 2 : level === 'high' ? 3 : 1;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.bars}>
        {[1, 2, 3].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              {
                backgroundColor: bar <= bars ? color : Colors.border,
                height: 4 + bar * 4,
              },
            ]}
          />
        ))}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color }]}>
          {intensityLabels[level]}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
