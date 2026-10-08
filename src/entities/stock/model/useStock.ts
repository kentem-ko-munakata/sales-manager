import { useMemo } from 'react';
import { useProductStore } from '@/entities/product';
import { usePurchaseStore } from '@/entities/purchase';
import { useSaleStore } from '@/entities/sale';
import { calcStockByProduct } from './calcStock';
import { summarizeSales, type SalesPeriod, type SalesSummary } from './summarizeSales';
import { summarizeStock, type StockSummary } from './summarizeStock';

// 商品ごとの在庫
export const useStockByProduct = (): Map<string, number> => {
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSaleStore((state) => state.sales);
  return useMemo(() => calcStockByProduct(purchases, sales), [purchases, sales]);
};

// 1商品の在庫
export const useStock = (productId: string): number => useStockByProduct().get(productId) ?? 0;

// 在庫状況表示用
export const useStockSummaries = (): StockSummary[] => {
  const products = useProductStore((state) => state.products);
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSaleStore((state) => state.sales);
  return useMemo(() => summarizeStock(products, purchases, sales), [products, purchases, sales]);
};

// 売上状況表示用
export const useSalesSummaries = (period: SalesPeriod = {}): SalesSummary[] => {
  const products = useProductStore((state) => state.products);
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSaleStore((state) => state.sales);
  const { from, to } = period; // オブジェクトは毎回新しくなるので、値で依存させる
  return useMemo(
    () => summarizeSales(products, purchases, sales, { from, to }),
    [products, purchases, sales, from, to],
  );
};
