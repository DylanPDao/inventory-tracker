import { useContext, useEffect, useState } from 'react';
import {
  LoadingSpinner,
  TableRow,
  TableRowType,
  TableHeader,
} from '../components';
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

  const mapValues = Object.values(map);
  const mapKeys = Object.keys(map);

  const vals = mapValues.map((value) =>
    value.map((val) => (
      <TableRow
        categoryId={val.categoryId}
        categoryName={val.categoryName}
        item={val.item}
        itemId={val.itemId}
        par={val.par}
        userId={val.userId}
      />
    ))
  );

  return (
    <div className="container flex justify-center mt-10">
      <form className="flex flex-wrap">{vals}</form>
    </div>
  );
}
