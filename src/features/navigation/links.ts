import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  IconBuildingCommunity,
  IconForklift,
  IconMapPin,
  IconPackage,
  IconShieldLock,
  IconStack2Filled,
  IconWorld,
} from '@tabler/icons-react';
import type { GenericLinkSchema, NavigationLink } from './navigation.model';

const link = (
  to: NavigationLink['to'],
  label: string,
  options?: Partial<Omit<NavigationLink, 'to' | 'label'>>,
): NavigationLink => ({ to, label, ...options });

export const LINKS = {
  index: link('/', 'Home', {
    permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_FOXWATCHER_ACCESS
  }),
  forbidden: link('/forbidden', 'Forbidden', {
    hidden: true,
  }),
  unauthenticated: link('/unauthenticated', 'Unauthenticated', {
    hidden: true,
  }),

  WanShiTong: {
    index: link('/wanshitong', 'WanShiTong', {
      Icon: IconShieldLock,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_WANSHITONG_ACCESS
      description: 'Authentification & Permission',
    }),
    users: link('/wanshitong/users', 'Users', {
      Icon: IconShieldLock,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_WANSHITONG_ACCESS
      description: 'Authentification & Permission',
    }),
    roles: link('/wanshitong/roles', 'Roles', {
      Icon: IconShieldLock,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_WANSHITONG_ACCESS
      description: 'Authentification & Permission',
    }),
    userOverride: link('/wanshitong/users/overrides', 'Overrides', {
      Icon: IconShieldLock,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_OVERIDE_READ
      description: 'Authentification & Permission',
    }),
  },

  Krang: {
    index: link('/krang', 'Krang', {
      Icon: IconStack2Filled,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_KRANG_ACCESS
      description: 'Foxhole knowledge database',
    }),
    regions: link('/krang/regions', 'Régions', {
      Icon: IconWorld,
      permission: PERMISSIONS.KRANG_REGION_READ,
    }),
    towns: link('/krang/towns', 'Villes', {
      Icon: IconBuildingCommunity,
      permission: PERMISSIONS.KRANG_TOWN_READ,
    }),
    locations: link('/krang/locations', 'Locations', {
      Icon: IconMapPin,
      permission: PERMISSIONS.KRANG_LOCATION_READ,
    }),
    items: link('/krang/items', 'Items', {
      Icon: IconPackage,
      permission: PERMISSIONS.KRANG_ITEM_READ,
    }),
  },

  Renenutet: {
    index: link('/renenutet', 'Renenutet', {
      Icon: IconForklift,
      permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_RENENUTET_ACCESS,
      description: 'StockManager',
    }),
  },
} satisfies GenericLinkSchema;
