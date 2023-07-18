export type TableRowType = {
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
    <div className="flex w-6/12 p-1 border-b-2">
      <div className="w-6/12 flex align-start">
        <p className="text-md">{item}</p>
      </div>
      <div className="flex w-6/12 justify-end">
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
          <select
            defaultValue={0}
            name="stock"
            className="form-control border-2 rounded-lg ml-1">
            <option value={0}>0</option>
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
        </div>
      </div>
    </div>
  );
}
