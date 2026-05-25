'use server';

import { revalidatePath } from 'next/cache';
import type { SquadPosition } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { playerCardSchema, weeklySchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'player-card';
}

async function getUniqueSlug(baseValue: string, currentCardId?: string) {
  const baseSlug = slugify(baseValue);
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.playerCard.findFirst({
      where: {
        slug,
        ...(currentCardId ? { id: { not: currentCardId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createPlayerCard(formData: FormData) {
  requireAdmin();

  const data = playerCardSchema.parse(Object.fromEntries(formData));
  const slug = await getUniqueSlug(data.slug || data.nickname);

  await prisma.playerCard.create({
    data: {
      ...data,
      slug,
      photoUrl: data.photoUrl || null,
      country: data.country || null,
      rank: data.rank || null,
    },
  });

  revalidatePath('/');
  revalidatePath('/cards');
  revalidatePath('/admin/cards');
  revalidatePath(`/cards/${slug}`);
}

export async function updatePlayerCard(id: string, formData: FormData) {
  requireAdmin();

  const data = playerCardSchema.parse(Object.fromEntries(formData));
  const slug = await getUniqueSlug(data.slug || data.nickname, id);

  await prisma.playerCard.update({
    where: { id },
    data: {
      ...data,
      slug,
      photoUrl: data.photoUrl || null,
      country: data.country || null,
      rank: data.rank || null,
    },
  });

  revalidatePath('/');
  revalidatePath('/cards');
  revalidatePath(`/cards/${slug}`);
  revalidatePath('/admin/cards');
}

export async function deletePlayerCard(id: string) {
  requireAdmin();
  await prisma.playerCard.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/cards');
  revalidatePath('/admin/cards');
}

export async function togglePlayerCardActive(id: string, isActive: boolean) {
  requireAdmin();
  await prisma.playerCard.update({ where: { id }, data: { isActive } });
  revalidatePath('/');
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
