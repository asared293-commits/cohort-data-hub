import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { SubscriberDoc } from '../types/subscriber';

const COLLECTION_NAME = 'subscribers';

export interface NewSubscriberInput {
  firstName: string;
  phoneNumber?: string;
  emailAddress?: string;
  smsConsent: boolean;
  emailConsent: boolean;
}

export const subscriberService = {
  /**
   * Save a voluntary subscriber record into Firestore.
   * Strictly adheres to user requirements:
   * - Only saves phone number if visitor submits it
   * - Only marks smsConsent true if visitor checked it
   * - Only marks emailConsent true if visitor checked it
   * - Source is always "Cohort Tech Data Hub"
   * - Does not subscribe users automatically
   */
  async addSubscriber(input: NewSubscriberInput): Promise<SubscriberDoc> {
    const cleanFirstName = input.firstName.trim();
    const cleanPhone = input.phoneNumber ? input.phoneNumber.trim().replace(/[\s\-()]/g, '') : '';
    const cleanEmail = input.emailAddress ? input.emailAddress.trim().toLowerCase() : '';

    if (!input.smsConsent && !input.emailConsent) {
      throw new Error('Please select at least one notification channel (SMS or Email).');
    }

    if (input.smsConsent && !cleanPhone) {
      throw new Error('A valid phone number is required for SMS deal alerts.');
    }

    if (input.emailConsent && !cleanEmail) {
      throw new Error('A valid email address is required for Email deal alerts.');
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: SubscriberDoc = {
      id,
      firstName: cleanFirstName,
      smsConsent: Boolean(input.smsConsent),
      emailConsent: Boolean(input.emailConsent),
      subscribedAt: now,
      source: 'Cohort Tech Data Hub',
      status: 'active',
      updatedAt: now,
    };

    // Only save phone number if submitted
    if (cleanPhone) {
      record.phoneNumber = cleanPhone;
    }

    // Only save email address if submitted
    if (cleanEmail) {
      record.emailAddress = cleanEmail;
    }

    try {
      await setDoc(doc(db, COLLECTION_NAME, id), record);
      return record;
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  /**
   * Subscribe to real-time subscriber updates (restricted to authenticated admins).
   */
  subscribeToAll(
    onData: (subscribers: SubscriberDoc[]) => void,
    onError: (err: Error) => void
  ) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('subscribedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SubscriberDoc[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as SubscriberDoc);
        });
        onData(list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        } catch (typedErr) {
          onError(typedErr as Error);
        }
      }
    );
  },

  /**
   * One-time fetch of all subscribers for authorized administrators
   */
  async getAllSubscribers(): Promise<SubscriberDoc[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('subscribedAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: SubscriberDoc[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SubscriberDoc);
      });
      return list;
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  },

  /**
   * Update consent status for SMS or Email without deleting the record.
   * Preserves consent audit trail for compliance.
   */
  async updateConsent(
    id: string,
    updates: {
      smsConsent?: boolean;
      emailConsent?: boolean;
      status?: 'active' | 'unsubscribed';
    }
  ): Promise<void> {
    const path = `${COLLECTION_NAME}/${id}`;
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const now = new Date().toISOString();
      await updateDoc(docRef, {
        ...updates,
        updatedAt: now,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Delete subscriber record (compliance / right to be forgotten)
   */
  async deleteSubscriber(id: string): Promise<void> {
    const path = `${COLLECTION_NAME}/${id}`;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },
};
