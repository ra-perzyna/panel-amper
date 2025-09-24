'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

type EventItem = {
  id: string;
  title: string;
  start: string;
  end?: string;
  platform: string;
  type: string;
  status: string;
  drive_url?: string;
  copy?: string;
  hashtags?: string;
};

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // auth check
  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      const session: Session | null = res.data.session;
      if (!session) router.replace('/login');
      else setReady(true);
    });
  }, [router, supabase]);

  // load events
  useEffect(() => {
    if (!ready) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_ts', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      const mapped: EventItem[] = (data || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        start: e.start_ts,
        end: e.end_ts || undefined,
        platform: e.platform,
        type: e.type,
        status: e.status,
        drive_url: e.drive_url,
        copy: e.copy,
        hashtags: e.hashtags,
      }));

      setEvents(mapped);
    };

    load();
  }, [ready, supabase]);

  if (!ready) return <div>Ładowanie…</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kalendarz publikacji</h2>
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={(info) => {
            const ev = events.find((e) => e.id === info.event.id);
            if (ev) setSelectedEvent(ev);
          }}
          height="80vh"
        />
      </div>

      {/* Modal / Drawer for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(selectedEvent.start).toLocaleString()} &nbsp;|&nbsp;{' '}
              {selectedEvent.platform.toUpperCase()} • {selectedEvent.type}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              {selectedEvent.status}
            </p>
            {selectedEvent.copy && (
              <p className="mb-2">
                <span className="font-semibold">Opis:</span>{' '}
                {selectedEvent.copy}
              </p>
            )}
            {selectedEvent.hashtags && (
              <p className="mb-2">
                <span className="font-semibold">Hashtagi:</span>{' '}
                {selectedEvent.hashtags}
              </p>
            )}
            {selectedEvent.drive_url && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Podgląd materiału</h4>
                <iframe
                  src={selectedEvent.drive_url}
                  width="100%"
                  height="400"
                  allow="autoplay"
                  className="rounded-lg border"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
