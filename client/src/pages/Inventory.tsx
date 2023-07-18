import { useContext, useEffect, useState } from 'react';
import { LoadingSpinner, TableRowType } from '../components';
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
  console.log(Object.values(map));
  console.log(Object.keys(map));
  return (
    <div className="container flex justify-center mt-10">
      <form></form>
    </div>
  );
}
