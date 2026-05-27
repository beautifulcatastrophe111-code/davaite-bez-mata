import WeeklySquad from '@/components/WeeklySquad';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function weekLabel(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export default async function Page() {
  const weeks = await prisma.weeklySquad.findMany({
    orderBy: { weekStart: 'desc' },
    include: { slots: { include: { card: true }, orderBy: { position: 'asc' } } },
  });

  return (
    <main>
      <h1>Weekly</h1>
      {weeks.length === 0 ? <p>Пока нет Weekly составов.</p> : (
        <div className="grid gap-4">
          {weeks.map((week, i) => (
            <details key={week.id} open={i === 0} className="surface">
              <summary className="cursor-pointer font-semibold">Неделя от {weekLabel(week.weekStart)}</summary>
              <div className="mt-3">
                <WeeklySquad slots={week.slots.map((slot) => ({ position: slot.position, card: slot.card }))} />
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
