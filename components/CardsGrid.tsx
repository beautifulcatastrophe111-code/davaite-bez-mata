import Link from 'next/link';
import { PlayerCard as T } from '@prisma/client';
import PlayerCard from './PlayerCard';
export default function CardsGrid({cards}:{cards:T[]}){return <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>{cards.map(c=><Link key={c.id} href={`/cards/${c.slug}`}><PlayerCard card={c}/></Link>)}</div>}
