'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#ffffff', border: '1px solid #fde68a' }}>
      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#b45309' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: '#7f1d1d' }}>{value ?? '—'}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>{sub}</p>}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) { setDbError(data.error); return; }
      setStats(data);
    } catch (e) {
      setDbError(e.message);
    }
  };

  const fetchConversations = async (offset = 0) => {
    try {
      const res = await fetch(`/api/admin/conversations?limit=${PER_PAGE}&offset=${offset}`);
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      if (data.error) return;
      setConversations(data.conversations ?? []);
      setTotal(data.total ?? 0);
    } catch { /* silent */ }
  };

  const openConversation = async (id) => {
    setSelected(id);
    setLoadingMsgs(true);
    const res = await fetch(`/api/admin/conversations/${id}`);
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoadingMsgs(false);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  useEffect(() => { fetchStats(); fetchConversations(0); }, []);

  const totalPages = Math.ceil(total / PER_PAGE);
  const goPage = (n) => { setPage(n); fetchConversations(n * PER_PAGE); setSelected(null); };

  return (
    <div className="min-h-screen" style={{ background: '#fff8f0', color: '#7f1d1d' }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 shadow-sm"
        style={{ background: '#ffffff', borderBottom: '1px solid #fde68a', borderTop: '3px solid #dc2626' }}
      >
        <p className="font-bold text-base" style={{ color: '#7f1d1d' }}>Bot Apple of Fortune — Admin</p>
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#b45309', background: '#fff8f0', border: '1px solid #fde68a' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#dc2626'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#fde68a'; e.currentTarget.style.color = '#b45309'; }}
        >
          Déconnexion
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Conversations" value={stats?.totalSessions} />
          <StatCard label="Messages" value={stats?.totalMessages} />
          <StatCard label="Aujourd'hui" value={stats?.todaySessions} sub="conversations" />
          <StatCard label="Aujourd'hui" value={stats?.todayMessages} sub="messages" />
        </div>

        {dbError && (
          <div className="rounded-xl px-4 py-3 text-xs font-mono break-all" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
            Erreur DB : {dbError}
          </div>
        )}

        <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
          <div
            className="flex-1 min-w-0 rounded-2xl overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid #fde68a' }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #fde68a' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b45309' }}>Conversations récentes</p>
              <p className="text-xs" style={{ color: '#92400e' }}>{total} total</p>
            </div>

            {conversations.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: '#92400e' }}>Aucune conversation pour l'instant.</p>
            ) : conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className="w-full text-left px-4 py-3 transition-colors"
                style={{
                  borderBottom: '1px solid #fef3c7',
                  background: selected === c.id ? 'rgba(245,158,11,0.08)' : 'transparent',
                  borderLeft: selected === c.id ? '2px solid #f59e0b' : '2px solid transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono" style={{ color: '#b45309' }}>{c.id.slice(0, 8)}…</span>
                  <span className="text-[11px]" style={{ color: '#92400e' }}>{formatDate(c.updated_at)}</span>
                </div>
                <p className="text-sm truncate" style={{ color: '#7f1d1d' }}>{c.first_message ?? '(vide)'}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#92400e' }}>{c.message_count} messages</p>
              </button>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #fde68a' }}>
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 0}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 transition-colors"
                  style={{ color: '#b45309', background: '#fff8f0', border: '1px solid #fde68a' }}
                >
                  ← Préc.
                </button>
                <span className="text-xs" style={{ color: '#92400e' }}>{page + 1} / {totalPages}</span>
                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="text-xs px-3 py-1 rounded-lg disabled:opacity-30 transition-colors"
                  style={{ color: '#b45309', background: '#fff8f0', border: '1px solid #fde68a' }}
                >
                  Suiv. →
                </button>
              </div>
            )}
          </div>

          {selected && (
            <div
              className="w-80 shrink-0 rounded-2xl overflow-hidden"
              style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #fde68a' }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                style={{ borderBottom: '1px solid #fde68a' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b45309' }}>Conversation</p>
                <button onClick={() => setSelected(null)} className="text-lg leading-none shrink-0" style={{ color: '#92400e' }}>×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loadingMsgs ? (
                  <p className="text-sm text-center py-6" style={{ color: '#92400e' }}>Chargement…</p>
                ) : messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                      style={m.role === 'user' ? {
                        background: 'rgba(220,38,38,0.08)',
                        border: '1px solid rgba(220,38,38,0.2)',
                        color: '#7f1d1d',
                      } : {
                        background: '#fff8f0',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
