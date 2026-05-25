import Link from 'next/link';
import type { PlayerCard } from '@prisma/client';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function Page() {
  requireAdmin();

  const cards: PlayerCard[] = await prisma.playerCard.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <AdminLayout>
      <Link href="/admin/cards/new">Add</Link>
      <table>
        <tbody>
          {cards.map((c: PlayerCard) => (
            <tr key={c.id}>
              <td>{c.nickname}</td>
              <td>{c.realName}</td>
              <td>{c.role}</td>
              <td>
                <Link href={`/admin/cards/${c.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
