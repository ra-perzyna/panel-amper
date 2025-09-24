'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const sp = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login');
      else setReady(true);
    });
  }, [router, supabase]);

  if (!ready) return <div>Ładowanie…</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kalendarz</h2>
      <div className="text-sm text-gray-600">Filtry: {sp?.toString() || 'brak'}</div>
      <div className="mt-4 border rounded-xl p-6 bg-white">Tu pojawi się FullCalendar.</div>
    </div>
  );
}
