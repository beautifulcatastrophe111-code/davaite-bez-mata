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
        placeholder="slug"
        defaultValue={card?.slug || ''}
        className="text-black p-2 rounded"
        required
      />
      <input
        name="photoUrl"
        placeholder="Photo URL / avatar URL"
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
      <select name="cardType" defaultValue={card?.cardType || 'COMMON'} className="text-black p-2 rounded">
        <option>COMMON</option>
        <option>RARE</option>
        <option>EPIC</option>
        <option>LEGENDARY</option>
        <option>IMMORTAL</option>
      </select>

      <StatInput name="skillLaning" label="Laning" defaultValue={card?.skillLaning ?? 50} />
      <StatInput name="skillFarming" label="Farming" defaultValue={card?.skillFarming ?? 50} />
      <StatInput name="skillMacro" label="Macro" defaultValue={card?.skillMacro ?? 50} />
      <StatInput name="skillMicro" label="Micro" defaultValue={card?.skillMicro ?? 50} />
      <StatInput name="skillHeroPool" label="Hero Pool" defaultValue={card?.skillHeroPool ?? 50} />

      <input type="hidden" name="skillFighting" value={card?.skillFighting ?? 50} />
      <input type="hidden" name="skillMental" value={card?.skillMental ?? 50} />
      <input type="hidden" name="skillComms" value={card?.skillComms ?? 50} />
      <input type="hidden" name="isActive" value={String(card?.isActive ?? true)} />
    </>
  );
}
