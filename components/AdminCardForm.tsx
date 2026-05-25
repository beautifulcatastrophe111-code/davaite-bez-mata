import type { PlayerCard } from '@prisma/client';
import StatInput from './StatInput';

type AdminCardFormProps = {
  card?: PlayerCard | null;
};

export default function AdminCardForm({ card }: AdminCardFormProps) {
  return (
    <>
      <input
        name="realName"
        placeholder="Real name"
        defaultValue={card?.realName || ''}
        className="text-black p-2 rounded"
        required
      />
      <input
        name="nickname"
        placeholder="Nickname"
        defaultValue={card?.nickname || ''}
        className="text-black p-2 rounded"
        required
      />
      <input
        name="slug"
        placeholder="slug, optional"
        defaultValue={card?.slug || ''}
        className="text-black p-2 rounded"
      />
      <input
        name="country"
        placeholder="Country (e.g. Ukraine)"
        defaultValue={card?.country || ''}
        className="text-black p-2 rounded"
      />
      <input
        name="photoUrl"
        placeholder="Avatar image URL"
        defaultValue={card?.photoUrl || ''}
        className="text-black p-2 rounded"
      />
      <input
        name="rating"
        type="number"
        defaultValue={card?.rating ?? 50}
        min={1}
        max={99}
        className="text-black p-2 rounded"
      />
      <select name="role" defaultValue={card?.role || 'CARRY'} className="text-black p-2 rounded">
        <option>CARRY</option>
        <option>MID</option>
        <option>OFFLANE</option>
        <option>SUPPORT</option>
        <option>HARD_SUPPORT</option>
        <option>UNIVERSAL</option>
      </select>
      <p className="text-xs text-slate-300">Card type is assigned automatically from rating.</p>

      <StatInput name="skillLaning" label="Lane" defaultValue={card?.skillLaning ?? 50} />
      <StatInput name="skillMicro" label="Micro" defaultValue={card?.skillMicro ?? 50} />
      <StatInput name="skillMacro" label="Macro" defaultValue={card?.skillMacro ?? 50} />
      <StatInput name="skillFarming" label="Itembuilding" defaultValue={card?.skillFarming ?? 50} />
      <StatInput name="skillHeroPool" label="Pool" defaultValue={card?.skillHeroPool ?? 50} />
      <StatInput name="skillMental" label="Mentality" defaultValue={card?.skillMental ?? 50} />

      <input type="hidden" name="skillFighting" value={card?.skillFighting ?? 50} />
      <input type="hidden" name="skillComms" value={card?.skillComms ?? 50} />
      <input type="hidden" name="cardType" value={card?.cardType || 'COMMON'} />
      <input type="hidden" name="isActive" value={String(card?.isActive ?? true)} />
    </>
  );
}
