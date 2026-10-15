import { useProductStore } from '@/entities/product';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toProductFormInput, type ProductFormValues } from '../model/schema';
import { ProductForm } from './ProductForm';

export const AddButton = () => {
  const addProduct = useProductStore((state) => state.addProduct);

  // 商品登録モーダル開閉用
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: ProductFormValues) => {
    addProduct(values);
    setOpen(false);
  };

  return (
    <>
      <Button variant='contained' onClick={() => setOpen(true)}>
        商品登録
      </Button>
      {open && (
        <ProductForm
          title='商品を登録'
          defaultValues={toProductFormInput()}
          submitLabel='登録'
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
};
