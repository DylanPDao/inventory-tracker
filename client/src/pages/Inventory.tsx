import { FormEvent, useContext, useEffect, useState } from 'react';
import { LoadingSpinner } from '../components';
import { UserContext, Api } from '../lib';

type TableRowType = {
  categoryId: number;
  categoryName: string;
  item: string;
  itemId: number;
  par: number;
  userId: number;
};

export default function Inventory() {
  const user = useContext(UserContext);
  const { getInventory } = Api();
  const [inventory, setInventory] = useState<TableRowType[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getInv() {
      try {
        const inv = await getInventory(user?.user.userId);
        setInventory(inv);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    if (!inventory) getInv();
  }, [getInventory, user?.user.userId, inventory]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  type Map = {
    [key: string]: TableRowType[] | never;
  };
  const map: Map = {};
  if (inventory) {
    inventory.forEach((item: TableRowType | never) => {
      const name = item.categoryName;
      if (!map[name]) map[name] = [];
      map[name].push(item);
    });
  }

  const inventorySheet = Object.entries(map).map(([category, items]) => (
    <div className="rounded-lg w-6/12 p-1 border-2 border-gold pt-4 pb-4">
      <div className="w-full flex justify-start">
        <div className="w-6/12 font-bold text-lg">{category}</div>
        <div className="w-6/12 flex justify-between">
          <div className="w-6/12">Par</div>
          <div className="w-6/12">In Stock</div>
        </div>
      </div>
      {items.map((item) => (
        <label className="flex p-1">
          <div className="w-6/12 flex align-start">
            <p className="text-md">{item.item}</p>
          </div>
          <div className="flex w-6/12 justify-between">
            <select
              defaultValue={`${item.par}`}
              name={`${item.itemId} par`}
              className="form-control border-2 rounded-lg ml-1 w-6/12">
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
              name={`${item.itemId} stock`}
              className="form-control border-2 rounded-lg ml-1 w-6/12">
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
        </label>
      ))}
    </div>
  ));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    //  setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData);
    // try {
    //   const req = {
    //     method: 'POST',
    //     body: formData,
    //   };
    //   const res = await fetch('/api/create-order', req);
    //   const result = await res.json();
    //   if (!result) {
    //     return <div className="text-red-900 text-2xl">Order not created</div>;
    //   }
    //   setLoading(false);
    // } catch (err) {
    //   setError(err);
    // }
  }

  return (
    <div className="container flex justify-center">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Add Category
          </button>
          <button
            type="button"
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Add Item
          </button>
          <button
            type="submit"
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Submit
          </button>
        </div>
        <div className="flex flex-wrap">{inventorySheet}</div>
      </form>
    </div>
  );
}
