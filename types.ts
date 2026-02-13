
export enum PostStatus {
  DRAFT = 'draft',
  GENERATING = 'generating',
  GENERATED = 'generated',
  FAILED = 'failed'
}

export enum BrandTone {
  FORMAL = 'formal',
  FRIENDLY = 'friendly',
  INSPIRATIONAL = 'inspirational'
}

// Fixed: Gemini 2.5 Flash Image API supports specific aspect ratios. 4:5 is not supported, so using 3:4 for portrait.
export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '16:9'
}

export interface BrandingConfig {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  tone: BrandTone;
  footerText: string;
  fontPreference: string;
  socialHandles: string;
  layoutStyle: string;
}

export interface School {
  id: string;
  name: string;
  email: string;
  planType: 'free' | 'basic' | 'pro';
  postsGeneratedThisMonth: number;
  planLimit: number;
  branding?: BrandingConfig;
}

export interface Post {
  id: string;
  schoolId: string;
  postType: 'poster' | 'event';
  title: string;
  description: string;
  aspectRatio: AspectRatio;
  status: PostStatus;
  createdAt: string;
  generatedAt?: string;
  imageUrl?: string;
  caption?: string;
  hashtags?: string[];
}

export interface AuthState {
  user: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
