import WeeklySquad from '@/components/WeeklySquad';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function weekLabel(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export default async function Page() {
  let weeks: { id: string; weekStart: Date; slots: { position: string; card: any }[] }[] = [];
  try {
    weeks = await prisma.weeklySquad.findMany({
      orderBy: { weekStart: 'desc' },
      include: { slots: { include: { card: true }, orderBy: { position: 'asc' } } },
    });
  } catch {
    const slots = await prisma.$queryRaw<Array<{ position: string; nickname: string | null; rating: number | null; slug: string | null; role: string | null; country: string | null; cardtype: string | null; photourl: string | null; skilllaning: number | null; skillmicro: number | null; skillmacro: number | null; skillfarming: number | null; skillheropool: number | null; skillmental: number | null }>>`
      SELECT
        wss.position::text AS position,
        pc.nickname,
        pc.rating,
        pc.slug,
        pc.role::text AS role,
        pc.country,
        pc."cardType"::text AS cardtype,
        pc."photoUrl" AS photourl,
        pc."skillLaning" AS skilllaning,
        pc."skillMicro" AS skillmicro,
        pc."skillMacro" AS skillmacro,
        pc."skillFarming" AS skillfarming,
        pc."skillHeroPool" AS skillheropool,
        pc."skillMental" AS skillmental
      FROM "WeeklySquadSlot" wss
      LEFT JOIN "PlayerCard" pc ON pc.id = wss."cardId"
      ORDER BY wss.position::text ASC
    `;
    const now = new Date();
    weeks = [{ id: 'legacy', weekStart: now, slots: slots.map((s) => ({ position: s.position, card: s.nickname ? {
      nickname: s.nickname, rating: s.rating ?? 50, slug: s.slug ?? '', role: s.role ?? 'UNIVERSAL', country: s.country ?? null, cardType: s.cardtype ?? 'COMMON', photoUrl: s.photourl ?? null,
      skillLaning: s.skilllaning ?? 50, skillMicro: s.skillmicro ?? 50, skillMacro: s.skillmacro ?? 50, skillFarming: s.skillfarming ?? 50, skillHeroPool: s.skillheropool ?? 50, skillMental: s.skillmental ?? 50,
    } : null })) }];
  }

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
