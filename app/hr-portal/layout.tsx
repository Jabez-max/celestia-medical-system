import { getSession } from '../../lib/session';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';

export default async function HRLayout({ children }: { children: React.ReactNode }) {
  // 1. I-check kung may naka-login
  const session = await getSession();
  if (!session) redirect('/login');

  // 2. Kunin ang user details mula sa database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  // 3. KICK OUT kapag hindi HR ang nag-access
  if (user?.role !== 'HR') {
    // Kung Admin, balik sa admin dashboard. Kung hindi, sa main dashboard.
    if (user?.role === 'ADMIN') redirect('/dashboard/admin');
    redirect('/dashboard');
  }

  // 4. Kung HR siya, hayaang ipakita ang page
  return <>{children}</>;
}