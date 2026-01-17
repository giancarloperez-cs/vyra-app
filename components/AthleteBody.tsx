import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Svg, Path, Circle, Ellipse, G } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface AthleteBodyProps {
  gender: 'male' | 'female' | 'other';
  highlightedMuscles: string[];
  style?: ViewStyle;
  size?: number;
}

// Muscle group colors when highlighted
const muscleHighlightColor = Colors.primary;
const muscleDefaultColor = Colors.cardBackgroundLight;

export const AthleteBody: React.FC<AthleteBodyProps> = ({
  gender,
  highlightedMuscles,
  style,
  size = 200,
}) => {
  const isHighlighted = (muscle: string) =>
    highlightedMuscles.includes(muscle) || highlightedMuscles.includes('full-body');

  const getColor = (muscle: string) =>
    isHighlighted(muscle) ? muscleHighlightColor : muscleDefaultColor;

  const scale = size / 200;

  return (
    <View style={[styles.container, { width: size, height: size * 1.8 }, style]}>
      <Svg
        width={size}
        height={size * 1.8}
        viewBox="0 0 200 360"
      >
        <G transform={`scale(${1})`}>
          {/* Head */}
          <Ellipse
            cx="100"
            cy="30"
            rx="25"
            ry="28"
            fill={muscleDefaultColor}
            stroke={Colors.border}
            strokeWidth="1"
          />

          {/* Neck */}
          <Path
            d="M90 55 L90 70 L110 70 L110 55"
            fill={muscleDefaultColor}
            stroke={Colors.border}
            strokeWidth="1"
          />

          {/* Shoulders */}
          <Ellipse
            cx="55"
            cy="85"
            rx="18"
            ry="15"
            fill={getColor('shoulders')}
            stroke={isHighlighted('shoulders') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('shoulders') ? 2 : 1}
            opacity={isHighlighted('shoulders') ? 1 : 0.7}
          />
          <Ellipse
            cx="145"
            cy="85"
            rx="18"
            ry="15"
            fill={getColor('shoulders')}
            stroke={isHighlighted('shoulders') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('shoulders') ? 2 : 1}
            opacity={isHighlighted('shoulders') ? 1 : 0.7}
          />

          {/* Chest/Back (torso) */}
          <Path
            d="M70 70 L55 85 L45 100 L45 140 L55 160 L70 170 L100 175 L130 170 L145 160 L155 140 L155 100 L145 85 L130 70 Z"
            fill={getColor('core')}
            stroke={isHighlighted('core') || isHighlighted('back') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('core') || isHighlighted('back') ? 2 : 1}
            opacity={isHighlighted('core') || isHighlighted('back') ? 1 : 0.7}
          />

          {/* Arms - Upper */}
          <Path
            d="M45 100 L30 100 L25 140 L35 145 L45 140"
            fill={getColor('arms')}
            stroke={isHighlighted('arms') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('arms') ? 2 : 1}
            opacity={isHighlighted('arms') ? 1 : 0.7}
          />
          <Path
            d="M155 100 L170 100 L175 140 L165 145 L155 140"
            fill={getColor('arms')}
            stroke={isHighlighted('arms') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('arms') ? 2 : 1}
            opacity={isHighlighted('arms') ? 1 : 0.7}
          />

          {/* Arms - Lower (forearms) */}
          <Path
            d="M25 145 L20 185 L30 190 L40 185 L35 145"
            fill={getColor('arms')}
            stroke={isHighlighted('arms') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('arms') ? 2 : 1}
            opacity={isHighlighted('arms') ? 1 : 0.7}
          />
          <Path
            d="M175 145 L180 185 L170 190 L160 185 L165 145"
            fill={getColor('arms')}
            stroke={isHighlighted('arms') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('arms') ? 2 : 1}
            opacity={isHighlighted('arms') ? 1 : 0.7}
          />

          {/* Hands */}
          <Ellipse cx="25" cy="200" rx="12" ry="15" fill={muscleDefaultColor} stroke={Colors.border} strokeWidth="1" />
          <Ellipse cx="175" cy="200" rx="12" ry="15" fill={muscleDefaultColor} stroke={Colors.border} strokeWidth="1" />

          {/* Core/Abs */}
          <Path
            d="M70 175 L70 195 L100 200 L130 195 L130 175 L100 180 Z"
            fill={getColor('core')}
            stroke={isHighlighted('core') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('core') ? 2 : 1}
            opacity={isHighlighted('core') ? 1 : 0.7}
          />

          {/* Hips */}
          <Path
            d="M65 195 L55 220 L100 230 L145 220 L135 195 L100 200 Z"
            fill={muscleDefaultColor}
            stroke={Colors.border}
            strokeWidth="1"
          />

          {/* Upper Legs (Quads) */}
          <Path
            d="M55 220 L45 280 L55 285 L75 285 L80 225 L65 220 Z"
            fill={getColor('legs')}
            stroke={isHighlighted('legs') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('legs') ? 2 : 1}
            opacity={isHighlighted('legs') ? 1 : 0.7}
          />
          <Path
            d="M145 220 L155 280 L145 285 L125 285 L120 225 L135 220 Z"
            fill={getColor('legs')}
            stroke={isHighlighted('legs') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('legs') ? 2 : 1}
            opacity={isHighlighted('legs') ? 1 : 0.7}
          />

          {/* Lower Legs (Calves) */}
          <Path
            d="M50 290 L45 340 L55 345 L70 340 L75 290 L55 285 Z"
            fill={getColor('legs')}
            stroke={isHighlighted('legs') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('legs') ? 2 : 1}
            opacity={isHighlighted('legs') ? 1 : 0.7}
          />
          <Path
            d="M150 290 L155 340 L145 345 L130 340 L125 290 L145 285 Z"
            fill={getColor('legs')}
            stroke={isHighlighted('legs') ? muscleHighlightColor : Colors.border}
            strokeWidth={isHighlighted('legs') ? 2 : 1}
            opacity={isHighlighted('legs') ? 1 : 0.7}
          />

          {/* Feet */}
          <Ellipse cx="57" cy="355" rx="18" ry="8" fill={muscleDefaultColor} stroke={Colors.border} strokeWidth="1" />
          <Ellipse cx="143" cy="355" rx="18" ry="8" fill={muscleDefaultColor} stroke={Colors.border} strokeWidth="1" />

          {/* Glow effect for cardio (heart area) */}
          {isHighlighted('cardio') && (
            <>
              <Circle
                cx="90"
                cy="110"
                r="15"
                fill={Colors.danger}
                opacity={0.3}
              />
              <Circle
                cx="90"
                cy="110"
                r="10"
                fill={Colors.danger}
                opacity={0.6}
              />
            </>
          )}

          {/* Flexibility indicator (spine glow) */}
          {isHighlighted('flexibility') && (
            <Path
              d="M100 70 L100 200"
              stroke={Colors.sports.yoga}
              strokeWidth="6"
              opacity={0.4}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
