import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: readonly [string, string, ...string[]];
  icon?: keyof typeof FontAwesome.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradient = Colors.gradients.primary,
  icon,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 14, paddingHorizontal: 24 },
    large: { paddingVertical: 18, paddingHorizontal: 32 },
  };

  const textSizes = {
    small: 14,
    medium: 16,
    large: 18,
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.outlineButton,
          sizeStyles[size],
          disabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            {icon && (
              <FontAwesome
                name={icon}
                size={textSizes[size]}
                color={Colors.primary}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.outlineText,
                { fontSize: textSizes[size] },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.secondaryButton,
          sizeStyles[size],
          disabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textPrimary} />
        ) : (
          <>
            {icon && (
              <FontAwesome
                name={icon}
                size={textSizes[size]}
                color={Colors.textPrimary}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.secondaryText,
                { fontSize: textSizes[size] },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyles[size]]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <>
            {icon && (
              <FontAwesome
                name={icon}
                size={textSizes[size]}
                color={Colors.background}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.text,
                { fontSize: textSizes[size] },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.background,
    fontWeight: '700',
  },
  icon: {
    marginRight: 8,
  },
  outlineButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 12,
    backgroundColor: Colors.cardBackgroundLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
