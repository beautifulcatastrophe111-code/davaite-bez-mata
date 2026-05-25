import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
const SESSION='admin_session';
export async function loginAdmin(login:string,password:string){
  const ok = login===process.env.ADMIN_LOGIN && await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH||'');
  if(!ok) return false; cookies().set(SESSION,'1',{httpOnly:true,sameSite:'lax',path:'/'}); return true;
}
export function logoutAdmin(){cookies().delete(SESSION)}
export function requireAdmin(){ if(!cookies().get(SESSION)?.value) redirect('/admin/login'); }
