import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { LINKS } from '@/features/navigation/links';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const dashBoardItems = [
    LINKS.WanShiTong.index,
    LINKS.Krang.index,
    LINKS.Renenutet.index,
  ];

  return (
    <div className="space-y-8">
      <DashboardMenu items={dashBoardItems} title="Dashboard" />
    </div>
  );
}
