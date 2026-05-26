import WeeklySquad from '@/components/WeeklySquad';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const slots = await prisma.weeklySquadSlot.findMany({
    include: { card: true },
  });

  return (
    <main>
      <h1>Weekly Squad</h1>
      <WeeklySquad
        slots={slots.map((slot) => ({
          position: slot.position,
          card: slot.card,
        }))}
      />
    </main>
  );
}
