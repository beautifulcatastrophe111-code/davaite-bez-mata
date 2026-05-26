import { PlayerCard as T } from '@prisma/client';
import PlayerCard from './PlayerCard';

export default function WeeklySquad({slots}:{slots:{position:string; card?:T|null}[]}){return <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center'>{slots.map(s=><div key={s.position} className='surface w-full flex flex-col items-center gap-3'><div className='text-xs tracking-widest text-slate-300'>{s.position}</div>{s.card ? <PlayerCard card={s.card}/> : <div className='w-[300px] h-[450px] rounded-2xl border border-dashed border-slate-600 grid place-items-center text-slate-400'>Empty slot</div>}</div>)}</div>}
