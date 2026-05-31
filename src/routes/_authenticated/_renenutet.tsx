import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_renenutet')({
  beforeLoad: async ({ context }) => {
    if (
      !accessClient.hasPermission(
        context.access,
        LINKS.Renenutet.index.permission,
      )
    )
      throw redirect({ to: LINKS.forbidden.to });
  },
  component: () => <Outlet />,
});
