import { useNavigate } from 'react-router-dom';
import { UserContext, Api } from '../lib';
import { useContext, useEffect, useState } from 'react';
import { LoadingSpinner } from '../components';
import { OrderSheetType } from './OrderSheet';

type OrdersType = {
  orderId: string;
  orderedAt: string;
  userId: number;
  username: string;
};
type SetOrderType = {
  setOrder: React.Dispatch<React.SetStateAction<OrderSheetType | undefined>>;
};
export default function Orders({ setOrder }: SetOrderType) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrdersType[]>();
  const { getAllOrders, getOrder } = Api();

  useEffect(() => {
    async function getOrders() {
      try {
        setLoading(true);
        const res = await getAllOrders(user?.user.userId);
        setOrders(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    if (!orders) getOrders();
  }, [getAllOrders, orders, user?.user.userId]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  async function handleClick(event: any) {
    console.log(event.target.innerHTML);
    const orderId = event.target.innerHTML;
    setLoading(true);
    const orderItems = await getOrder(orderId);
    setOrder(orderItems);
    navigate('/ordersheet');
    setLoading(false);
  }

  return (
    <div className="container flex justify-center flex-col">
      <div className="w-full flex justify-end mb-2">
        {user ? (
          <></>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
            Sign In/Up
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate(`/inventory/${user?.user.userId}`)}
          className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
          Inventory Sheet
        </button>
        <button
          type="button"
          onClick={() => navigate(`/sign-out`)}
          className="mt-2 border rounded-lg p-1 border-gold text-gold mr-1 ml-1">
          Sign out
        </button>
      </div>
      <div>
        {!orders ? (
          <></>
        ) : (
          <>
            <div className="flex flex-col">
              <div className="flex">
                <div className="w-4/12 text-2xl pt-2 pb-2">User</div>
                <div className="w-4/12 text-2xl pt-2 pb-2">Order Id:</div>
                <div className="w-4/12 text-2xl pt-2 pb-2">Order Date:</div>
              </div>
            </div>
            <div>
              {orders.reverse().map((order: OrdersType) => (
                <div
                  key={order.orderId}
                  className="flex w-full border-2 border-gold m-2">
                  <div className="w-4/12 text-md pt-2 pb-2 flex items-center justify-center">
                    {order.username}
                  </div>
                  <div className="w-4/12 text-md pt-2 pb-2 flex items-center justify-center">
                    <button
                      className="pointer"
                      onClick={(event) => handleClick(event)}>
                      {order.orderId}
                    </button>
                  </div>
                  <div className="w-4/12 text-md pt-2 pb-2 flex items-center justify-center">
                    {order.orderedAt}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
