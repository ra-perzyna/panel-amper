'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    router.replace('/dashboard');
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Zaloguj się</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Hasło" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50">
          {loading ? 'Logowanie…' : 'Zaloguj'}
        </button>
      </form>
    </div>
  );
}
