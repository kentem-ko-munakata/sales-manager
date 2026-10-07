import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';
import { storageKey } from '@/shared/config/storage';
import { mergeWithSchema } from '@/shared/lib/persist';
import { purchaseSchema, type Purchase, type PurchaseInput } from './Purchase';

type PurchaseState = {
  purchases: Purchase[];
};

type PurchaseActions = {
  // 仕入登録
  addPurchase: (input: PurchaseInput) => Purchase;
};

export const usePurchaseStore = create<PurchaseState & PurchaseActions>()(
  persist(
    (set) => ({
      purchases: [],
      addPurchase: (input) => {
        const now = new Date().toISOString();
        const purchase: Purchase = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ purchases: [purchase, ...state.purchases] }));
        return purchase;
      },
    }),
    {
      name: storageKey('purchases'), // localStorage のキー
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ purchases: state.purchases }), // 保存する値だけ（関数は保存できない）
      version: 1, // 保存する形を変えたら上げる
      // 読み込んだ値を zod でチェックし、形が崩れていたら初期値で始める（shared/lib/persist.ts）
      merge: mergeWithSchema(z.object({ purchases: z.array(purchaseSchema) })),
    },
  ),
);
