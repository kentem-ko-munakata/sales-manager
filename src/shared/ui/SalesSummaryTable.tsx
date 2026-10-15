import type { SalesSummary } from '@/entities/stock';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface SalesSummaryTableProps {
  salesSummaries: SalesSummary[];
}

export const SalesSummaryTable = ({ salesSummaries }: SalesSummaryTableProps) => {
  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table size='small' aria-label='売上状況一覧'>
        <TableHead>
          <TableRow>
            <TableCell>商品名</TableCell>
            <TableCell align='right'>販売価格</TableCell>
            <TableCell align='right'>販売数</TableCell>
            <TableCell align='right'>売上</TableCell>
            <TableCell align='right'>利益</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {salesSummaries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center'>
                データなし
              </TableCell>
            </TableRow>
          ) : (
            salesSummaries.map((salesSummary) => (
              <TableRow key={salesSummary.productId}>
                <TableCell>{salesSummary.productName}</TableCell>
                <TableCell align='right'>￥{salesSummary.salePrice.toLocaleString()}</TableCell>
                <TableCell align='right'>{salesSummary.saleQuantity.toLocaleString()}</TableCell>
                <TableCell align='right'>￥{salesSummary.sales.toLocaleString()}</TableCell>
                <TableCell align='right'>￥{salesSummary.profit.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
