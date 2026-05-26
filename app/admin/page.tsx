import AdminLayout from '@/components/AdminLayout';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  requireAdmin();

  const [totalCards, activeCards, inactiveCards, avgRating, topCards, weekly] = await Promise.all([
    prisma.playerCard.count(),
    prisma.playerCard.count({ where: { isActive: true } }),
    prisma.playerCard.count({ where: { isActive: false } }),
    prisma.playerCard.aggregate({ _avg: { rating: true } }),
    prisma.playerCard.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
      take: 5,
      select: { id: true, nickname: true, rating: true, role: true },
    }),
    prisma.weeklySquadSlot.findMany({ include: { card: true }, orderBy: { position: 'asc' } }),
  ]);

  return (
    <AdminLayout>
      <h1>Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-3 mb-5">
        <div className="surface"><p>Total cards</p><h2>{totalCards}</h2></div>
        <div className="surface"><p>Active cards</p><h2>{activeCards}</h2></div>
        <div className="surface"><p>Inactive cards</p><h2>{inactiveCards}</h2></div>
        <div className="surface"><p>Average rating</p><h2>{Math.round(avgRating._avg.rating ?? 0)}</h2></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="surface">
          <h2>Top 5 by rating</h2>
          <table>
            <thead>
              <tr><th>Nickname</th><th>Role</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {topCards.map((card) => (
                <tr key={card.id}>
                  <td>{card.nickname}</td>
                  <td>{card.role}</td>
                  <td>{card.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="surface">
          <h2>Weekly Squad</h2>
          <table>
            <thead>
              <tr><th>Position</th><th>Card</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {weekly.map((slot) => (
                <tr key={slot.id}>
                  <td>{slot.position}</td>
                  <td>{slot.card?.nickname || '—'}</td>
                  <td>{slot.card?.rating ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  );
}
