export type TableRowType = {
  push(item: TableRowType): unknown;
  categoryId: 1;
  categoryName: string;
  item: string;
  itemId: number;
  par: number;
  userId: number;
};
export default function TableRow({
  categoryId,
  categoryName,
  item,
  itemId,
  par,
  userId,
}: TableRowType) {
  return (
    <div>
      <div>
        <p>${item}</p>
      </div>
      <div>
        <select
          defaultValue={`${par}`}
          name="par"
          className="form-control border-2 rounded-lg ml-1">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
        <div>
          <textarea name="stock" defaultValue={'Enter Stock'}></textarea>
        </div>
      </div>
    </div>
  );
}
