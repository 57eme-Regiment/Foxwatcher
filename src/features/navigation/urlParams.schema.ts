import z from 'zod';

export const EmptyLinkParamsSchema = z.object({}).strict();

// Extend this for routes with search params, e.g.:
// export const RegionSearchSchema = EmptyLinkParamsSchema.extend({
//   page: z.number().optional(),
//   search: z.string().optional(),
// })
