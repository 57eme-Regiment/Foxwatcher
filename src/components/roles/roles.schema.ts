import {
  AdminDiscordMappingSchema,
  AdminPermissionSchema,
  AdminRoleSchema,
} from '@57eme-regiment/auth-contracts';
import { z } from 'zod';

export const PermissionRowSchema = AdminPermissionSchema.extend({
  isAssigned: z.boolean(),
});

export type AdminRole = z.infer<typeof AdminRoleSchema>;
export type AdminPermission = z.infer<typeof AdminPermissionSchema>;
export type PermissionRow = z.infer<typeof PermissionRowSchema>;
export type AdminDiscordMapping = z.infer<typeof AdminDiscordMappingSchema>;
