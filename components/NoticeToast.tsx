'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const messages: Record<string,string> = {
  card_created: 'Карточка создана!',
  card_updated: 'Карточка обновлена!',
  weekly_saved: 'Weekly squad сохранен!',
  duplicate_card: 'Карточка с таким никнеймом уже существует.',
};

export default function NoticeToast(){
  const search=useSearchParams();
  const notice=search.get('notice')||'';
  const text=useMemo(()=>messages[notice]||'', [notice]);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{if(text){setVisible(true); const t=setTimeout(()=>setVisible(false),2600); return ()=>clearTimeout(t);} setVisible(false);},[text]);
  if(!text || !visible) return null;
  return <div className='fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-slate-800 border border-slate-600 px-4 py-2 shadow-2xl'>{text}</div>;
}
