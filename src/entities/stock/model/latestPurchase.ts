import type { Purchase } from '@/entities/purchase';

// 商品単位の仕入情報（販売価格表示用）
export const findLatestPurchaseByProduct = (purchases: Purchase[]): Map<string, Purchase> => {
  const latestByProductId = new Map<string, Purchase>();
  // 商品単位で仕入日（登録日）が最新の仕入情報をセット
  for (const purchase of purchases) {
    const latest = latestByProductId.get(purchase.productId);
    if (!latest || latest.createdAt < purchase.createdAt) {
      latestByProductId.set(purchase.productId, purchase);
    }
  }
  return latestByProductId;
};
