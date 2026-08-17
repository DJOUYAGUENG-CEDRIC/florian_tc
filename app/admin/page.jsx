'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Mot de passe incorrect.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff8f0' }}>
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-8 shadow-xl"
        style={{ background: '#ffffff', border: '1px solid #fde68a' }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            🍎
          </div>
          <p className="text-xl font-bold" style={{ color: '#7f1d1d' }}>Bot Apple of Fortune</p>
          <p className="text-sm mt-1" style={{ color: '#b45309' }}>Panel Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: '#fff8f0',
              color: '#7f1d1d',
              border: '1px solid #fde68a',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.2)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#fde68a'; e.target.style.boxShadow = 'none'; }}
          />
          {error && <p className="text-xs text-center" style={{ color: '#dc2626' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: loading || !password ? '#fecaca' : '#dc2626' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
