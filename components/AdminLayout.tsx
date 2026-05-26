import Link from 'next/link';
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className='p-6'><nav className='flex gap-3 mb-4'><Link href='/admin' className='btn-link'>Dashboard</Link><Link href='/admin/cards' className='btn-link'>Cards</Link><Link href='/admin/weekly-squad' className='btn-link'>Weekly</Link></nav>{children}</div>}
