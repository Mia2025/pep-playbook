import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('webhook signature error', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email =
      session.customer_details?.email || session.customer_email || null;

    if (email) {
      const admin = supabaseAdmin();
      // registra a compra (libera a criação de conta para esse email)
      await admin
        .from('entitlements')
        .upsert(
          {
            email: email.toLowerCase(),
            paid: true,
            stripe_session: session.id,
          },
          { onConflict: 'email' }
        );
    }
  }

  return NextResponse.json({ received: true });
}
