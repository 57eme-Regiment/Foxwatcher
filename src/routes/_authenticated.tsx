import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { authClient } from '@/lib/auth';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data?.session)
      throw redirect({ to: LINKS.unauthenticated.to });

    const access = await accessClient.getMyAccess();
    if (!accessClient.hasPermission(access, LINKS.index.permission)) {
      throw redirect({ to: LINKS.forbidden.to });
    }
    return { access };
  },
  component: () => <Outlet />,
});
