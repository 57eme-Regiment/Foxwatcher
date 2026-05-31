import { UserSessionsGrid } from '@/components/user/UserSessionsGrid';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createLazyFileRoute(
  '/_authenticated/_wanshitong/wanshitong/users/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users'], //TODO implemente queryFactory patterne
    queryFn: async () => {
      const res = await WanApi.adminUsers.getAll();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch users');
      return res.body;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="animate-spin mr-2" />
        Chargement des utilisateurs…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Impossible de charger les utilisateurs.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          {data.length} compte{data.length !== 1 ? 's' : ''} — cliquez sur ▶ pour voir les sessions
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <UserSessionsGrid users={data} />
      </div>
    </div>
  );
}
