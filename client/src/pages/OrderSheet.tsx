export type OrderSheetType = {
  item: string;
  orderId: string;
  orderItemId: number;
  quantity: number;
}[];

type Order = {
  order: OrderSheetType | undefined;
};

export default function OrderSheet({ order }: Order) {
  return (
    <div className="flex flex-col content-center justify-center">
      <div className="text-2xl pt-2 pb-2">Order Sheet</div>
      <div className="flex">
        <div className="flex w-6/12 pb-2">
          <div className="w-6/12 text-lg">Item</div>
          <div className="w-6/12 text-lg">Quantity</div>
        </div>
        <div className="flex w-6/12 pb-2">
          <div className="w-6/12 text-lg">Item</div>
          <div className="w-6/12 text-lg">Quantity</div>
        </div>
      </div>
      <div className="flex flex-wrap border border-gold">
        {order ? (
          order.map((item) => (
            <div
              key={item.orderItemId}
              className="pb-2 flex w-6/12 p-2 border border-gold">
              <div className="w-6/12 flex items-center">
                <p className="w-full text-lg">{item.item}</p>
              </div>
              <div className="w-6/12 flex items-center">
                <p className="w-full text-lg">{item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
