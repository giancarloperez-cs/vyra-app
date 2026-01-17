// VryaFit AI Theme Colors - Dark Futuristic Theme

export const Colors = {
  // Primary Brand Colors
  primary: '#00e0ff',
  primaryDark: '#0099cc',
  primaryLight: '#66f0ff',

  // Backgrounds
  background: '#0a0f1c',
  backgroundSecondary: '#0d1526',
  cardBackground: '#162032',
  cardBackgroundLight: '#1a2840',

  // Gradients (for LinearGradient)
  gradients: {
    primary: ['#00e0ff', '#0066ff'] as const,
    dark: ['#0a0f1c', '#162032'] as const,
    card: ['#162032', '#1a2840'] as const,
    accent: ['#00e0ff', '#00ff88'] as const,
    fire: ['#ff6b35', '#ff4500'] as const,
    premium: ['#667eea', '#764ba2'] as const,
  },

  // Sport Colors (for workout cards & badges)
  sports: {
    running: '#00e0ff',    // Cyan
    biking: '#ff6b35',     // Orange
    swimming: '#00bfff',   // Deep Sky Blue
    boxing: '#ff4757',     // Red
    tennis: '#ffd32a',     // Yellow
    gym: '#7c3aed',        // Purple
    yoga: '#10b981',       // Green
    crossfit: '#f97316',   // Orange
    soccer: '#22c55e',     // Green
    basketball: '#f59e0b', // Amber
    general: '#8b5cf6',    // Violet
  },

  // Borders
  border: '#2d3b55',
  borderLight: '#3d4f70',
  borderGlow: 'rgba(0, 224, 255, 0.3)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#8f9bb3',
  textMuted: '#6e7c99',
  textPlaceholder: '#4a5568',

  // Status
  success: '#10b981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  danger: '#ef4444',
  dangerBackground: 'rgba(239, 68, 68, 0.15)',
  dangerBorder: 'rgba(239, 68, 68, 0.5)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  info: '#3b82f6',

  // Intensity levels
  intensity: {
    low: '#10b981',      // Green
    moderate: '#f59e0b', // Amber
    high: '#ef4444',     // Red
    recovery: '#8b5cf6', // Purple
  },

  // UI Elements
  switchTrackOff: '#3d4f70',
  switchTrackOn: '#00e0ff',
  switchThumb: '#ffffff',
  iconSecondary: '#6e7c99',

  // Glow effects
  glow: {
    primary: 'rgba(0, 224, 255, 0.4)',
    success: 'rgba(16, 185, 129, 0.4)',
    danger: 'rgba(239, 68, 68, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
} as const;

// Sport type definitions
export type SportType = keyof typeof Colors.sports;

// Helper to get sport color
export const getSportColor = (sport: string): string => {
  const normalizedSport = sport.toLowerCase().replace(/\s+/g, '') as SportType;
  return Colors.sports[normalizedSport] || Colors.sports.general;
};

// Helper to get intensity color
export const getIntensityColor = (intensity: string): string => {
  const normalized = intensity.toLowerCase() as keyof typeof Colors.intensity;
  return Colors.intensity[normalized] || Colors.intensity.moderate;
};
