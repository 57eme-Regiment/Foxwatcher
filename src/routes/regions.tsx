import { accessClient } from '@/lib/access';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { authClient } from '@/lib/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/regions')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session) throw redirect({ to: '/unauthenticated' });

    const access = await accessClient.getMyAccess();
    if (!accessClient.hasPermission(access, PERMISSIONS.STOCK_INVENTORY_READ)) {
      throw redirect({ to: '/forbidden' });
    }
    return { access };
  },
});