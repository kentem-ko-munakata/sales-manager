import { z } from 'zod';

export const purchaseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  purchaseDate: z.string(),
  quantity: z.number(),
  purchasePrice: z.number(),
  salePrice: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Purchase = z.infer<typeof purchaseSchema>;
export type PurchaseInput = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>;
