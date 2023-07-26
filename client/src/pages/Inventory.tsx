import { FormEvent, useContext, useEffect, useState } from 'react';
import { LoadingSpinner, Modal } from '../components';
import { UserContext, Api } from '../lib';
import { OrderSheetType } from './OrderSheet';

export type TableRowType = {
  categoryId: number;
  categoryName: string;
  item: string;
  itemId: number;
  par: number;
  userId: number;
};

type SetOrderType = {
  setOrder: React.Dispatch<React.SetStateAction<OrderSheetType | undefined>>;
};
export default function Inventory({ setOrder }: SetOrderType) {
  const user = useContext(UserContext);
  const { getInventory, deleteItem, getOrder, setPar } = Api();
  const [inventory, setInventory] = useState<TableRowType[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(true);
  const [isModal, setModal] = useState(false);

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
  }, [getInventory, user?.user.userId, inventory, setLoading]);

  if (isLoading) return <LoadingSpinner />;

  if (isModal) return <Modal setModal={setModal} setInventory={setInventory} />;

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    //  setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const reqData = JSON.stringify({
      formData: data,
      userId: user?.user.userId,
    });
    try {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: reqData,
      };
      const order = await fetch('/api/createorder', req);
      const orderId = await order.json();
      const orderItems = await getOrder(orderId);
      console.log(orderItems);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  async function handleDelete(itemId: number) {
    try {
      setLoading(true);
      await deleteItem({ itemId });
      const inv = await getInventory(user?.user.userId);
      setInventory(inv);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  const inventorySheet = Object.entries(map).map(([category, items]) => (
    <div
      key={category}
      className="rounded-lg w-6/12 p-1 border-2 border-gold pt-4 pb-4">
      <div className="w-full flex justify-start">
        <div className="w-6/12 font-bold text-lg">{category}</div>
        <div className="w-6/12 flex justify-between">
          <div className="w-6/12">Par</div>
          <div className="w-6/12">In Stock</div>
        </div>
      </div>
      {items.map((item) => (
        <label key={item.itemId} className="form-label flex items-center">
          <button
            type="button"
            className="text-red-500 mr-4 w-1/12"
            onClick={() => handleDelete(item.itemId)}>
            x
          </button>
          <div className="w-5/12 flex text-start">
            <p className="text-md">{item.item}</p>
          </div>
          <div className="flex w-6/12 justify-between">
            <select
              defaultValue={`${item.par}`}
              name={`${item.item} par`}
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
              name={`${item.item} stock`}
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

  return (
    <div className="container flex justify-center">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setModal(true)}
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Add Item/Category
          </button>
          <button
            type="submit"
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Submit
          </button>
        </div>
        <div className="flex flex-wrap justify-between">{inventorySheet}</div>
      </form>
    </div>
  );
}
