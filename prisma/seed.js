const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const players = Array.from({ length: 6 }).map((_, i) => ({
    slug: `player-${i + 1}`,
    realName: `Player ${i + 1}`,
    nickname: `Nick${i + 1}`,
    rating: 60 + i,
    role: ['CARRY','MID','OFFLANE','SUPPORT','HARD_SUPPORT','UNIVERSAL'][i],
    cardType: ['COMMON','RARE','EPIC','LEGENDARY','IMMORTAL','COMMON'][i],
    isActive: true
  }));
  for (const p of players) await prisma.playerCard.upsert({ where: { slug: p.slug }, update: p, create: p });
}
main().finally(() => prisma.$disconnect());
