import { loginAdmin } from '@/lib/auth'; import { redirect } from 'next/navigation';
async function act(formData:FormData){'use server'; const ok=await loginAdmin(String(formData.get('login')||''),String(formData.get('password')||'')); if(ok) redirect('/admin');}
export default function Page(){return <form action={act} className='space-y-2 max-w-sm'><h1>Admin login</h1><input name='login' className='text-black p-2 rounded w-full'/><input name='password' type='password' className='text-black p-2 rounded w-full'/><button>Login</button></form>}
