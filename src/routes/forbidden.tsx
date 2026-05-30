/* eslint-disable react-refresh/only-export-components */
import { IconLock } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <IconLock className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accès refusé</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
