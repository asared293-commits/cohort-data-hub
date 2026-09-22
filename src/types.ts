export type NetworkType = 'MTN' | 'TELECEL' | 'AIRTELTIGO';

export interface DataBundle {
  id: string;
  network: NetworkType;
  networkName: string;
  size: string;
  dataGb: number;
  priceGhs: number;
  period: string;
  popular?: boolean;
  featured?: boolean;
  tag?: string;
  perks?: string[];
}

export interface SubscriberFormData {
  firstName: string;
  phoneNumber: string;
  emailAddress: string;
  smsConsent: boolean;
  emailConsent: boolean;
  marketingPreferences?: string[];
  signupSource?: string;
}

export interface SubscriberResponse {
  success: boolean;
  message: string;
  details?: string;
  audience?: string;
  isUpdate?: boolean;
  error?: string;
}

export interface CommunityBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  highlights: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface CommunityFeedPost {
  id: string;
  author: string;
  role: string;
  timeAgo: string;
  tag: string;
  content: string;
  likes: number;
  comments: number;
  platform: 'telegram' | 'whatsapp';
}
