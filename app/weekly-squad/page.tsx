import { prisma } from '@/lib/prisma'; import WeeklySquad from '@/components/WeeklySquad';
export default async function Page(){const slots=await prisma.weeklySquadSlot.findMany({include:{card:true}}); return <main><h1>Weekly Squad</h1><WeeklySquad slots={slots.map(s=>({position:s.position,nickname:s.card?.nickname}))}/></main>}
