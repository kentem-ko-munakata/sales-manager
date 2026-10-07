import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
