import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Enter your email and a password with at least 6 characters.' },
        { status: 400 }
      );
    }
    const mail = String(email).toLowerCase().trim();
    const admin = supabaseAdmin();

    // 1) confirma que esse email pagou
    const { data: ent } = await admin
      .from('entitlements')
      .select('email, paid')
      .eq('email', mail)
      .maybeSingle();

    if (!ent || !ent.paid) {
      return NextResponse.json(
        { error: 'We could not find a purchase for this email. Use the same email from your payment.' },
        { status: 403 }
      );
    }

    // 2) cria o usuário (ou define a senha, se já existir)
    const { error: createErr } = await admin.auth.admin.createUser({
      email: mail,
      password,
      email_confirm: true,
    });

    if (createErr) {
      const msg = (createErr.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 409 }
        );
      }
      throw createErr;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('activate error', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
