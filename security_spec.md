# Security Specification: Cohort Tech Data Hub - Subscriber Management

## 1. Data Invariants
1. **PII Isolation (Zero Public Reads)**: Unauthenticated or non-admin visitors can NEVER read (`get` or `list`) the `/subscribers` collection. PII like phone numbers, names, and email addresses is strictly protected.
2. **Voluntary Subscription Integrity**: Subscribers can only be created with affirmative consent (either `smsConsent == true` or `emailConsent == true`). Both consent flags cannot be false at creation.
3. **No Shadow Fields / Key Strictness**: Payloads to `/subscribers` must only include approved schema keys (`firstName`, `phoneNumber`, `emailAddress`, `smsConsent`, `emailConsent`, `subscribedAt`, `source`, `status`, `updatedAt`). Ghost fields like `isAdmin` or `role` are strictly rejected.
4. **Bootstrapped Admin Authentication**: Only the verified admin account (`asared293@gmail.com` with `email_verified == true`) or UID records existing in `/admins` can read, update, or delete subscriber records.
5. **Field Size and String Length Constraints**: All string fields have strict bounded sizes (names <= 100 chars, phone <= 30 chars, email <= 120 chars, source <= 100 chars) to prevent resource exhaustion attacks.

## 2. The "Dirty Dozen" Malicious Payloads
1. **Unauthenticated List Query**: Anonymous attacker calls `getDocs(collection(db, 'subscribers'))` -> MUST BE REJECTED (PERMISSION_DENIED).
2. **Unauthenticated Get Single Document**: Malicious user guesses a subscriber ID and attempts `getDoc(doc(db, 'subscribers', 'sub_123'))` -> MUST BE REJECTED (PERMISSION_DENIED).
3. **Spoofed Admin Email (Unverified)**: Attacker authenticates with a token where email is `asared293@gmail.com` but `email_verified == false` -> MUST BE REJECTED (PERMISSION_DENIED).
4. **Shadow Field Injection on Creation**: Attacker attempts to inject `{ firstName: 'Attacker', role: 'admin', isSuperUser: true, ... }` into `/subscribers` -> MUST BE REJECTED.
5. **No Consent Subscription (Zero Consent)**: Attacker submits a payload where `smsConsent: false` and `emailConsent: false` -> MUST BE REJECTED.
6. **Oversized Field Payload (Denial of Wallet)**: Attacker attempts to write a 1MB junk string as `firstName` or `phoneNumber` -> MUST BE REJECTED.
7. **Invalid Status Injection**: Attacker submits `status: 'compromised'` or `status: 'superuser'` -> MUST BE REJECTED.
8. **Malicious Document ID**: Attacker attempts to create a document with a 2KB junk character ID like `../../secrets` -> MUST BE REJECTED.
9. **Unauthorized Update by Non-Admin**: Non-admin user tries to update another subscriber's `smsConsent` or `phoneNumber` -> MUST BE REJECTED.
10. **Unauthorized Document Deletion**: Non-admin user attempts to delete a subscriber record from `/subscribers` -> MUST BE REJECTED.
11. **Admin Privilege Escalation via Self-Promotion**: Normal user attempts to write their own UID into `/admins/{uid}` -> MUST BE REJECTED.
12. **Catch-All Probe on Undefined Collections**: Attacker tries to read or write to `/system_secrets` or `/audit_logs` -> MUST BE REJECTED by default-deny.
