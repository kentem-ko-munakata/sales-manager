import { FormTextField } from '@/shared/ui/FormTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { purchaseFormSchema, type PurchaseFormInput, type PurchaseFormValues } from '../model/schema';
import { useProductStore } from '@/entities/product';

interface PurchaseFormProps {
  title: string;
  defaultValues: PurchaseFormInput;
  submitLabel: string;
  // チェックを通った値だけが渡される
  onSubmit: (values: PurchaseFormValues) => void;
  onCancel: () => void;
}

// 表示している間だけマウントする前提（閉じるたびに入力は破棄される）
export const PurchaseForm = ({ title, defaultValues, submitLabel, onSubmit, onCancel }: PurchaseFormProps) => {
  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<PurchaseFormInput, unknown, PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema), // チェックを zod のスキーマで行う
    defaultValues,
  });

  // 商品選択用
  const products = useProductStore((state) => state.products);

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
              name='purchaseDate'
              label='仕入日'
              type='date'
              slotProps={{ inputLabel: { shrink: true } }}
              required
            />
            <FormTextField
              control={control}
              name='quantity'
              label='数量'
              slotProps={{ htmlInput: { inputMode: 'numeric' } }} // e入力不可
              required
            />
            <FormTextField
              control={control}
              name='purchasePrice'
              label='仕入価格'
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              required
            />
            <FormTextField
              control={control}
              name='salePrice'
              label='販売価格'
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              required
            />
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
