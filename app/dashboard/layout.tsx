import { getSession } from '../../lib/session';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar'; // IMPORTANTE: Ikinonekta natin ang ginawa mong Sidebar

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Siguraduhing may naka-login
  const session = await getSession();
  if (!session) redirect('/login');

  // 2. Kunin ang ROLE ng user sa database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true } // Kunin lang natin ang role para mabilis mag-load
  });

  if (!user) redirect('/login');

  return (
    <div className="flex h-screen bg-slate-50 font-sans relative">
      
      {/* 3. Ipinapasa natin ang Role sa Sidebar para alam niya kung anong menu ang ipapakita! */}
      <Sidebar role={user.role} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}