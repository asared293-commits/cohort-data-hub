import { customerService } from './src/services/customerService';

async function testSubscriptionDirect() {
  console.log('Testing customerService.submitSubscription directly...');
  try {
    const result1 = await customerService.submitSubscription({
      firstName: 'DirectTester',
      phoneNumber: '0541234567',
      smsConsent: true,
      emailConsent: false,
    });
    console.log('Result 1 (First Subscription):', {
      isReturning: result1.isReturning,
      customerStatus: result1.customer.customerStatus,
      loyaltyTier: result1.customer.loyaltyTier,
      subscriptionCount: result1.customer.subscriptionCount,
      phone: result1.customer.phone,
    });

    const result2 = await customerService.submitSubscription({
      firstName: 'DirectTester',
      phoneNumber: '0541234567',
      smsConsent: true,
      emailConsent: false,
    });
    console.log('Result 2 (Returning Subscription):', {
      isReturning: result2.isReturning,
      loyaltyTier: result2.customer.loyaltyTier,
      subscriptionCount: result2.customer.subscriptionCount,
      message: result2.message,
    });

    console.log('Direct subscription flow test SUCCESS!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testSubscriptionDirect();
