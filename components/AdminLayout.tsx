import Link from 'next/link';
export default function AdminLayout({children}:{children:React.ReactNode}){return <main><nav className='flex flex-wrap gap-3 mb-5'><Link href='/admin' className='btn-link'>Dashboard</Link><Link href='/admin/cards' className='btn-link'>Cards</Link><Link href='/admin/weekly-squad' className='btn-link'>Weekly</Link></nav>{children}</main>}
