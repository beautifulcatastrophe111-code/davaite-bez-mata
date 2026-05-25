import { z } from 'zod';
import { ranks, roles, squadPositions } from './constants';
const stat = z.coerce.number().int().min(1).max(99).default(50);
export const playerCardSchema = z.object({
  realName: z.string().min(1), nickname: z.string().min(1),
  photoUrl: z.string().optional().or(z.literal('')), rating: stat, role: z.enum(roles), country: z.string().optional(), rank: z.enum(ranks).optional().nullable(),
  favoriteHero: z.string().optional(), team: z.string().optional(), description: z.string().optional(),
  isActive: z.coerce.boolean().default(true), skillLaning: stat, skillMacro: stat, skillMicro: stat, skillFighting: stat, skillHeroPool: stat, skillMental: stat,
});
export const weeklySchema = z.record(z.enum(squadPositions), z.string().optional());
