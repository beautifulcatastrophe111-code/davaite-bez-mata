import type { SquadPosition } from '@prisma/client';
import AdminLayout from '@/components/AdminLayout';
import { updateWeeklySquad } from '@/app/actions';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const positions: SquadPosition[] = ['CARRY', 'MID', 'OFFLANE', 'SUPPORT', 'HARD_SUPPORT'];

function getCurrentWeekStart(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function weekLabel(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export default async function Page() {
  requireAdmin();

  const cards = await prisma.playerCard.findMany({ where: { isActive: true }, orderBy: { rating: 'desc' } });
  const currentWeekStart = getCurrentWeekStart();

  let weeks: { id: string; weekStart: Date; slots: { position: SquadPosition; cardId: string | null; card: { nickname: string } | null }[] }[] = [];
  let isLegacyMode = false;
  try {
    weeks = await prisma.weeklySquad.findMany({
      orderBy: { weekStart: 'desc' },
      include: { slots: { include: { card: true } } },
    });
  } catch {
    isLegacyMode = true;
    const slots = await prisma.weeklySquadSlot.findMany({ include: { card: true } });
    weeks = [{ id: 'legacy', weekStart: currentWeekStart, slots: slots.map((s) => ({ position: s.position as SquadPosition, cardId: s.cardId, card: s.card ? { nickname: s.card.nickname } : null })) }];
  }

  const currentWeek = weeks.find((w) => w.weekStart.getTime() === currentWeekStart.getTime());
  const selectedCardsByPosition = new Map<SquadPosition, string | null>(
    (currentWeek?.slots ?? []).map((slot) => [slot.position, slot.cardId]),
  );

  const pastWeeks = weeks.filter((w) => w.weekStart.getTime() !== currentWeekStart.getTime());

  return (
    <AdminLayout>
      <h2>Weekly (текущая неделя: {weekLabel(currentWeekStart)})</h2>
      <p className="text-slate-400">{isLegacyMode ? 'Legacy режим: таблицы по неделям ещё не применены в БД.' : 'Редактируется только текущая неделя. Прошлые недели зафиксированы.'}</p>

      <form action={updateWeeklySquad} className="grid gap-2 surface">
        {positions.map((position) => (
          <label key={position}>
            {position}
            <select name={position} defaultValue={selectedCardsByPosition.get(position) || ''} className="text-black ml-2">
              <option value="">Empty</option>
              {cards.map((card) => (
                <option value={card.id} key={card.id}>{card.nickname}</option>
              ))}
            </select>
          </label>
        ))}
        <button>Save</button>
      </form>

      {pastWeeks.length > 0 && (
        <div className="mt-6 grid gap-3">
          <h3>Прошлые недели</h3>
          {pastWeeks.map((week) => (
            <details key={week.id} className="surface">
              <summary className="cursor-pointer">Неделя от {weekLabel(week.weekStart)}</summary>
              <ul className="mt-2 mb-0">
                {positions.map((position) => {
                  const slot = week.slots.find((s) => s.position === position);
                  return <li key={position}><strong>{position}:</strong> {slot?.card?.nickname ?? 'Empty'}</li>;
                })}
              </ul>
            </details>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
