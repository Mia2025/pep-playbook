'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabaseBrowser';
import * as S from '../ui';

function SignupInner() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = params.get('email');
    if (e) setEmail(e);
  }, [params]);

  async function submit(ev) {
    ev.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || 'Something went wrong.');
        setLoading(false);
        return;
      }
      // conta criada: já entra
      const supabase = supabaseBrowser();
      await supabase.auth.signInWithPassword({ email: email.trim(), password });
      window.location.href = '/reader';
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <h1 style={S.h1}>Create your account</h1>
        <p style={S.sub}>
          Use the same email from your payment and choose a password. This unlocks your reader.
        </p>
        <form onSubmit={submit}>
          <label style={S.label}>Email</label>
          <input
            style={S.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <label style={S.label}>Create a password</label>
          <input
            style={S.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            required
          />
          {error ? <div style={S.err}>{error}</div> : null}
          <button style={S.button} disabled={loading}>
            {loading ? '...' : 'Create account'}
          </button>
        </form>
        <p style={{ ...S.sub, margin: '18px 0 0', textAlign: 'center' }}>
          Already have an account?{' '}
          <a style={S.link} href="/login">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={S.wrap}>...</div>}>
      <SignupInner />
    </Suspense>
  );
}
