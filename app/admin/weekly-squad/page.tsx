import type { SquadPosition } from '@prisma/client';
import AdminLayout from '@/components/AdminLayout';
import { updateWeeklySquad } from '@/app/actions';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const positions: SquadPosition[] = [
  'CARRY',
  'MID',
  'OFFLANE',
  'SUPPORT',
  'HARD_SUPPORT',
  'COACH',
];

export default async function Page() {
  requireAdmin();

  const cards = await prisma.playerCard.findMany({
    where: { isActive: true },
    orderBy: { rating: 'desc' },
  });

  const slots = await prisma.weeklySquadSlot.findMany();
  const selectedCardsByPosition = new Map<SquadPosition, string | null>(
    slots.map((slot) => [slot.position, slot.cardId]),
  );

  return (
    <AdminLayout>
      <form action={updateWeeklySquad} className="grid gap-2">
        {positions.map((position) => (
          <label key={position}>
            {position}
            <select
              name={position}
              defaultValue={selectedCardsByPosition.get(position) || ''}
              className="text-black ml-2"
            >
              <option value="">Empty</option>
              {cards.map((card) => (
                <option value={card.id} key={card.id}>
                  {card.nickname}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button>Save</button>
      </form>
    </AdminLayout>
  );
}
