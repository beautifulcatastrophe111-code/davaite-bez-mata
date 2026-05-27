import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { deletePlayerCard, togglePlayerCardActive } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

type CardRow = {
  id: string;
  nickname: string;
  role: string;
  isActive: boolean;
};

export default async function Page() {
  requireAdmin();

  const cards: CardRow[] = await prisma.playerCard.findMany({
    select: {
      id: true,
      nickname: true,
      role: true,
      isActive: true,
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
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c: CardRow) => (
            <tr key={c.id}>
              <td>{c.nickname}</td>
              <td>{c.role}</td>
              <td>{c.isActive ? 'Visible' : 'Hidden'}</td>
              <td className='flex flex-wrap gap-2'>
                <Link href={`/admin/cards/${c.id}/edit`} className='btn-link'>Edit</Link>
                <form action={togglePlayerCardActive.bind(null, c.id, !c.isActive)}>
                  <button type='submit'>{c.isActive ? 'Hide' : 'Show'}</button>
                </form>
                <form action={deletePlayerCard.bind(null, c.id)}>
                  <button type='submit' className='bg-red-700 hover:bg-red-600'>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
