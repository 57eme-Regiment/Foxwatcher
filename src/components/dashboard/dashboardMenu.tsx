import {
  IconBuildingCommunity,
  IconMapPin,
  IconPackage,
  IconWorld,
} from '@tabler/icons-react';
import { DashboardCard, type NavItem } from './dashboardCard';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Regions',
    to: '/regions',
    icon: IconWorld,
    description: 'Manage geographic regions',
  },
  {
    label: 'Towns',
    to: '/towns',
    icon: IconBuildingCommunity,
    description: 'Browse and manage towns',
  },
  {
    label: 'Locations',
    to: '/locations',
    icon: IconMapPin,
    description: 'View all locations',
  },
  {
    label: 'Items',
    to: '/items',
    icon: IconPackage,
    description: 'Manage inventory items',
  },
];

export function DashboardMenu() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {NAV_ITEMS.map((item, i) => (
          <DashboardCard key={item.to as string} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
