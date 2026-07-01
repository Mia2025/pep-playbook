'use client';
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseBrowser';
import * as S from '../ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError('Email or password is incorrect.');
      setLoading(false);
      return;
    }
    window.location.href = '/reader';
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <h1 style={S.h1}>Log in</h1>
        <p style={S.sub}>Access your copy of The Peptide Buyer&rsquo;s Playbook.</p>
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
          <label style={S.label}>Password</label>
          <input
            style={S.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error ? <div style={S.err}>{error}</div> : null}
          <button style={S.button} disabled={loading}>
            {loading ? '...' : 'Log in'}
          </button>
        </form>
        <p style={{ ...S.sub, margin: '18px 0 0', textAlign: 'center' }}>
          Just purchased?{' '}
          <a style={S.link} href="/signup">
            Create your account
          </a>
        </p>
      </div>
    </div>
  );
}
