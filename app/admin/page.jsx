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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#EAF6FD' }}>
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-8 shadow-xl"
        style={{ background: '#ffffff', border: '1px solid #C9E6F7' }}
      >
        <div className="text-center mb-8">
          <p className="text-xl font-bold tracking-wide" style={{ color: '#0B4F6C' }}>Florian TC</p>
          <p className="text-sm mt-1" style={{ color: '#229ED9' }}>Panel Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
            style={{
              background: '#EAF6FD',
              border: '1px solid #C9E6F7',
              color: '#0B4F6C',
              '--tw-ring-color': '#229ED9',
              caretColor: '#229ED9',
            }}
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #229ED9, #0F7FB3)' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
