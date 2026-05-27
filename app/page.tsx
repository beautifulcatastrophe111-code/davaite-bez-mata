import Link from 'next/link';
import PlayerCard from '@/components/PlayerCard';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const positionLabels: Record<string, string> = {
  CARRY: 'Carry',
  MID: 'Mid',
  OFFLANE: 'Offlane',
  SUPPORT: 'Support',
  HARD_SUPPORT: 'Hard Support',
};

export default async function Home() {
  const topByRole = await Promise.all(
    ['CARRY', 'MID', 'OFFLANE', 'SUPPORT', 'HARD_SUPPORT'].map(async (role) => {
      const cards = await prisma.playerCard.findMany({
        where: { isActive: true, role: role as any },
        orderBy: { rating: 'desc' },
        take: 5,
      });

      return { role, cards };
    }),
  );

  return (
    <main>
      <div className="flex gap-3 mb-4">
        <Link href="/cards" className="btn-link">All cards</Link>
        <Link href="/weekly-squad" className="btn-link">Weekly squad</Link>
      </div>

      <section className="surface">
        <h1 className="text-3xl font-bold mt-0">Лучшие игроки по позициям</h1>

        <div className="flex flex-col gap-4 my-4">
        {topByRole.map(({ role, cards }) => (
          <section key={role} className="surface w-full flex flex-col items-center gap-2">
            <h2 className="text-base m-0">{positionLabels[role]}</h2>
            {cards.length ? (
              <div className="flex flex-wrap justify-center gap-3">
                {cards.map((card) => (
                  <Link key={card.id} href={`/cards/${card.slug}`} className="block h-[315px] w-[210px] overflow-hidden">
                    <div className="origin-top-left scale-[0.7]">
                      <PlayerCard card={card} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-[210px] h-[315px] rounded-2xl border border-dashed border-slate-600 grid place-items-center text-slate-400 text-sm text-center p-3">
                Нет карточки для этой позиции
              </div>
            )}
          </section>
        ))}
        </div>
      </section>
    </main>
  );
}
