'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { playerCardSchema, weeklySchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';

function slugifyNickname(nickname:string){const cyr:{[k:string]:string}={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
const translit=nickname.toLowerCase().split('').map((ch)=>cyr[ch]??ch).join('');
const slug=translit.trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); return slug||'player';}
function getCardTypeByRating(rating:number){if(rating>=95) return 'IMMORTAL'; if(rating>=85) return 'LEGENDARY'; if(rating>=75) return 'EPIC'; if(rating>=65) return 'RARE'; return 'COMMON';}
async function buildUniqueSlug(nickname:string,excludeId?:string){const base=slugifyNickname(nickname); let slug=base; let i=1; while(true){const found=await prisma.playerCard.findUnique({where:{slug}}); if(!found || found.id===excludeId) return slug; i+=1; slug=`${base}-${i}`;}}

export async function createPlayerCard(formData: FormData){requireAdmin(); const data=playerCardSchema.parse(Object.fromEntries(formData)); const duplicate=await prisma.playerCard.findFirst({where:{nickname:{equals:data.nickname,mode:'insensitive'}}}); if(duplicate) redirect('/admin/cards?notice=duplicate_card'); const slug=await buildUniqueSlug(data.nickname); await prisma.playerCard.create({data:{...data,realName:data.nickname,slug,cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); revalidatePath('/admin/cards'); redirect('/admin/cards?notice=card_created');}
export async function updatePlayerCard(id:string, formData:FormData){requireAdmin(); const existing=await prisma.playerCard.findUnique({where:{id}}); const data=playerCardSchema.parse(Object.fromEntries(formData)); const duplicate=await prisma.playerCard.findFirst({where:{nickname:{equals:data.nickname,mode:'insensitive'},NOT:{id}}}); if(duplicate) redirect('/admin/cards?notice=duplicate_card'); const slug=await buildUniqueSlug(data.nickname,id); await prisma.playerCard.update({where:{id},data:{...data,realName:data.nickname,slug,cardType:getCardTypeByRating(data.rating) as any,photoUrl:data.photoUrl||null,rank:data.rank||null}}); revalidatePath('/cards'); revalidatePath('/admin/cards'); if(existing) revalidatePath(`/cards/${existing.slug}`); revalidatePath(`/cards/${slug}`); redirect('/admin/cards?notice=card_updated');}
export async function deletePlayerCard(id:string){requireAdmin(); await prisma.playerCard.delete({where:{id}}); revalidatePath('/cards'); revalidatePath('/admin/cards');}
export async function togglePlayerCardActive(id:string,isActive:boolean){requireAdmin(); await prisma.playerCard.update({where:{id},data:{isActive}}); revalidatePath('/cards');}
export async function updateWeeklySquad(formData:FormData){requireAdmin(); const parsed=weeklySchema.parse(Object.fromEntries(formData)); await Promise.all(Object.entries(parsed).map(([position,cardId])=>prisma.weeklySquadSlot.upsert({where:{position:position as any},update:{cardId:cardId||null},create:{position:position as any,cardId:cardId||null}}))); revalidatePath('/weekly-squad'); revalidatePath('/admin'); redirect('/admin?notice=weekly_saved');}
export async function getPlayerCards(){ return prisma.playerCard.findMany(); }
export async function getPlayerCardBySlug(slug:string){ return prisma.playerCard.findUnique({where:{slug}}); }
