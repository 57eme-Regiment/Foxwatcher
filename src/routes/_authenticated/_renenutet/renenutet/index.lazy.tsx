import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { LINKS } from '@/features/navigation/links';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute(
  '/_authenticated/_renenutet/renenutet/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const dashBoardItems = [
    LINKS.Krang.regions,
    LINKS.Krang.regions,
    LINKS.Krang.regions,
    LINKS.Krang.regions,
  ];

  return (
    <div className="space-y-8">
      <DashboardMenu items={dashBoardItems} title="Renenutet" />
    </div>
  );
}
