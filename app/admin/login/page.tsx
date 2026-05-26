import { loginAdmin } from '@/lib/auth'; import { redirect } from 'next/navigation';
async function act(formData:FormData){'use server'; const ok=await loginAdmin(String(formData.get('login')||''),String(formData.get('password')||'')); if(ok) redirect('/admin');}
export default function Page(){return <main className='max-w-md mx-auto'><form action={act} className='surface space-y-3'><h1>Admin login</h1><input name='login' className='w-full' placeholder='Login'/><input name='password' type='password' className='w-full' placeholder='Password'/><button>Login</button></form></main>}
