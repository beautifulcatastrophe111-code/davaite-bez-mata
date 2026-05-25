import type { SquadPosition } from '@prisma/client';
import WeeklySquad from '@/components/WeeklySquad';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const positions: SquadPosition[] = [
  'CARRY',
  'MID',
  'OFFLANE',
  'SUPPORT',
  'HARD_SUPPORT',
  'COACH',
];

export default async function Page() {
  const slots = await prisma.weeklySquadSlot.findMany({
    include: { card: true },
  });

  const slotsByPosition = new Map(slots.map((slot) => [slot.position, slot.card]));

  return (
    <main>
      <h1>Weekly Squad</h1>
      <WeeklySquad
        slots={positions.map((position) => {
          const card = slotsByPosition.get(position);

          return {
            position,
            nickname: card?.nickname,
          };
        })}
      />
    </main>
  );
}
