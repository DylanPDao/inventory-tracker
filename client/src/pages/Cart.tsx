import { useState, useEffect } from 'react';
import { Api } from '../lib';
import { useParams } from 'react-router-dom';
import CartItem from '../components/CartItem';

type Props = {
  imageUrl: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  productId: number;
  cartId: null | string;
};

export default function Cart() {
  const { viewCart } = Api();
  const [cart, setCart] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const user = useParams();

  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await viewCart(user.userId);
        console.log(cart);
        setCart(cart);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!cart) loadCart();
  }, [cart, viewCart, user]);

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }
  return (
    <div className="h-screen bg-gray-100 pt-20">
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      {cart &&
        cart.map((cartItem: Props) => (
          <CartItem
            name={cartItem.name}
            price={cartItem.price}
            imageUrl={cartItem.imageUrl}
            productId={cartItem.productId}
            cartId={cartItem.cartId}
          />
        ))}
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">$129.99</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">$4.99</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div className="">
              <p className="mb-1 text-lg font-bold">$134.98 USD</p>
              <p className="text-sm text-gray-700">including VAT</p>
            </div>
          </div>
          <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
