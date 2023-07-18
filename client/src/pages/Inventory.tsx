import { useContext, useEffect, useState } from 'react';
import { LoadingSpinner } from '../components';
import { UserContext, Api } from '../lib';

export default function Inventory() {
  const user = useContext(UserContext);
  const { getInventory } = Api();
  const [inventory, setInventory] = useState<any>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getInv() {
      try {
        const inv = await getInventory(user?.user.userId);
        setInventory(inv);
        console.log(inv);
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

  return <div></div>;
}
