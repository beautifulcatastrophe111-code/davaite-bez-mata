import { PlayerCard as T } from '@prisma/client';

const styles = {
  COMMON: 'from-slate-700',
  RARE: 'from-blue-700',
  EPIC: 'from-purple-700',
  LEGENDARY: 'from-amber-600',
  IMMORTAL: 'from-red-700',
};

export default function PlayerCard({ card }: { card: T }) {
  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br ${styles[card.cardType]} to-slate-900 border border-slate-500`}>
      <div className="flex justify-between gap-3">
        <div>
          <b>{card.nickname}</b>
          <p className="text-sm">{card.realName}</p>
          <p className="text-xs">{card.role}</p>
        </div>
        <span className="text-2xl font-bold">{card.rating}</span>
      </div>

      {card.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.photoUrl}
          alt={card.nickname}
          className="mt-3 h-40 w-full rounded-lg object-cover object-center bg-slate-800"
        />
      ) : (
        <div className="mt-3 flex h-40 w-full items-center justify-center rounded-lg bg-slate-800 text-4xl font-bold text-slate-500">
          {card.nickname.slice(0, 1).toUpperCase()}
        </div>
      )}

      <div className="grid grid-cols-2 text-xs mt-3 gap-1">
        <span>LAN {card.skillLaning}</span>
        <span>FRM {card.skillFarming}</span>
        <span>MAC {card.skillMacro}</span>
        <span>MIC {card.skillMicro}</span>
        <span>FGT {card.skillFighting}</span>
        <span>POOL {card.skillHeroPool}</span>
      </div>
    </div>
  );
}
