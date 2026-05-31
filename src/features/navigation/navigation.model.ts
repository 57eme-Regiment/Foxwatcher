import { PermissionSchema } from '@57eme-regiment/auth-contracts';
import type { TablerIcon } from '@tabler/icons-react';
import type { LinkProps } from '@tanstack/react-router';
import { z } from 'zod';

//#region Schemas

const NavigationLinkSchema = z.object({
  to: z.custom<NonNullable<LinkProps['to']>>(),
  label: z.string(),
  description: z.string().optional(),
  permission: PermissionSchema.nullish(),
  Icon: z.custom<TablerIcon>().optional(),
  hidden: z.boolean().optional(),
  disabled: z.boolean().optional(),
  target: z.enum(['_self', '_blank', '_parent', '_top']).optional(),
});

const NavigationLinksSchema = z.array(NavigationLinkSchema);

const NavigationLinksGroupSchema = z.object({
  title: z.string(),
  links: NavigationLinksSchema,
});

const NavigationLinksGroupsSchema = z.array(NavigationLinksGroupSchema);

//#endregion Schemas

//#region Types

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
export type NavigationLinks = z.infer<typeof NavigationLinksSchema>;
export type NavigationLinksGroup = z.infer<typeof NavigationLinksGroupSchema>;
export type NavigationLinksGroups = z.infer<typeof NavigationLinksGroupsSchema>;

// Recursive — ne peut pas être inféré depuis Zod
export type GenericLinkSchema = {
  [key: string]: NavigationLink | GenericLinkSchema;
};

//#endregion Types

//#region Exports

export {
  NavigationLinkSchema,
  NavigationLinksGroupSchema,
  NavigationLinksGroupsSchema,
  NavigationLinksSchema,
};

//#endregion Exports
