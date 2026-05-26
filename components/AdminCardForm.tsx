import StatInput from './StatInput';
import { countryCodes } from '@/lib/constants';
export default function AdminCardForm(){return <>
<input name='realName' placeholder='Real name' className='text-black p-2 rounded' required/>
<input name='nickname' placeholder='Nickname' className='text-black p-2 rounded' required/>
<select name='country' className='text-black p-2 rounded' defaultValue=''><option value=''>Country</option>{countryCodes.map(code=><option key={code} value={code}>{String.fromCodePoint(...[...code].map(c=>127397+c.charCodeAt(0)))} {new Intl.DisplayNames(['en'], { type: 'region' }).of(code)}</option>)}</select>
<input name='photoUrl' placeholder='Avatar image URL' className='text-black p-2 rounded' />
<input name='rating' type='number' defaultValue={50} min={1} max={99} className='text-black p-2 rounded' />
<select name='role' className='text-black p-2 rounded'><option>CARRY</option><option>MID</option><option>OFFLANE</option><option>SUPPORT</option><option>HARD_SUPPORT</option><option>UNIVERSAL</option></select>
<p className='text-xs text-slate-300'>Card type is assigned automatically from rating.</p>
<StatInput name='skillLaning' label='Lane'/><StatInput name='skillMicro' label='Micro'/><StatInput name='skillMacro' label='Macro'/><StatInput name='skillFarming' label='Itembuilding'/><StatInput name='skillHeroPool' label='Pool'/><StatInput name='skillMental' label='Mentality'/>
<input type='hidden' name='isActive' value='true'/>
</>}
