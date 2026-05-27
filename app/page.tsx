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
      const card = await prisma.playerCard.findFirst({
        where: { isActive: true, role: role as any },
        orderBy: { rating: 'desc' },
      });

      return { role, card };
    }),
  );

  return (
    <main>
      <h1 className="text-3xl font-bold">Лучшие игроки по позициям</h1>

      <div className="flex flex-col gap-4 my-4">
        {topByRole.map(({ role, card }) => (
          <section key={role} className="surface w-full flex flex-col items-center gap-2">
            <h2 className="text-base m-0">{positionLabels[role]}</h2>
            {card ? (
              <Link href={`/cards/${card.slug}`} className="block h-[360px] w-[240px] overflow-hidden">
                <div className="origin-top-left scale-[0.8]">
                  <PlayerCard card={card} />
                </div>
              </Link>
            ) : (
              <div className="w-[240px] h-[360px] rounded-2xl border border-dashed border-slate-600 grid place-items-center text-slate-400 text-sm text-center p-3">
                Нет карточки для этой позиции
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/cards" className="btn-link">All cards</Link>
        <Link href="/weekly-squad" className="btn-link">Weekly squad</Link>
      </div>
    </main>
  );
}
