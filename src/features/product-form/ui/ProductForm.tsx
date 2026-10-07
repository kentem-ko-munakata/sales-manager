import { FormTextField } from '@/shared/ui/FormTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { productFormSchema, type ProductFormInput, type ProductFormValues } from '../model/schema';

interface ProductFormProps {
  title: string;
  defaultValues: ProductFormInput;
  submitLabel: string;
  // チェックを通った値だけが渡される
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

// 表示している間だけマウントする前提（閉じるたびに入力は破棄される）
export const ProductForm = ({ title, defaultValues, submitLabel, onSubmit, onCancel }: ProductFormProps) => {
  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema), // チェックを zod のスキーマで行う
    defaultValues,
  });

  return (
    <Dialog open onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            {/* FormTextField：Controller と TextField をまとめた shared/ui の部品 */}
            <FormTextField control={control} name='name' label='商品名' required autoFocus />
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
