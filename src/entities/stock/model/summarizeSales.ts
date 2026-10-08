import type { Product } from '@/entities/product';
import type { Purchase } from '@/entities/purchase';
import type { Sale } from '@/entities/sale';

// 販売期間の指定（本日、全期間）
export type SalesPeriod = { from?: string; to?: string };

// 売上状況（表示用）
export type SalesSummary = {
  productId: string;
  productName: string;
  salePrice: number; // 販売価格（平均）= 売上合計 ÷ 販売数。仕入ごとに価格が違っても、販売数 × 販売価格 = 売上合計になる
  saleQuantity: number; // 販売数
  sales: number; // 売上合計 = 販売数 × 販売価格（販売したときの仕入の価格）
  profit: number; // 利益合計 = 売上合計 - 販売数 × 仕入価格
};

// 販売日が期間内かチェック
const isInPeriod = (saleDate: string, period: SalesPeriod): boolean =>
  (period.from === undefined || period.from <= saleDate) && (period.to === undefined || saleDate <= period.to);

export const summarizeSales = (
  products: Product[],
  purchases: Purchase[],
  sales: Sale[],
  period: SalesPeriod = {},
): SalesSummary[] => {
  // productID:商品情報
  const productById = new Map(products.map((product) => [product.id, product]));
  // purchaseID:仕入情報
  const purchaseById = new Map(purchases.map((purchase) => [purchase.id, purchase]));

  // productID:売上状況（商品ごとの1行）
  const summaryByProductId = new Map<string, SalesSummary>();

  // 販売情報を1件ずつ確認
  for (const sale of sales) {
    if (!isInPeriod(sale.saleDate, period)) continue;

    // 期間内の販売情報と商品・仕入情報を紐づける
    const product = productById.get(sale.productId);
    const purchase = purchaseById.get(sale.purchaseId);

    // 対応する商品・仕入がない販売は集計しない
    if (!product || !purchase) continue;

    // 商品行の取り出し（なければ作成）
    let summary = summaryByProductId.get(product.id);
    if (!summary) {
      summary = {
        productId: product.id,
        productName: product.name,
        salePrice: 0, // 仮の値（全部足したあとに平均を入れる）
        saleQuantity: 0,
        sales: 0,
        profit: 0,
      };
      summaryByProductId.set(product.id, summary);
    }

    // 販売数加算
    summary.saleQuantity += sale.quantity;
    // 売上加算
    summary.sales += sale.quantity * purchase.salePrice;
    // 利益加算
    summary.profit += sale.quantity * (purchase.salePrice - purchase.purchasePrice);
  }

  // 配列に変換
  const summaries = [...summaryByProductId.values()];
  // 販売価格は期間内の平均（期間内で仕入が複数ある場合、販売価格が一定でない可能性があるため）
  for (const summary of summaries) {
    summary.salePrice = summary.sales / summary.saleQuantity;
  }
  return summaries;
};

// 売上状況の合計
export const sumSalesSummaries = (summaries: SalesSummary[]): { sales: number; profit: number } =>
  summaries.reduce(
    (total, summary) => ({
      sales: total.sales + summary.sales,
      profit: total.profit + summary.profit,
    }),
    { sales: 0, profit: 0 },
  );
