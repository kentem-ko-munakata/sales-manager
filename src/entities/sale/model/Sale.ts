import { z } from 'zod';

export const saleSchema = z.object({
  id: z.string(),
  productId: z.string(),
  purchaseId: z.string(),
  saleDate: z.string(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Sale = z.infer<typeof saleSchema>;
export type SaleInput = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>;
