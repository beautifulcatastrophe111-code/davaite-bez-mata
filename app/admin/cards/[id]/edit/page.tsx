import { notFound } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import AdminCardForm from '@/components/AdminCardForm';
import { updatePlayerCard } from '@/app/actions';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function Page({ params }: { params: { id: string } }) {
  requireAdmin();

  const card = await prisma.playerCard.findUnique({
    where: { id: params.id },
  });

  if (!card) notFound();

  const action = updatePlayerCard.bind(null, params.id);

  return (
    <AdminLayout>
      <form action={action} className="grid gap-2 max-w-xl">
        <AdminCardForm card={card} />
        <button>Save</button>
      </form>
    </AdminLayout>
  );
}
