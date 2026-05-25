import AdminLayout from '@/components/AdminLayout'; import { requireAdmin } from '@/lib/auth';
export default function Page(){requireAdmin(); return <AdminLayout><h1>Settings</h1></AdminLayout>}
