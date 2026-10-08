import type { Purchase } from '@/entities/purchase';
import type { Sale } from '@/entities/sale';

// 商品ごとの在庫算出
export const calcStockByProduct = (purchases: Purchase[], sales: Sale[]): Map<string, number> => {
  const stockByProductId = new Map<string, number>();

  // 商品ごとの仕入数
  for (const purchase of purchases) {
    stockByProductId.set(
      purchase.productId,
      // 前回結果に加算
      (stockByProductId.get(purchase.productId) ?? 0) + purchase.quantity,
    );
  }
  // 商品ごとの販売数
  for (const sale of sales) {
    stockByProductId.set(sale.productId, (stockByProductId.get(sale.productId) ?? 0) - sale.quantity);
  }
  // {商品ID:在庫（仕入数 - 販売数）}
  return stockByProductId;
};
