import { DashboardApiActions } from '@/components/dashboard/dashboardApiActions';
import { DashboardMenu } from '@/components/dashboard/dashboardMenu';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const userCanView = useHasPermission(PERMISSIONS.STOCK_INVENTORY_CREATE);

  return (
    <div className="space-y-8">
      {userCanView && <DashboardMenu />}
      <DashboardApiActions />
    </div>
  );
}
