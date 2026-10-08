import { useProductStore } from '@/entities/product';
import { FormTextField } from '@/shared/ui/FormTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { productFormSchema, type ProductFormInput, type ProductFormValues } from '../model/schema';

interface ProductFormProps {
  title: string;
  defaultValues: ProductFormInput;
  // 編集中の商品の id（商品名の重複チェックから自分自身を除く。登録のときは不要）
  editingId?: string;
  submitLabel: string;
  // チェックを通った値だけが渡される
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

// 表示している間だけマウントする前提（閉じるたびに入力は破棄される）
export const ProductForm = ({ title, defaultValues, editingId, submitLabel, onSubmit, onCancel }: ProductFormProps) => {
  // 重複チェック用：登録済みの商品名（編集中の商品は除く）
  const products = useProductStore((state) => state.products);
  const existingNames = products.filter((product) => product.id !== editingId).map((product) => product.name);

  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema(existingNames)), // チェックを zod のスキーマで行う
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
