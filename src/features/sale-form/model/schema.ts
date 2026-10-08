import type { Sale } from '@/entities/sale';
import { z } from 'zod';

// 数値欄はTextFieldの値(文字列)で受けて、チェック後に number へ変換する
const positiveInt = (label: string, max: number, maxMessage: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください`)
    .regex(/^\d+$/, `${label}は1以上の整数で入力してください`)
    .transform(Number)
    .pipe(z.number().min(1, `${label}は1以上で入力してください`).max(max, maxMessage));

// stock：選択中の商品の在庫数（商品が未選択のときは undefined。数量は在庫チェックをしない）
export const saleFormSchema = (stock?: number) =>
  z.object({
    productId: z.string().min(1, '商品を選択してください'),
    saleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付を入力してください'),
    quantity:
      stock === undefined
        ? positiveInt('数量', 999_999_999, '数量が大きすぎます')
        : // 在庫数を超える数量は販売できない
          positiveInt('数量', stock, `在庫数（${stock}）以内で入力してください`),
  });

// 戻り値のschema型抽出
type SaleFormSchema = ReturnType<typeof saleFormSchema>;
// 入力中の値（useFormのdefaultValues）
export type SaleFormInput = z.input<SaleFormSchema>;
// チェック後の値（onSubmitで受け取る値）
export type SaleFormValues = z.output<SaleFormSchema>;

// フォームの初期値
export const toSaleFormInput = (sale?: Sale): SaleFormInput => ({
  productId: sale?.productId ?? '',
  saleDate: sale?.saleDate ?? new Date().toISOString().slice(0, 10), // 今日の日付
  quantity: String(sale?.quantity ?? ''),
});
