import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { LINKS } from '@/features/navigation/links';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute(
  '/_authenticated/_wanshitong/wanshitong/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const dashBoardItems = [
    LINKS.WanShiTong.users,
    LINKS.WanShiTong.roles,
    LINKS.WanShiTong.userOverride,
  ];

  return (
    <div className="space-y-8">
      <DashboardMenu items={dashBoardItems} title="Wan-Shi-Tong" />
    </div>
  );
}
