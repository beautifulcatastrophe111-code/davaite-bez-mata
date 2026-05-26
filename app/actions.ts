'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { playerCardSchema, weeklySchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';

function slugifyNickname(nickname:string){return nickname.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function getCardTypeByRating(rating:number){if(rating>=95) return 'IMMORTAL'; if(rating>=85) return 'LEGENDARY'; if(rating>=75) return 'EPIC'; if(rating>=65) return 'RARE'; return 'COMMON';}

export async function createPlayerCard(formData: FormData){requireAdmin(); const data=playerCardSchema.parse(Object.fromEntries(formData)); await prisma.playerCard.create({data:{...data,realName:data.nickname,slug:slugifyNickname(data.nickname),cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); revalidatePath('/admin/cards');}
export async function updatePlayerCard(id:string, formData:FormData){requireAdmin(); const existing=await prisma.playerCard.findUnique({where:{id}}); const data=playerCardSchema.parse(Object.fromEntries(formData)); await prisma.playerCard.update({where:{id},data:{...data,realName:data.nickname,slug:slugifyNickname(data.nickname),cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); if(existing) revalidatePath(`/cards/${existing.slug}`); revalidatePath(`/cards/${slugifyNickname(data.nickname)}`);}
export async function deletePlayerCard(id:string){requireAdmin(); await prisma.playerCard.delete({where:{id}}); revalidatePath('/cards'); revalidatePath('/admin/cards');}
export async function togglePlayerCardActive(id:string,isActive:boolean){requireAdmin(); await prisma.playerCard.update({where:{id},data:{isActive}}); revalidatePath('/cards');}
export async function updateWeeklySquad(formData:FormData){requireAdmin(); const parsed=weeklySchema.parse(Object.fromEntries(formData)); await Promise.all(Object.entries(parsed).map(([position,cardId])=>prisma.weeklySquadSlot.upsert({where:{position:position as any},update:{cardId:cardId||null},create:{position:position as any,cardId:cardId||null}}))); revalidatePath('/weekly-squad');}
export async function getPlayerCards(){ return prisma.playerCard.findMany(); }
export async function getPlayerCardBySlug(slug:string){ return prisma.playerCard.findUnique({where:{slug}}); }
