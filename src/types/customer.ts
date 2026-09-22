export type CustomerStatus = 'subscriber' | 'unsubscribed';
export type LoyaltyTier = 'standard' | 'special_offers' | 'unsubscribed';

export interface CustomerDoc {
  customerId: string;
  firstName: string;
  phone?: string;
  normalizedPhone?: string;
  email?: string;
  normalizedEmail?: string;
  smsConsent: boolean;
  emailConsent: boolean;
  subscriptionCount: number;
  firstSubscribedAt: string;
  lastSubscribedAt: string;
  customerStatus: CustomerStatus;
  loyaltyTier: LoyaltyTier;
  specialOffers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialOfferDoc {
  id: string;
  offerName: string;
  description: string;
  network: 'MTN' | 'TELECEL' | 'AIRTELTIGO' | 'ALL';
  dataAmount: string;
  specialPrice: number;
  normalPrice: number;
  startDate: string;
  endDate: string;
  smsMessage: string;
  emailMessage: string;
  active: boolean;
  createdAt: string;
}

export interface CampaignDoc {
  id: string;
  channel: 'sms' | 'email';
  targetAudience: 'all_consenting' | 'special_offers_consenting';
  recipientCount: number;
  subject?: string;
  message: string;
  sentAt: string;
  status: 'dispatched' | 'completed';
}

export type CustomerFilter =
  | 'all'
  | 'special_offers'
  | 'standard'
  | 'sms'
  | 'email'
  | 'both'
  | 'unsubscribed';
