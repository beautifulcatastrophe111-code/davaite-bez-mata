import type { PlayerCard } from '@prisma/client';
import StatInput from './StatInput';
import { countryCodes } from '@/lib/constants';

export default function AdminCardForm({initial}:{initial?:PlayerCard}){return <>
<input name='nickname' placeholder='Nickname' className='text-black p-2 rounded' required defaultValue={initial?.nickname}/>
<select name='country' className='text-black p-2 rounded' defaultValue={initial?.country||''}><option value=''>Country</option>{countryCodes.map(code=><option key={code} value={code}>{String.fromCodePoint(...[...code].map(c=>127397+c.charCodeAt(0)))} {new Intl.DisplayNames(['en'], { type: 'region' }).of(code)}</option>)}</select>
<input name='photoUrl' placeholder='Avatar image URL' className='text-black p-2 rounded' defaultValue={initial?.photoUrl||''}/>
<input name='rating' type='number' defaultValue={initial?.rating||50} min={1} max={99} className='text-black p-2 rounded' />
<select name='role' className='text-black p-2 rounded' defaultValue={initial?.role||'UNIVERSAL'}><option>CARRY</option><option>MID</option><option>OFFLANE</option><option>SUPPORT</option><option>HARD_SUPPORT</option><option>UNIVERSAL</option></select>
<p className='text-xs text-slate-300'>Card type is assigned automatically from rating.</p>
<StatInput name='skillLaning' label='Lane' defaultValue={initial?.skillLaning||50}/><StatInput name='skillMicro' label='Micro' defaultValue={initial?.skillMicro||50}/><StatInput name='skillMacro' label='Macro' defaultValue={initial?.skillMacro||50}/><StatInput name='skillFarming' label='Itembuilding' defaultValue={initial?.skillFarming||50}/><StatInput name='skillHeroPool' label='Pool' defaultValue={initial?.skillHeroPool||50}/><StatInput name='skillMental' label='Mentality' defaultValue={initial?.skillMental||50}/>
<input type='hidden' name='isActive' value={String(initial?.isActive ?? true)}/>
</>}
