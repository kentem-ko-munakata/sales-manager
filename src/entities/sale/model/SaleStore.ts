import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import z from 'zod';
import { storageKey } from '@/shared/config/storage';
import { mergeWithSchema } from '@/shared/lib/persist';
import { saleSchema, type Sale, type SaleInput } from './Sale';

type SaleState = {
  sales: Sale[];
};

type SaleActions = {
  // 販売登録
  addSale: (input: SaleInput) => Sale;
};

export const useSaleStore = create<SaleState & SaleActions>()(
  persist(
    (set) => ({
      sales: [],
      addSale: (input) => {
        const now = new Date().toISOString();
        const sale: Sale = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ sales: [sale, ...state.sales] }));
        return sale;
      },
    }),
    {
      name: storageKey('sales'), // localStorage のキー
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sales: state.sales }), // 保存する値だけ（関数は保存できない）
      version: 1, // 保存する形を変えたら上げる
      // 読み込んだ値を zod でチェックし、形が崩れていたら初期値で始める（shared/lib/persist.ts）
      merge: mergeWithSchema(z.object({ sales: z.array(saleSchema) })),
    },
  ),
);
