import StatInput from './StatInput';
export default function AdminCardForm(){return <>
<input name='realName' placeholder='Real name' className='text-black p-2 rounded' required/>
<input name='nickname' placeholder='Nickname' className='text-black p-2 rounded' required/>
<input name='slug' placeholder='slug' className='text-black p-2 rounded' required/>
<input name='country' placeholder='Country (e.g. Ukraine)' className='text-black p-2 rounded' />
<input name='photoUrl' placeholder='Avatar image URL' className='text-black p-2 rounded' />
<input name='rating' type='number' defaultValue={50} min={1} max={99} className='text-black p-2 rounded' />
<select name='role' className='text-black p-2 rounded'><option>CARRY</option><option>MID</option><option>OFFLANE</option><option>SUPPORT</option><option>HARD_SUPPORT</option><option>UNIVERSAL</option></select>
<select name='cardType' className='text-black p-2 rounded'><option>COMMON</option><option>RARE</option><option>EPIC</option><option>LEGENDARY</option><option>IMMORTAL</option></select>
<StatInput name='skillLaning' label='Lane'/><StatInput name='skillMicro' label='Micro'/><StatInput name='skillMacro' label='Macro'/><StatInput name='skillFarming' label='Itembuilds'/><StatInput name='skillHeroPool' label='Pool'/><StatInput name='skillMental' label='Mentality'/>
<input type='hidden' name='isActive' value='true'/>
</>}
