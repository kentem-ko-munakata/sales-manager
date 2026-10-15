import type { Purchase } from '@/entities/purchase';
import { z } from 'zod';

// 数値欄はTextFieldの値(文字列)で受けて、チェック後に number へ変換する
const positiveInt = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください`)
    .regex(/^\d+$/, `${label}は1以上の整数で入力してください`)
    .transform(Number)
    // pipe → number型変換後に数字チェック（範囲チェック）
    .pipe(z.number().min(1, `${label}は1以上で入力してください`).max(999_999_999, `${label}が大きすぎます`));

export const purchaseFormSchema = (stockByProduct: Map<string, number>) =>
  z
    .object({
      productId: z
        .string()
        .min(1, '商品を選択してください')
        // 在庫がない（仕入のない商品も含む）ときだけ仕入できる
        .refine((productId) => (stockByProduct.get(productId) ?? 0) === 0, '在庫が残っているため仕入できません'),
      purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付を入力してください'),
      quantity: positiveInt('数量'),
      purchasePrice: positiveInt('仕入価格'),
      salePrice: positiveInt('販売価格'),
    })
    // 項目をまたぐチェック（各項目が通ったあとに実行される）。同額は許可
    .refine((v) => v.purchasePrice <= v.salePrice, {
      message: '仕入価格は販売価格以下で入力してください',
      path: ['purchasePrice'], // エラーを仕入価格の欄に出す
    });

// 戻り値のschema型抽出
type PurchaseFormSchema = ReturnType<typeof purchaseFormSchema>;
// 入力中の値（useFormのdefaultValues）
export type PurchaseFormInput = z.input<PurchaseFormSchema>;
// チェック後の値（onSubmitで受け取る値）
export type PurchaseFormValues = z.output<PurchaseFormSchema>;

// フォームの初期値
export const toPurchaseFormInput = (purchase?: Purchase): PurchaseFormInput => ({
  productId: purchase?.productId ?? '',
  purchaseDate: purchase?.purchaseDate ?? new Date().toISOString().slice(0, 10), // 今日の日付
  quantity: String(purchase?.quantity ?? ''),
  purchasePrice: String(purchase?.purchasePrice ?? ''),
  salePrice: String(purchase?.salePrice ?? ''),
});
