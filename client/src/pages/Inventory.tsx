import { FormEvent, useContext, useEffect, useState } from 'react';
import { LoadingSpinner, TableRowType, TableHeader } from '../components';
import { UserContext, Api } from '../lib';

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
    <TableHeader category={category} items={items} key={category} />
  ));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    //  setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(event.currentTarget);
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
