import { create } from 'zustand';
import { productSchema, type Product, type ProductInput } from './Product';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';
import { storageKey } from '@/shared/config/storage';
import { mergeWithSchema } from '@/shared/lib/persist';

type ProductState = {
  products: Product[];
};

type ProductActions = {
  // 商品登録
  addProduct: (input: ProductInput) => Product;
};

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (input) => {
        const now = new Date().toISOString();
        const product: Product = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },
    }),
    {
      name: storageKey('products'), // localStorage のキー
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }), // 保存する値だけ（関数は保存できない）
      version: 1, // 保存する形を変えたら上げる
      // 読み込んだ値を zod でチェックし、形が崩れていたら初期値で始める（shared/lib/persist.ts）
      merge: mergeWithSchema(z.object({ products: z.array(productSchema) })),
    },
  ),
);
