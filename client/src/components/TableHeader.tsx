import TableRow, { TableRowType } from './TableRow';

type TableHeaderType = {
  category: string;
  items: TableRowType[];
};

export default function TableHeader({ category, items }: TableHeaderType) {
  const itemRows = items.map((item) => (
    <TableRow
      categoryId={item.categoryId}
      categoryName={item.categoryName}
      item={item.item}
      itemId={item.itemId}
      par={item.par}
      userId={item.userId}
      key={item.itemId}
    />
  ));

  return (
    <div className="w-6/12 p-1 border-b-2 border-gold pt-4 pb-4">
      <div className="w-full flex justify-start">
        <div className="w-6/12 font-bold text-lg">{category}</div>
        <div className="w-6/12 flex justify-between">
          <div className="w-6/12">Par</div>
          <div className="w-6/12">In Stock</div>
        </div>
      </div>
      {itemRows}
    </div>
  );
}
