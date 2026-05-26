import './globals.css';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='en'><body className='min-h-screen'><div className='max-w-[1400px] mx-auto p-6'><header className='mb-6'><Link href='/' className='inline-block'><h1 className='text-2xl font-bold'>Давайте жить дружно</h1></Link></header><Breadcrumbs/>{children}</div></body></html>}
