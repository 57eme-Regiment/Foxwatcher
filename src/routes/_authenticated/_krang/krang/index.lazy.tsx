import { DashboardApiActions } from '@/components/dashboard/dashboardApiActions';
import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { LINKS } from '@/features/navigation/links';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/_krang/krang/')({
  component: RouteComponent,
});

function RouteComponent() {
  const dashBoardItems = [
    LINKS.Krang.regions,
    LINKS.Krang.towns,
    LINKS.Krang.locations,
    LINKS.Krang.items,
  ];

  return (
    <div className="space-y-8">
      <DashboardMenu items={dashBoardItems} title="Krang" />
      <DashboardApiActions />
    </div>
  );
}
