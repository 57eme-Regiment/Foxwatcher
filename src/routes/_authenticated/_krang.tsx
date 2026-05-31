import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_krang')({
  beforeLoad: async ({ context }) => {
    if (
      !accessClient.hasPermission(context.access, LINKS.Krang.index.permission)
    )
      throw redirect({ to: LINKS.forbidden.to });
  },
  component: () => <Outlet />,
});
