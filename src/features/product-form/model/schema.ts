import type { Product } from '@/entities/product';
import { z } from 'zod';

export const productFormSchema = (existingNames: string[]) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, '商品名を入力してください')
      .max(20, '20文字以内で入力してください')
      // 登録済みの商品名との重複もチェック（編集時は自分の名前を除いて渡す）
      .refine((name) => !existingNames.includes(name), '同じ商品名がすでに登録されています'),
  });

// 戻り値のschema型抽出
type ProductFormSchema = ReturnType<typeof productFormSchema>;
// 入力中の値（useFormのdefaultValues）
export type ProductFormInput = z.input<ProductFormSchema>;
// チェック後の値（onSubmitで受け取る値）
export type ProductFormValues = z.output<ProductFormSchema>;

// フォームの初期値
export const toProductFormInput = (product?: Product): ProductFormInput => ({
  name: product?.name ?? '',
});
