import type { Product } from '@/entities/product';
import type { Purchase } from '@/entities/purchase';
import type { Sale } from '@/entities/sale';
import { calcStockByProduct } from './calcStock';
import { findLatestPurchaseByProduct } from './latestPurchase';

// 在庫状況（表示用）
export type StockSummary = {
  productId: string;
  productName: string;
  purchaseId: string;
  purchaseDate: string; // 仕入日
  purchasePrice: number; // 仕入価格
  salePrice: number; // 販売価格
  stock: number; // 在庫数 = 仕入数の合計 - 販売数の合計
};

export const summarizeStock = (products: Product[], purchases: Purchase[], sales: Sale[]): StockSummary[] => {
  // 商品ごとの在庫数
  const stockByProductId = calcStockByProduct(purchases, sales);
  // 商品ごとの最新仕入価格
  const latestPurchaseByProductId = findLatestPurchaseByProduct(purchases);

  const summaries: StockSummary[] = [];

  // 商品1件ずつ確認し、在庫状況（summaries）に入れる
  for (const product of products) {
    const stock = stockByProductId.get(product.id) ?? 0;
    const latest = latestPurchaseByProductId.get(product.id);
    if (stock <= 0 || !latest) continue; // 在庫がない商品は出さない

    //
    summaries.push({
      productId: product.id,
      productName: product.name,
      purchaseId: latest.id,
      purchaseDate: latest.purchaseDate,
      purchasePrice: latest.purchasePrice,
      salePrice: latest.salePrice,
      stock,
    });
  }
  return summaries;
};
