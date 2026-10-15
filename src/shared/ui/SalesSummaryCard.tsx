import { Card, CardContent, CardHeader, Typography } from '@mui/material';

interface SalesSummaryCardProps {
  title: string;
  // 売上・利益想定
  value: number;
}

export const SalesSummaryCard = ({ title, value }: SalesSummaryCardProps) => {
  return (
    <Card sx={{ flex: 1, maxWidth: 360 }}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant='h5' color='secondary' sx={{ fontWeight: 'bold' }}>
          ￥{value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};
