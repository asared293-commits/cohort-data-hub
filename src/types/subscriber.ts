export interface SubscriberDoc {
  id: string;
  firstName: string;
  phoneNumber?: string;
  emailAddress?: string;
  smsConsent: boolean;
  emailConsent: boolean;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
  updatedAt?: string;
}

export type SubscriberFilter =
  | 'all'
  | 'sms'
  | 'email'
  | 'both'
  | 'active'
  | 'unsubscribed';
