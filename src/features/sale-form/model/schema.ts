import type { Sale } from '@/entities/sale';
import { z } from 'zod';

// 数値欄はTextFieldの値(文字列)で受けて、チェック後に number へ変換する
const positiveInt = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください`)
    .regex(/^\d+$/, `${label}は1以上の整数で入力してください`)
    .transform(Number)
    .pipe(z.number().min(1, `${label}は1以上で入力してください`).max(999_999_999, `${label}が大きすぎます`));

export const saleFormSchema = z.object({
  productId: z.string().min(1, '商品を選択してください'),
  saleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付を入力してください'),
  quantity: positiveInt('数量'),
});

// 入力中の値（useFormのdefaultValues）
export type SaleFormInput = z.input<typeof saleFormSchema>;
// チェック後の値（onSubmitで受け取る値）
export type SaleFormValues = z.output<typeof saleFormSchema>;

// フォームの初期値
export const toSaleFormInput = (sale?: Sale): SaleFormInput => ({
  productId: sale?.productId ?? '',
  saleDate: sale?.saleDate ?? new Date().toISOString().slice(0, 10), // 今日の日付
  quantity: String(sale?.quantity ?? ''),
});
