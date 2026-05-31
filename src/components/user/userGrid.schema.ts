import { AdminSessionSchema, AdminUserSchema } from '@57eme-regiment/auth-contracts';
import { z } from 'zod';

export const UserRowSchema = AdminUserSchema.extend({
  _type: z.literal('user'),
  _isExpanded: z.boolean(),
  _sessionCount: z.number().int().nonnegative(),
});

export const SessionRowSchema = AdminSessionSchema.extend({
  _type: z.literal('session'),
});

export const GridRowSchema = z.discriminatedUnion('_type', [
  UserRowSchema,
  SessionRowSchema,
]);

export type UserRow = z.infer<typeof UserRowSchema>;
export type SessionRow = z.infer<typeof SessionRowSchema>;
export type GridRow = z.infer<typeof GridRowSchema>;
