import type { NavigationLinks } from '@/features/navigation/navigation.model';
import { DashboardCard } from './dashboardCard';

type DashboardMenuProps = {
  title: string;
  items: NavigationLinks;
};
export function DashboardMenu({ items, title }: DashboardMenuProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map(item => (
          <DashboardCard key={item.to as string} item={item} />
        ))}
      </div>
    </div>
  );
}
