import Stripe from 'stripe';
import * as S from '../ui';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ searchParams }) {
  let email = '';
  try {
    const sessionId = searchParams?.session_id;
    if (sessionId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email || session.customer_email || '';
    }
  } catch {
    // ignora: o usuário ainda pode digitar o email manualmente
  }

  const href = email ? `/signup?email=${encodeURIComponent(email)}` : '/signup';

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <h1 style={S.h1}>Payment received</h1>
        <p style={S.sub}>
          Thank you. Your purchase is confirmed{email ? ` for ${email}` : ''}. Create your
          account to open the reader.
        </p>
        <a href={href} style={{ ...S.button, display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Create my account
        </a>
        <p style={{ ...S.sub, margin: '18px 0 0', textAlign: 'center' }}>
          Already created it?{' '}
          <a style={S.link} href="/login">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
