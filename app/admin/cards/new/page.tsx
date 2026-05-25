import AdminLayout from '@/components/AdminLayout'; import AdminCardForm from '@/components/AdminCardForm'; import { createPlayerCard } from '@/app/actions'; import { requireAdmin } from '@/lib/auth';
export default function Page(){requireAdmin(); return <AdminLayout><form action={createPlayerCard} className='grid gap-2 max-w-xl'><AdminCardForm/><button>Create</button></form></AdminLayout>}
