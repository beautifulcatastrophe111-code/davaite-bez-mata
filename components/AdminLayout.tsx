import Link from 'next/link';
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className='p-6'><nav className='flex gap-3 mb-4'><Link href='/admin'>Dashboard</Link><Link href='/admin/cards'>Cards</Link><Link href='/admin/weekly-squad'>Weekly</Link></nav>{children}</div>}
