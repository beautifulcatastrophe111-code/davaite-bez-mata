'use server';

import { revalidatePath } from 'next/cache';
import type { SquadPosition } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { playerCardSchema, weeklySchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';

async function createUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.playerCard.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createPlayerCard(formData: FormData) {
  requireAdmin();

  const data = playerCardSchema.parse(Object.fromEntries(formData));
  const slug = await createUniqueSlug(data.slug);

  await prisma.playerCard.create({
    data: {
      ...data,
      slug,
      photoUrl: data.photoUrl || null,
      rank: data.rank || null,
    },
  });

  revalidatePath('/cards');
  revalidatePath('/admin/cards');
}

export async function updatePlayerCard(id: string, formData: FormData) {
  requireAdmin();

  const data = playerCardSchema.parse(Object.fromEntries(formData));

  await prisma.playerCard.update({
    where: { id },
    data: {
      ...data,
      photoUrl: data.photoUrl || null,
      rank: data.rank || null,
    },
  });

  revalidatePath('/cards');
  revalidatePath(`/cards/${data.slug}`);
  revalidatePath('/admin/cards');
}

export async function deletePlayerCard(id: string) {
  requireAdmin();
  await prisma.playerCard.delete({ where: { id } });
  revalidatePath('/cards');
  revalidatePath('/admin/cards');
}

export async function togglePlayerCardActive(id: string, isActive: boolean) {
  requireAdmin();
  await prisma.playerCard.update({ where: { id }, data: { isActive } });
  revalidatePath('/cards');
  revalidatePath('/admin/cards');
}

export async function updateWeeklySquad(formData: FormData) {
  requireAdmin();

  const parsed = weeklySchema.parse(Object.fromEntries(formData));

  await Promise.all(
    Object.entries(parsed).map(([position, cardId]) =>
      prisma.weeklySquadSlot.upsert({
        where: { position: position as SquadPosition },
        update: { cardId: cardId || null },
        create: { position: position as SquadPosition, cardId: cardId || null },
      }),
    ),
  );

  revalidatePath('/weekly-squad');
  revalidatePath('/admin/weekly-squad');
}

export async function getPlayerCards() {
  return prisma.playerCard.findMany();
}

export async function getPlayerCardBySlug(slug: string) {
  return prisma.playerCard.findUnique({ where: { slug } });
}
