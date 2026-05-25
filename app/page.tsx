import Link from 'next/link';
import CardsGrid from '@/components/CardsGrid';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cards = await prisma.playerCard.findMany({
    where: { isActive: true },
    orderBy: { rating: 'desc' },
    take: 4,
  });

  return (
    <main>
      <h1 className="text-3xl font-bold">Dota 2 Player Cards</h1>
      <p>Fantasy/esports styled custom cards.</p>
      <div className="my-4">
        <CardsGrid cards={cards} />
      </div>
      <div className="flex gap-3">
        <Link href="/cards">All cards</Link>
        <Link href="/weekly-squad">Weekly squad</Link>
      </div>
    </main>
  );
}
