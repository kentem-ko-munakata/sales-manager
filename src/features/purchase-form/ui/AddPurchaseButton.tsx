import { usePurchaseStore } from '@/entities/purchase';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toPurchaseFormInput, type PurchaseFormValues } from '../model/schema';
import { PurchaseForm } from './PurchaseForm';

export const AddPurchaseButton = () => {
  const addPurchase = usePurchaseStore((state) => state.addPurchase);

  // 商品登録モーダル開閉用
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: PurchaseFormValues) => {
    addPurchase(values);
    setOpen(false);
  };

  return (
    <>
      <Button variant='contained' onClick={() => setOpen(true)}>
        仕入登録
      </Button>
      {open && (
        <PurchaseForm
          title='仕入登録'
          defaultValues={toPurchaseFormInput()}
          submitLabel='登録'
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
};
