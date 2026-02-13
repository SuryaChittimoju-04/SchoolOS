
import { BrandTone, AspectRatio } from './types';

export const TONES = [
  { value: BrandTone.FORMAL, label: 'Formal', description: 'Academic and professional' },
  { value: BrandTone.FRIENDLY, label: 'Friendly', description: 'Welcoming and approachable' },
  { value: BrandTone.INSPIRATIONAL, label: 'Inspirational', description: 'Motivational and visionary' },
];

export const ASPECT_RATIOS = [
  { value: AspectRatio.SQUARE, label: '1:1 Square', description: 'Instagram Posts' },
  // Fixed label to reflect 3:4 ratio for Gemini Image API compatibility
  { value: AspectRatio.PORTRAIT, label: '3:4 Portrait', description: 'Instagram/Facebook feed' },
  { value: AspectRatio.LANDSCAPE, label: '16:9 Landscape', description: 'Twitter/LinkedIn headers' },
];

export const PLAN_LIMITS = {
  free: 5,
  basic: 50,
  pro: 500,
};

export const STORAGE_KEYS = {
  USER: 'sm_os_user',
  POSTS: 'sm_os_posts',
  BRANDING: 'sm_os_branding',
};
