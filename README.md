# 販売管理システム（sales-manager）

商品の在庫管理および販売管理を行うシステム。在庫処理や販売処理の結果を確認できるようにする。

## 画面

### メイン画面

本システムのトップページであり、以下要素を表示する

- メニューボタン（販売・商品・仕入登録ボタン）

- 本日の販売状況（タブ）
  - 商品ごとの商品名、販売価格、販売数、売上を表示
  - 売上合計
  - 利益合計
  - フィルター（追加）

- 在庫一覧（タブ）
  - 現在の在庫状況
  - 商品名、仕入日、仕入価格、販売価格、在庫数

- 販売集計（タブ）
  - 商品ごとの商品名、販売価格、販売数、売上
  - 総売上金額
  - 総利益金額

### サブ画面

以下、各メニューボタン押下時に表示される登録フォーム

- 商品登録モーダル
  - 商品名を登録（同名不可）
  - 商品登録だけでは、在庫一覧には非表示

- 仕入登録モーダル
  - 登録済み商品の選択
  - 仕入数、仕入価格、販売価格入力可能
  - 在庫が1以上の場合、仕入不可
  - 仕入後に在庫一覧へ反映
- 販売登録モーダル
  - 在庫のある商品の中から1つの商品を選択
  - 販売数を入力可能
  - 販売登録後、本日の販売状況、在庫一覧、販売集計に反映

## データ

### 商品 (Product)

```typescript
type Product = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
```

### 仕入 (purchase)

```typescript
type Purchase = {
  id: string;
  productId: string;
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  createdAt: string;
  updatedAt: string;
};
```

### 販売 (sale)

```typescript
type Sale = {
  id: string;
  productId: string;
  purchaseId: string;
  saleDate: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};
```
