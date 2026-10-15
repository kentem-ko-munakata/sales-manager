import { useStockSummaries } from '@/entities/stock';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const StockTable = () => {
  const stockSummaries = useStockSummaries();

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table size='small' aria-label='売上状況一覧'>
        <TableHead>
          <TableRow>
            <TableCell>商品名</TableCell>
            <TableCell align='right'>仕入日</TableCell>
            <TableCell align='right'>仕入価格</TableCell>
            <TableCell align='right'>販売価格</TableCell>
            <TableCell align='right'>在庫数</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {stockSummaries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center'>
                データなし
              </TableCell>
            </TableRow>
          ) : (
            stockSummaries.map((salesSummary) => (
              <TableRow key={salesSummary.productId}>
                <TableCell>{salesSummary.productName}</TableCell>
                <TableCell align='right'>{salesSummary.purchaseDate}</TableCell>
                <TableCell align='right'>{salesSummary.purchasePrice.toLocaleString()}</TableCell>
                <TableCell align='right'>￥{salesSummary.salePrice.toLocaleString()}</TableCell>
                <TableCell align='right'>{salesSummary.stock}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
