import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Panel | Amper', description: 'Panel klienta' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-[260px_1fr] min-h-screen">
          <aside className="bg-white border-r p-4">
            <h1 className="font-semibold mb-4">Amper Panel</h1>
            <nav className="space-y-2 text-sm">
              <a className="block hover:underline" href="/dashboard">Kalendarz</a>
              <a className="block hover:underline" href="/dashboard?filter=today">Do publikacji dziś</a>
              <a className="block hover:underline" href="/dashboard?type=reel">Rolki</a>
              <a className="block hover:underline" href="/dashboard?type=photo">Zdjęcia</a>
              <a className="block hover:underline" href="/dashboard?platform=ig">Instagram</a>
              <a className="block hover:underline" href="/dashboard?platform=tt">TikTok</a>
              <a className="block hover:underline" href="/logout">Wyloguj</a>
            </nav>
          </aside>
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
