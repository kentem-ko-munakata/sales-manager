import type { Product } from '@/entities/product';
import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().trim().min(1, '商品名を入力してください').max(20, '20文字以内で入力してください'),
});

// 入力中の値（useFormのdefaultValues）
export type ProductFormInput = z.input<typeof productFormSchema>;
// チェック後の値（onSubmitで受け取る値）
export type ProductFormValues = z.output<typeof productFormSchema>;

// フォームの初期値
export const toProductFormInput = (product?: Product): ProductFormInput => ({
  name: product?.name ?? '',
});
