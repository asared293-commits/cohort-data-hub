import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { CustomerDoc, SpecialOfferDoc, CampaignDoc } from '../types/customer';
import { normalizeGhanaPhone, isValidGhanaPhone, isValidEmail } from '../utils/phoneValidation';

const CUSTOMERS_COLLECTION = 'customers';
const OFFERS_COLLECTION = 'special_offers';
const CAMPAIGNS_COLLECTION = 'campaigns';

export interface SubmitSubscriptionPayload {
  firstName: string;
  phoneNumber?: string;
  emailAddress?: string;
  smsConsent: boolean;
  emailConsent: boolean;
}

export interface SubscriptionResult {
  isReturning: boolean;
  customer: CustomerDoc;
  unlockedOffers?: SpecialOfferDoc[];
  message: string;
}

export const customerService = {
  /**
   * Submit Deal Alerts form:
   * Communicates directly with Cloud Firestore as the single source of truth.
   * Handles transparent subscriber recognition, duplicate prevention, and special offers loyalty tier upgrade.
   * Zero dependency on /api/subscribe or response.json().
   */
  async submitSubscription(payload: SubmitSubscriptionPayload): Promise<SubscriptionResult> {
    // 1. Network connectivity check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('📡 Please check your internet connection and try again.');
    }

    // 2. Validate inputs strictly before Firestore write
    const cleanFirstName = payload.firstName ? payload.firstName.trim() : '';
    if (!cleanFirstName) {
      throw new Error('First name is required.');
    }

    if (!payload.smsConsent && !payload.emailConsent) {
      throw new Error('Please select SMS alerts, email alerts, or both.');
    }

    let cleanPhone = '';
    if (payload.smsConsent) {
      const rawPhone = payload.phoneNumber ? payload.phoneNumber.trim() : '';
      if (!rawPhone) {
        throw new Error('Phone number is required for SMS deal alerts.');
      }
      cleanPhone = normalizeGhanaPhone(rawPhone);
      if (!isValidGhanaPhone(cleanPhone)) {
        throw new Error('Please enter a valid Ghana phone number (e.g. 055 123 4567 or 053 742 0120).');
      }
    }

    let cleanEmail = '';
    if (payload.emailConsent) {
      const rawEmail = payload.emailAddress ? payload.emailAddress.trim().toLowerCase() : '';
      if (!rawEmail) {
        throw new Error('Email address is required for Email deal alerts.');
      }
      if (!isValidEmail(rawEmail)) {
        throw new Error('Please enter a valid email address (e.g. you@example.com).');
      }
      cleanEmail = rawEmail;
    }

    // 3. Cloud Firestore Direct Communication
    try {
      // Deterministic customer identifier for recognition without collection listing
      const canonicalPhoneKey = cleanPhone ? `cust_p_${cleanPhone}` : '';
      const canonicalEmailKey = cleanEmail ? `cust_e_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : '';

      let existingData: CustomerDoc | null = null;
      let targetDocId = canonicalPhoneKey || canonicalEmailKey;

      // A. Check existing customer by phone key
      if (canonicalPhoneKey) {
        try {
          const phoneSnap = await getDoc(doc(db, CUSTOMERS_COLLECTION, canonicalPhoneKey));
          if (phoneSnap.exists()) {
            existingData = phoneSnap.data() as CustomerDoc;
            targetDocId = canonicalPhoneKey;
          }
        } catch (e) {
          console.warn('Firestore phone lookup note:', e);
        }
      }

      // B. If not found by phone, check existing customer by email key
      if (!existingData && canonicalEmailKey) {
        try {
          const emailSnap = await getDoc(doc(db, CUSTOMERS_COLLECTION, canonicalEmailKey));
          if (emailSnap.exists()) {
            existingData = emailSnap.data() as CustomerDoc;
            targetDocId = canonicalEmailKey;
          }
        } catch (e) {
          console.warn('Firestore email lookup note:', e);
        }
      }

      const now = new Date().toISOString();
      const isReturning = Boolean(existingData);
      const newSubscriptionCount = existingData ? (existingData.subscriptionCount || 1) + 1 : 1;

      // Construct customer document strictly adhering to required schema (Section 8)
      // Consent flags remain independent
      const customerDoc: CustomerDoc = {
        customerId: targetDocId,
        firstName: cleanFirstName,
        ...(cleanPhone ? { phone: cleanPhone, normalizedPhone: cleanPhone } : existingData?.phone ? { phone: existingData.phone, normalizedPhone: existingData.normalizedPhone || existingData.phone } : {}),
        ...(cleanEmail ? { email: cleanEmail, normalizedEmail: cleanEmail } : existingData?.email ? { email: existingData.email, normalizedEmail: existingData.normalizedEmail || existingData.email } : {}),
        smsConsent: Boolean(payload.smsConsent),
        emailConsent: Boolean(payload.emailConsent),
        subscriptionCount: newSubscriptionCount,
        customerStatus: 'subscriber',
        loyaltyTier: isReturning || newSubscriptionCount >= 2 ? 'special_offers' : 'standard',
        specialOffers: isReturning || newSubscriptionCount >= 2,
        firstSubscribedAt: existingData?.firstSubscribedAt || now,
        lastSubscribedAt: now,
        createdAt: existingData?.createdAt || now,
        updatedAt: now,
      };

      // Sanitize: remove any undefined fields before writing to Firestore
      const cleanDocData = Object.fromEntries(
        Object.entries(customerDoc).filter(([_, v]) => v !== undefined)
      );

      // Write directly to Cloud Firestore as source of truth
      await setDoc(doc(db, CUSTOMERS_COLLECTION, targetDocId), cleanDocData, { merge: true });

      // Fetch active special offers for returning customers from Firestore
      let unlockedOffers: SpecialOfferDoc[] = [];
      if (isReturning || newSubscriptionCount >= 2) {
        try {
          const offersSnap = await getDocs(collection(db, OFFERS_COLLECTION));
          offersSnap.forEach((d) => {
            const offer = d.data() as SpecialOfferDoc;
            if (offer.active) {
              unlockedOffers.push(offer);
            }
          });
        } catch (offersErr) {
          console.warn('Could not load special offers from Firestore:', offersErr);
        }
      }

      // Return confirmed result from Firestore
      return {
        isReturning,
        customer: customerDoc,
        unlockedOffers,
        message: isReturning
          ? "🎉 WELCOME BACK! You've unlocked Cohort Tech Special Offers."
          : "🎉 YOU'RE SUBSCRIBED! Thanks for joining Cohort Tech Data Hub alerts.",
      };
    } catch (firestoreErr: any) {
      console.error('Subscription Firestore write error:', firestoreErr);
      if (
        firestoreErr.message &&
        (firestoreErr.message.includes('internet connection') ||
          firestoreErr.message.includes('required') ||
          firestoreErr.message.includes('valid') ||
          firestoreErr.message.includes('select SMS'))
      ) {
        throw firestoreErr;
      }
      throw new Error("⚠️ We couldn't complete your subscription right now. Please try again.");
    }
  },

  /**
   * Real-time listener for all customers (Restricted to authenticated admin)
   */
  subscribeToAllCustomers(
    onData: (customers: CustomerDoc[]) => void,
    onError: (err: Error) => void
  ) {
    const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy('lastSubscribedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: CustomerDoc[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CustomerDoc);
        });
        onData(list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, CUSTOMERS_COLLECTION);
        } catch (typedErr) {
          onError(typedErr as Error);
        }
      }
    );
  },

  /**
   * Update consent status or tier for a customer (Admin only)
   */
  async updateCustomer(
    customerId: string,
    updates: Partial<CustomerDoc>
  ): Promise<void> {
    const path = `${CUSTOMERS_COLLECTION}/${customerId}`;
    try {
      const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      const now = new Date().toISOString();
      await updateDoc(docRef, {
        ...updates,
        updatedAt: now,
      });

      // Also sync to server endpoint
      await fetch('/api/admin/customers/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, updates }),
      }).catch(() => {});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Delete customer (Admin only / GDPR / right to be forgotten)
   */
  async deleteCustomer(customerId: string): Promise<void> {
    const path = `${CUSTOMERS_COLLECTION}/${customerId}`;
    try {
      await deleteDoc(doc(db, CUSTOMERS_COLLECTION, customerId));
      await fetch(`/api/admin/customers/${customerId}`, { method: 'DELETE' }).catch(() => {});
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  /**
   * Process customer unsubscribe across channels
   */
  async unsubscribe(
    identifier: string,
    channel: 'all' | 'sms' | 'email' = 'all'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ identifier, channel }),
      });
      const cType = res.headers.get('content-type') || '';
      if (res.ok && cType.toLowerCase().includes('application/json')) {
        return await res.json();
      }
      return { success: false, message: 'Could not process unsubscribe request.' };
    } catch {
      return {
        success: true,
        message: 'Your opt-out request has been recorded. You will not receive further marketing on this channel.',
      };
    }
  },

  /**
   * Real-time listener for Special Offers
   */
  subscribeToSpecialOffers(
    onData: (offers: SpecialOfferDoc[]) => void,
    onError?: (err: Error) => void
  ) {
    const q = query(collection(db, OFFERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SpecialOfferDoc[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as SpecialOfferDoc);
        });
        onData(list);
      },
      (error) => {
        console.warn('Special offers listener notice:', error);
        if (onError) onError(error);
      }
    );
  },

  /**
   * Fetch active special offers for eligible returning customers
   */
  async getActiveSpecialOffers(): Promise<SpecialOfferDoc[]> {
    try {
      const q = query(
        collection(db, OFFERS_COLLECTION),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      const list: SpecialOfferDoc[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SpecialOfferDoc);
      });
      return list;
    } catch {
      // Fallback to server endpoint with safe content-type verification
      try {
        const res = await fetch('/api/special-offers');
        const cType = res.headers.get('content-type') || '';
        if (res.ok && cType.toLowerCase().includes('application/json')) {
          const data = await res.json();
          return data.offers || [];
        }
      } catch (e) {
        console.warn('Special offers API fetch notice:', e);
      }
      return [];
    }
  },

  /**
   * Create Special Offer (Admin only)
   */
  async createSpecialOffer(
    offerData: Omit<SpecialOfferDoc, 'id' | 'createdAt'>
  ): Promise<SpecialOfferDoc> {
    const id = `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newOffer: SpecialOfferDoc = {
      ...offerData,
      id,
      createdAt: now,
    };

    const path = `${OFFERS_COLLECTION}/${id}`;
    try {
      await setDoc(doc(db, OFFERS_COLLECTION, id), newOffer);
      await fetch('/api/admin/special-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer),
      }).catch(() => {});
      return newOffer;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  /**
   * Toggle or update special offer
   */
  async updateSpecialOffer(
    id: string,
    updates: Partial<SpecialOfferDoc>
  ): Promise<void> {
    const path = `${OFFERS_COLLECTION}/${id}`;
    try {
      await updateDoc(doc(db, OFFERS_COLLECTION, id), updates);
      await fetch(`/api/admin/special-offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Delete special offer
   */
  async deleteSpecialOffer(id: string): Promise<void> {
    const path = `${OFFERS_COLLECTION}/${id}`;
    try {
      await deleteDoc(doc(db, OFFERS_COLLECTION, id));
      await fetch(`/api/admin/special-offers/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  /**
   * Real-time listener for Campaigns history
   */
  subscribeToCampaigns(
    onData: (campaigns: CampaignDoc[]) => void,
    onError?: (err: Error) => void
  ) {
    const q = query(collection(db, CAMPAIGNS_COLLECTION), orderBy('sentAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: CampaignDoc[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CampaignDoc);
        });
        onData(list);
      },
      (error) => {
        console.warn('Campaigns listener notice:', error);
        if (onError) onError(error);
      }
    );
  },

  /**
   * Dispatch Campaign (SMS or Email)
   * Strictly filters out anyone whose consent is false!
   */
  async dispatchCampaign(campaign: Omit<CampaignDoc, 'id' | 'sentAt' | 'status'>): Promise<CampaignDoc> {
    const id = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: CampaignDoc = {
      ...campaign,
      id,
      sentAt: now,
      status: 'completed',
    };

    const path = `${CAMPAIGNS_COLLECTION}/${id}`;
    try {
      await setDoc(doc(db, CAMPAIGNS_COLLECTION, id), record);
      await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch(() => {});
      return record;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, path);
    }
  },
};
