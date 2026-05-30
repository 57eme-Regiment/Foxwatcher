import { z } from 'zod'

export const InventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  quantity: z.number().int().nonnegative(),
  maxCapacity: z.number().int().positive(),
  demand: z.number().int().nonnegative(),
  productionNeed: z.number().int().nonnegative(),
})

export const StockTypeSchema = z.enum(['Depot', 'Seaport'])

export const StockSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  type: StockTypeSchema,
  items: z.array(InventoryItemSchema),
})

export type InventoryItem = z.infer<typeof InventoryItemSchema>
export type StockType = z.infer<typeof StockTypeSchema>
export type Stock = z.infer<typeof StockSchema>
