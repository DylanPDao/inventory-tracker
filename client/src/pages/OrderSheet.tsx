export type OrderSheetType = {
  item: string;
  orderId: string;
  orderItemId: number;
  quantity: number;
};

type Order = {
  order: OrderSheetType | undefined;
};

export default function OrderSheet({ order }: Order) {
  return <div></div>;
}
