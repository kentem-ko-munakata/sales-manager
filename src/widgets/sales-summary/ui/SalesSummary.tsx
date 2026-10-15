import { sumSalesSummaries, useSalesSummaries } from '@/entities/stock';
import { SalesSummaryCard } from '@/shared/ui/SalesSummaryCard';
import { SalesSummaryTable } from '@/shared/ui/SalesSummaryTable';
import { Stack } from '@mui/material';

export const SalesSummary = () => {
  const salesSummaries = useSalesSummaries();
  const sumSales = sumSalesSummaries(salesSummaries);

  return (
    <Stack spacing={2}>
      {/* 売上・利益カード */}
      <Stack spacing={2} direction='row'>
        <SalesSummaryCard title='売上' value={sumSales.sales} />
        <SalesSummaryCard title='利益' value={sumSales.profit} />
      </Stack>
      {/* サマリテーブル */}
      <SalesSummaryTable salesSummaries={salesSummaries} />
    </Stack>
  );
};
