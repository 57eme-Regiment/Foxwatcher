import { DashboardApiActions } from '@/components/dashboard/dashboardApiActions';
import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="space-y-8">
      <DashboardMenu />
      <DashboardApiActions />
    </div>
  );
}
