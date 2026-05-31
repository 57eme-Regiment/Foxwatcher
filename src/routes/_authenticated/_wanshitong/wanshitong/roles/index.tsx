import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/_wanshitong/wanshitong/roles/',
)({
  beforeLoad: async () => {
    const access = await accessClient.getMyAccess();
    if (
      !accessClient.hasPermission(access, LINKS.WanShiTong.roles.permission)
    ) {
      throw redirect({ to: LINKS.forbidden.to });
    }
    return { access };
  },
});
