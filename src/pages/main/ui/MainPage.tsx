import { AddButton } from '@/features/product-form';
import { AddPurchaseButton } from '@/features/purchase-form';
import { AddSaleButton } from '@/features/sale-form';
import { SalesSummary } from '@/widgets/sales-summary';
import { TodaySalesSummary } from '@/widgets/today-sales-summary';
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';

// widgets を作ったら content を <XxxWidget /> に差し替える
const tabs = [
  { value: 'todaySales', label: '本日の販売状況', content: <TodaySalesSummary /> },
  { value: 'inventory', label: '在庫一覧', content: '在庫一覧を表示する' },
  { value: 'salesAnalytics', label: '販売集計', content: <SalesSummary /> },
];

export const MainPage = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  return (
    <Container>
      {/* ヘッダー */}
      <AppBar position='static'>
        <Toolbar>
          {/* flexGrow: 1 で残りの幅を使い、右のボタンを右端へ押し出す */}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            販売管理システム
          </Typography>
          {/* ボタン系 */}
          <AddButton />
          <AddPurchaseButton />
          <AddSaleButton />
        </Toolbar>
      </AppBar>

      {/* タブ */}
      <Tabs value={selectedTab} onChange={(_event, newValue: string) => setSelectedTab(newValue)}>
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            id={`tab-${tab.value}`}
            aria-controls={`tabpanel-${tab.value}`}
          />
        ))}
      </Tabs>
      {tabs.map((tab) => (
        // hidden で選ばれていないパネルを隠す。role・aria-labelledby でタブと結び付ける
        <Box
          key={tab.value}
          role='tabpanel'
          hidden={selectedTab !== tab.value}
          id={`tabpanel-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          sx={{ p: 2 }}
        >
          {tab.content}
        </Box>
      ))}
    </Container>
  );
};
