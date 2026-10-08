import { FormTextField } from '@/shared/ui/FormTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { saleFormSchema, type SaleFormInput, type SaleFormValues } from '../model/schema';
import { useProductStore } from '@/entities/product';

interface SaleFormProps {
  title: string;
  defaultValues: SaleFormInput;
  submitLabel: string;
  // チェックを通った値だけが渡される
  onSubmit: (values: SaleFormValues) => void;
  onCancel: () => void;
}

// 表示している間だけマウントする前提（閉じるたびに入力は破棄される）
export const SaleForm = ({ title, defaultValues, submitLabel, onSubmit, onCancel }: SaleFormProps) => {
  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<SaleFormInput, unknown, SaleFormValues>({
    resolver: zodResolver(saleFormSchema), // チェックを zod のスキーマで行う
    defaultValues,
  });

  // 商品選択用
  const products = useProductStore((state) => state.products);
  // 在庫確認・売上・利益金額算出

  return (
    <Dialog open onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            <FormTextField control={control} name='productId' label='商品名' required autoFocus select>
              {products.length === 0 ? (
                <MenuItem value='' disabled>
                  商品がありません
                </MenuItem>
              ) : (
                products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))
              )}
            </FormTextField>
            <FormTextField
              control={control}
              name='quantity'
              label='数量'
              slotProps={{ htmlInput: { inputMode: 'numeric' } }} // e入力不可
              required
            />
            {/* 合計表示 */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>キャンセル</Button>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
