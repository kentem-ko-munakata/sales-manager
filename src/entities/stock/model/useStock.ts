import { useMemo } from 'react';
import { useProductStore } from '@/entities/product';
import { usePurchaseStore } from '@/entities/purchase';
import { useSaleStore } from '@/entities/sale';
import { calcStockByProduct } from './calcStock';
import { summarizeSales, type SalesPeriod, type SalesSummary } from './summarizeSales';
import { summarizeStock, type StockSummary } from './summarizeStock';

// 商品ごとの在庫 { 商品ID:在庫数(仕入数-販売数) }
export const useStockByProduct = (): Map<string, number> => {
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSaleStore((state) => state.sales);
  return useMemo(() => calcStockByProduct(purchases, sales), [purchases, sales]);
};

// 在庫状況表示用 (商品ID, 商品名, 仕入ID, 仕入日, 仕入価格, 販売価格, 在庫数)
export const useStockSummaries = (): StockSummary[] => {
  const products = useProductStore((state) => state.products);
  const purchases = usePurchaseStore((state) => state.purchases);
  const sales = useSaleStore((state) => state.sales);
  return useMemo(() => summarizeStock(products, purchases, sales), [products, purchases, sales]);
};

// 売上状況表示用 (商品ID, 商品名, 販売価格, 販売数, 売上合計, 利益合計)
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
