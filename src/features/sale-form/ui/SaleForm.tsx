import type { SaleInput } from '@/entities/sale';
import { useStockSummaries } from '@/entities/stock';
import { FormTextField } from '@/shared/ui/FormTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { saleFormSchema, type SaleFormInput, type SaleFormValues } from '../model/schema';

interface SaleFormProps {
  title: string;
  defaultValues: SaleFormInput;
  submitLabel: string;
  // チェックを通った値だけが渡される
  onSubmit: (input: SaleInput) => void;
  onCancel: () => void;
}

// 表示している間だけマウントする前提（閉じるたびに入力は破棄される）
export const SaleForm = ({ title, defaultValues, submitLabel, onSubmit, onCancel }: SaleFormProps) => {
  // 商品選択用：在庫がある商品だけ
  const stockSummaries = useStockSummaries();
  const findSummary = (productId: string) => stockSummaries.find((summary) => summary.productId === productId);

  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<SaleFormInput, unknown, SaleFormValues>({
    // 選択中の商品の在庫でチェックしたいため、チェックのたびに入力値の商品から在庫を引いてスキーマを作る
    resolver: (values, context, options) => {
      const stock = findSummary(values.productId)?.stock;
      return zodResolver(saleFormSchema(stock))(values, context, options);
    },
    defaultValues,
  });

  return (
    <Dialog open onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          const summary = findSummary(values.productId);
          if (!summary) return; // 商品を選べていれば必ずある（チェックで防いでいる）
          onSubmit({ ...values, purchaseId: summary.purchaseId }); // 最新の仕入から売る
        })}
        noValidate
      >
        <DialogContent>
          <Stack spacing={2}>
            <FormTextField control={control} name='productId' label='商品名' required autoFocus select>
              {stockSummaries.length === 0 ? (
                <MenuItem value='' disabled>
                  在庫のある商品がありません
                </MenuItem>
              ) : (
                stockSummaries.map((summary) => (
                  <MenuItem key={summary.productId} value={summary.productId}>
                    {summary.productName}（在庫：{summary.stock.toLocaleString()}、価格：
                    {summary.salePrice.toLocaleString()}円）
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
