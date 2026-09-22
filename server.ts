import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

export interface CustomerRecord {
  customerId: string;
  firstName: string;
  phone?: string;
  email?: string;
  smsConsent: boolean;
  emailConsent: boolean;
  subscriptionCount: number;
  firstSubscribedAt: string;
  lastSubscribedAt: string;
  customerStatus: "subscriber" | "unsubscribed";
  loyaltyTier: "standard" | "special_offers" | "unsubscribed";
  specialOffers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialOfferRecord {
  id: string;
  offerName: string;
  description: string;
  network: "MTN" | "TELECEL" | "AIRTELTIGO" | "ALL";
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

export interface CampaignRecord {
  id: string;
  channel: "sms" | "email";
  targetAudience: "all_consenting" | "special_offers_consenting";
  recipientCount: number;
  subject?: string;
  message: string;
  sentAt: string;
  status: "dispatched" | "completed";
}

const DATA_DIR = path.join(process.cwd(), "data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const OFFERS_FILE = path.join(DATA_DIR, "special_offers.json");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");

function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Customers storage
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    // Check legacy subscribers file for initial migration if present
    const legacyFile = path.join(DATA_DIR, "subscribers.json");
    if (fs.existsSync(legacyFile)) {
      try {
        const legacyData = JSON.parse(fs.readFileSync(legacyFile, "utf-8"));
        const migrated: CustomerRecord[] = legacyData.map((sub: any) => ({
          customerId: sub.id || "cust_" + Math.random().toString(36).substring(2, 8),
          firstName: sub.firstName || "Subscriber",
          phone: sub.phoneNumber || undefined,
          email: sub.emailAddress || undefined,
          smsConsent: Boolean(sub.smsConsent),
          emailConsent: Boolean(sub.emailConsent),
          subscriptionCount: 1,
          firstSubscribedAt: sub.consentTimestamp || new Date().toISOString(),
          lastSubscribedAt: sub.consentTimestamp || new Date().toISOString(),
          customerStatus: sub.status === "unsubscribed" ? "unsubscribed" : "subscriber",
          loyaltyTier: sub.status === "unsubscribed" ? "unsubscribed" : "standard",
          specialOffers: false,
          createdAt: sub.consentTimestamp || new Date().toISOString(),
          updatedAt: sub.updatedAt || new Date().toISOString(),
        }));
        fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(migrated, null, 2), "utf-8");
      } catch {
        fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify([], null, 2), "utf-8");
      }
    } else {
      fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  }

  // Seed default Special Offers if not present
  if (!fs.existsSync(OFFERS_FILE)) {
    const defaultOffers: SpecialOfferRecord[] = [
      {
        id: "offer_mtn_5gb_special",
        offerName: "🔥 Returning Subscriber Deal: MTN 5GB",
        description: "Exclusive bundle drop for returning Cohort Tech community members.",
        network: "MTN",
        dataAmount: "5GB",
        specialPrice: 22,
        normalPrice: 25,
        startDate: "2026-09-01",
        endDate: "2026-12-31",
        smsMessage: "Cohort Tech VIP: Get MTN 5GB for GH₵22 (Normal GH₵25) today only! Claim via CheapData shop.",
        emailMessage: "Welcome back! As a valued returning Cohort Tech subscriber, unlock MTN 5GB for GH₵22.",
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "offer_telecel_10gb_special",
        offerName: "⚡ Telecel Special Boost: 10GB",
        description: "Special high-volume tier discount for registered loyal subscribers.",
        network: "TELECEL",
        dataAmount: "10GB",
        specialPrice: 40,
        normalPrice: 45,
        startDate: "2026-09-01",
        endDate: "2026-12-31",
        smsMessage: "Cohort Tech VIP: Telecel 10GB now GH₵40 (Normal GH₵45) for returning subscribers.",
        emailMessage: "Enjoy premium data savings with Telecel 10GB at GH₵40.",
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(OFFERS_FILE, JSON.stringify(defaultOffers, null, 2), "utf-8");
  }

  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function loadCustomers(): CustomerRecord[] {
  try {
    ensureStorage();
    return JSON.parse(fs.readFileSync(CUSTOMERS_FILE, "utf-8")) as CustomerRecord[];
  } catch (err) {
    console.error("Error reading customers:", err);
    return [];
  }
}

function saveCustomers(customers: CustomerRecord[]): void {
  try {
    ensureStorage();
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving customers:", err);
  }
}

function loadSpecialOffers(): SpecialOfferRecord[] {
  try {
    ensureStorage();
    return JSON.parse(fs.readFileSync(OFFERS_FILE, "utf-8")) as SpecialOfferRecord[];
  } catch {
    return [];
  }
}

function saveSpecialOffers(offers: SpecialOfferRecord[]): void {
  try {
    ensureStorage();
    fs.writeFileSync(OFFERS_FILE, JSON.stringify(offers, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving offers:", err);
  }
}

function loadCampaigns(): CampaignRecord[] {
  try {
    ensureStorage();
    return JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, "utf-8")) as CampaignRecord[];
  } catch {
    return [];
  }
}

function saveCampaigns(campaigns: CampaignRecord[]): void {
  try {
    ensureStorage();
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving campaigns:", err);
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, "");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "Cohort Tech Customer & Loyalty API",
      timestamp: new Date().toISOString(),
    });
  });

  // API: Public Special Offers (only active ones)
  app.get("/api/special-offers", (req, res) => {
    const active = loadSpecialOffers().filter((o) => o.active);
    res.json({ success: true, offers: active });
  });

  // ==========================================
  // API: SUBSCRIBE & RETURNING CUSTOMER RECOGNITION
  // ==========================================
  app.post("/api/subscribe", (req, res) => {
    const { firstName, phoneNumber, emailAddress, smsConsent, emailConsent } = req.body;

    const trimmedFirstName = (firstName || "").trim();
    const trimmedPhone = phoneNumber ? normalizePhone(phoneNumber) : "";
    const trimmedEmail = emailAddress ? normalizeEmail(emailAddress) : "";
    const hasSmsConsent = Boolean(smsConsent);
    const hasEmailConsent = Boolean(emailConsent);

    if (!trimmedFirstName) {
      return res.status(400).json({ success: false, error: "First name is required." });
    }

    if (!hasSmsConsent && !hasEmailConsent) {
      return res.status(400).json({
        success: false,
        error: "Please select at least one notification channel (SMS or Email) to consent to marketing updates.",
      });
    }

    if (hasSmsConsent && !trimmedPhone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required for SMS deal alerts.",
      });
    }

    if (hasEmailConsent && !trimmedEmail) {
      return res.status(400).json({
        success: false,
        error: "Email address is required for Email deal alerts.",
      });
    }

    const customers = loadCustomers();
    const now = new Date().toISOString();

    // Check for existing customer by phone or email
    const existingIndex = customers.findIndex((c) => {
      const matchEmail = trimmedEmail && c.email && c.email.toLowerCase() === trimmedEmail;
      const matchPhone = trimmedPhone && c.phone && normalizePhone(c.phone) === trimmedPhone;
      return matchEmail || matchPhone;
    });

    const activeOffers = loadSpecialOffers().filter((o) => o.active);

    // ==========================================
    // CASE A: RETURNING CUSTOMER (Already Exists)
    // ==========================================
    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      const newCount = (existing.subscriptionCount || 1) + 1;

      // Update existing record: DO NOT create a duplicate customer!
      // Upgrade to special_offers loyalty tier and enable specialOffers
      const updatedCustomer: CustomerRecord = {
        ...existing,
        firstName: trimmedFirstName || existing.firstName,
        phone: trimmedPhone || existing.phone,
        email: trimmedEmail || existing.email,
        // Update consent flags to latest affirmative selections
        smsConsent: hasSmsConsent,
        emailConsent: hasEmailConsent,
        subscriptionCount: newCount,
        lastSubscribedAt: now,
        customerStatus: "subscriber",
        loyaltyTier: "special_offers",
        specialOffers: true,
        updatedAt: now,
      };

      customers[existingIndex] = updatedCustomer;
      saveCustomers(customers);

      return res.status(200).json({
        success: true,
        isReturning: true,
        customer: updatedCustomer,
        unlockedOffers: activeOffers,
        message: "👋 WELCOME BACK! You've unlocked Cohort Tech Special Offers.",
      });
    }

    // ==========================================
    // CASE B: NEW CUSTOMER (First Time Subscription)
    // ==========================================
    const newCustomer: CustomerRecord = {
      customerId: "cust_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      firstName: trimmedFirstName,
      phone: trimmedPhone || undefined,
      email: trimmedEmail || undefined,
      smsConsent: hasSmsConsent,
      emailConsent: hasEmailConsent,
      subscriptionCount: 1,
      firstSubscribedAt: now,
      lastSubscribedAt: now,
      customerStatus: "subscriber",
      loyaltyTier: "standard",
      specialOffers: false,
      createdAt: now,
      updatedAt: now,
    };

    customers.push(newCustomer);
    saveCustomers(customers);

    return res.status(200).json({
      success: true,
      isReturning: false,
      customer: newCustomer,
      unlockedOffers: [],
      message: "🎉 You're subscribed! Keep an eye out for Cohort Tech Data Hub updates and offers.",
    });
  });

  // ==========================================
  // API: UNSUBSCRIBE MECHANISM (Compliance preserved)
  // ==========================================
  app.post("/api/unsubscribe", (req, res) => {
    const { identifier, channel } = req.body; // channel: "sms" | "email" | "all"
    if (!identifier) {
      return res.status(400).json({ success: false, error: "Identifier (email or phone) is required." });
    }

    const customers = loadCustomers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = normalizePhone(identifier);

    let updatedCount = 0;
    const now = new Date().toISOString();

    const updatedCustomers = customers.map((c) => {
      const match =
        (c.email && c.email.toLowerCase() === cleanId) ||
        (c.phone && normalizePhone(c.phone) === cleanPhone);

      if (match) {
        updatedCount++;
        let newSms = c.smsConsent;
        let newEmail = c.emailConsent;

        if (channel === "sms") newSms = false;
        else if (channel === "email") newEmail = false;
        else {
          newSms = false;
          newEmail = false;
        }

        const isUnsubAll = !newSms && !newEmail;

        return {
          ...c,
          smsConsent: newSms,
          emailConsent: newEmail,
          customerStatus: (isUnsubAll ? "unsubscribed" : "subscriber") as "subscriber" | "unsubscribed",
          loyaltyTier: (isUnsubAll ? "unsubscribed" : c.loyaltyTier) as "standard" | "special_offers" | "unsubscribed",
          specialOffers: isUnsubAll ? false : c.specialOffers,
          updatedAt: now,
        };
      }
      return c;
    });

    if (updatedCount > 0) {
      saveCustomers(updatedCustomers);
      return res.json({
        success: true,
        message: "Your preferences have been updated. You will receive no further messages on the opted-out channel.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No subscriber matching that phone number or email was found.",
      });
    }
  });

  // ==========================================
  // ADMIN API ENDPOINTS
  // ==========================================

  // Admin stats
  app.get("/api/admin/stats", (req, res) => {
    const customers = loadCustomers();
    const totalCustomers = customers.length;
    const standardSubscribers = customers.filter(
      (c) => c.customerStatus === "subscriber" && c.loyaltyTier === "standard"
    ).length;
    const specialOfferSubscribers = customers.filter(
      (c) => c.customerStatus === "subscriber" && c.loyaltyTier === "special_offers"
    ).length;
    const smsSubscribers = customers.filter(
      (c) => c.customerStatus === "subscriber" && c.smsConsent
    ).length;
    const emailSubscribers = customers.filter(
      (c) => c.customerStatus === "subscriber" && c.emailConsent
    ).length;
    const smsAndEmailSubscribers = customers.filter(
      (c) => c.customerStatus === "subscriber" && c.smsConsent && c.emailConsent
    ).length;
    const unsubscribed = customers.filter((c) => c.customerStatus === "unsubscribed").length;

    res.json({
      totalCustomers,
      standardSubscribers,
      specialOfferSubscribers,
      smsSubscribers,
      emailSubscribers,
      smsAndEmailSubscribers,
      unsubscribed,
    });
  });

  // Admin: Get all customers
  app.get("/api/admin/customers", (req, res) => {
    res.json({ success: true, customers: loadCustomers() });
  });

  // Admin: Update customer
  app.post("/api/admin/customers/update", (req, res) => {
    const { customerId, updates } = req.body;
    const customers = loadCustomers();
    const index = customers.findIndex((c) => c.customerId === customerId);
    if (index >= 0) {
      customers[index] = {
        ...customers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveCustomers(customers);
      return res.json({ success: true, customer: customers[index] });
    }
    res.status(404).json({ success: false, error: "Customer not found." });
  });

  // Admin: Delete customer
  app.delete("/api/admin/customers/:id", (req, res) => {
    const { id } = req.params;
    const customers = loadCustomers().filter((c) => c.customerId !== id);
    saveCustomers(customers);
    res.json({ success: true });
  });

  // Admin: Special Offers management
  app.get("/api/admin/special-offers", (req, res) => {
    res.json({ success: true, offers: loadSpecialOffers() });
  });

  app.post("/api/admin/special-offers", (req, res) => {
    const newOffer = req.body;
    const offers = loadSpecialOffers();
    const id = newOffer.id || `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const record: SpecialOfferRecord = {
      ...newOffer,
      id,
      createdAt: new Date().toISOString(),
    };
    offers.unshift(record);
    saveSpecialOffers(offers);
    res.json({ success: true, offer: record });
  });

  app.patch("/api/admin/special-offers/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const offers = loadSpecialOffers();
    const index = offers.findIndex((o) => o.id === id);
    if (index >= 0) {
      offers[index] = { ...offers[index], ...updates };
      saveSpecialOffers(offers);
      return res.json({ success: true, offer: offers[index] });
    }
    res.status(404).json({ success: false, error: "Offer not found." });
  });

  app.delete("/api/admin/special-offers/:id", (req, res) => {
    const { id } = req.params;
    const offers = loadSpecialOffers().filter((o) => o.id !== id);
    saveSpecialOffers(offers);
    res.json({ success: true });
  });

  // Admin: Campaigns management
  app.get("/api/admin/campaigns", (req, res) => {
    res.json({ success: true, campaigns: loadCampaigns() });
  });

  app.post("/api/admin/campaigns", (req, res) => {
    const { channel, targetAudience, subject, message } = req.body;

    const customers = loadCustomers().filter((c) => c.customerStatus === "subscriber");

    // Strictly filter out anyone who has NOT consented!
    let eligibleCustomers = customers.filter((c) => {
      if (channel === "sms") return c.smsConsent;
      if (channel === "email") return c.emailConsent;
      return false;
    });

    if (targetAudience === "special_offers_consenting") {
      eligibleCustomers = eligibleCustomers.filter((c) => c.loyaltyTier === "special_offers");
    }

    const campaign: CampaignRecord = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      channel: channel as "sms" | "email",
      targetAudience: targetAudience as "all_consenting" | "special_offers_consenting",
      recipientCount: eligibleCustomers.length,
      subject,
      message,
      sentAt: new Date().toISOString(),
      status: "completed",
    };

    const campaigns = loadCampaigns();
    campaigns.unshift(campaign);
    saveCampaigns(campaigns);

    res.json({
      success: true,
      campaign,
      recipientCount: eligibleCustomers.length,
      message: `Campaign dispatched to ${eligibleCustomers.length} consenting subscribers.`,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
