import { authClient } from '@/lib/auth';
import { IconLockQuestion } from '@tabler/icons-react';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/unauthenticated')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data?.session) throw redirect({ to: '/' });
  },
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <IconLockQuestion className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Authentification requise
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Vous avez besoin d'être authentifier pour accéder à cette page.
          </p>
        </div>
      </div>
    </div>
  );
}
