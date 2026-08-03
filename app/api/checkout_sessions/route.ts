import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe is instantiated inside the handler to prevent build-time crashes if keys are missing.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, serviceName, amount } = body;

    if (!bookingId || !amount || !serviceName) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2024-04-10' as any,
    });

    // Determine base URL dynamically (or from env)
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking: ${serviceName}`,
              description: `Payment for booking ID: ${bookingId}`,
            },
            // Stripe expects amount in cents
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${origin}/payment/cancel`,
      metadata: {
        bookingId: bookingId,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    );
  }
}
