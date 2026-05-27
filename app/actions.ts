'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { playerCardSchema, weeklySchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';

function slugifyNickname(nickname:string){const slug=nickname.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,''); return slug||'player';}
function getCardTypeByRating(rating:number){if(rating>=95) return 'IMMORTAL'; if(rating>=85) return 'LEGENDARY'; if(rating>=75) return 'EPIC'; if(rating>=65) return 'RARE'; return 'COMMON';}
async function buildUniqueSlug(nickname:string,excludeId?:string){const base=slugifyNickname(nickname); let slug=base; let i=1; while(true){const found=await prisma.playerCard.findUnique({where:{slug}}); if(!found || found.id===excludeId) return slug; i+=1; slug=`${base}-${i}`;}}

export async function createPlayerCard(formData: FormData){requireAdmin(); const data=playerCardSchema.parse(Object.fromEntries(formData)); const slug=await buildUniqueSlug(data.nickname); await prisma.playerCard.create({data:{...data,realName:data.nickname,slug,cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); revalidatePath('/admin/cards');}
export async function updatePlayerCard(id:string, formData:FormData){requireAdmin(); const existing=await prisma.playerCard.findUnique({where:{id}}); const data=playerCardSchema.parse(Object.fromEntries(formData)); const slug=await buildUniqueSlug(data.nickname,id); await prisma.playerCard.update({where:{id},data:{...data,realName:data.nickname,slug,cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); revalidatePath('/admin/cards'); if(existing) revalidatePath(`/cards/${existing.slug}`); revalidatePath(`/cards/${slug}`); redirect('/admin/cards');}
export async function deletePlayerCard(id:string){requireAdmin(); await prisma.playerCard.delete({where:{id}}); revalidatePath('/cards'); revalidatePath('/admin/cards');}
export async function togglePlayerCardActive(id:string,isActive:boolean){requireAdmin(); await prisma.playerCard.update({where:{id},data:{isActive}}); revalidatePath('/cards');}
export async function updateWeeklySquad(formData:FormData){requireAdmin(); const parsed=weeklySchema.parse(Object.fromEntries(formData)); await Promise.all(Object.entries(parsed).map(([position,cardId])=>prisma.weeklySquadSlot.upsert({where:{position:position as any},update:{cardId:cardId||null},create:{position:position as any,cardId:cardId||null}}))); revalidatePath('/weekly-squad'); revalidatePath('/admin'); redirect('/admin');}
export async function getPlayerCards(){ return prisma.playerCard.findMany(); }
export async function getPlayerCardBySlug(slug:string){ return prisma.playerCard.findUnique({where:{slug}}); }
