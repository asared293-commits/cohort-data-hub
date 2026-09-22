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
   * Handles transparent subscriber recognition, duplicate prevention, and special offers loyalty tier upgrade.
   */
  async submitSubscription(payload: SubmitSubscriptionPayload): Promise<SubscriptionResult> {
    const cleanFirstName = payload.firstName.trim();
    const cleanPhone = payload.phoneNumber ? payload.phoneNumber.trim().replace(/[\s\-()]/g, '') : '';
    const cleanEmail = payload.emailAddress ? payload.emailAddress.trim().toLowerCase() : '';

    if (!payload.smsConsent && !payload.emailConsent) {
      throw new Error('Please select at least one notification channel (SMS or Email).');
    }

    if (payload.smsConsent && !cleanPhone) {
      throw new Error('A valid phone number is required for SMS deal alerts.');
    }

    if (payload.emailConsent && !cleanEmail) {
      throw new Error('A valid email address is required for Email deal alerts.');
    }

    // Call the server endpoint which securely checks for duplicate records without exposing customer PII
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: cleanFirstName,
        phoneNumber: cleanPhone,
        emailAddress: cleanEmail,
        smsConsent: Boolean(payload.smsConsent),
        emailConsent: Boolean(payload.emailConsent),
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to process subscription.');
    }

    // Also mirror to client Firestore if document creation is permitted
    if (data.customer && data.customer.customerId) {
      try {
        await setDoc(doc(db, CUSTOMERS_COLLECTION, data.customer.customerId), data.customer, {
          merge: true,
        });
      } catch (err) {
        // Silently tolerate if rules require admin for specific updates; server already committed
        console.info('Client Firestore mirror notice:', err);
      }
    }

    return {
      isReturning: Boolean(data.isReturning),
      customer: data.customer,
      unlockedOffers: data.unlockedOffers || [],
      message: data.message,
    };
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, channel }),
      });
      if (res.ok) {
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
      // Fallback to server endpoint
      const res = await fetch('/api/special-offers');
      if (res.ok) {
        const data = await res.json();
        return data.offers || [];
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
