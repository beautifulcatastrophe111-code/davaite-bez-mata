import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

type CardRow = {
  id: string;
  nickname: string;
  realName: string;
  role: string;
};

export default async function Page() {
  requireAdmin();

  const cards: CardRow[] = await prisma.playerCard.findMany({
    select: {
      id: true,
      nickname: true,
      realName: true,
      role: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <AdminLayout>
      <div className='flex items-center justify-between mb-3'>
        <h2>Cards</h2>
        <Link href="/admin/cards/new" className='btn-link'>Add</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Real name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c: CardRow) => (
            <tr key={c.id}>
              <td>{c.nickname}</td>
              <td>{c.realName}</td>
              <td>{c.role}</td>
              <td>
                <Link href={`/admin/cards/${c.id}/edit`} className='btn-link'>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
