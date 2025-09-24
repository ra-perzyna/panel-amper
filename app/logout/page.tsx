'use client';
import { useEffect } from 'react';
import { createClient } from '../../lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.signOut().finally(() => router.replace('/login'));
  }, [router, supabase]);
  return <div>Wylogowywanie…</div>;
}
