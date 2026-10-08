import { useSaleStore, type SaleInput } from '@/entities/sale';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toSaleFormInput } from '../model/schema';
import { SaleForm } from './SaleForm';

export const AddSaleButton = () => {
  const addSale = useSaleStore((state) => state.addSale);

  // 商品登録モーダル開閉用
  const [open, setOpen] = useState(false);

  const handleSubmit = (input: SaleInput) => {
    addSale(input);
    setOpen(false);
  };

  return (
    <>
      <Button variant='contained' onClick={() => setOpen(true)}>
        販売登録
      </Button>
      {open && (
        <SaleForm
          title='販売登録'
          defaultValues={toSaleFormInput()}
          submitLabel='登録'
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
};
