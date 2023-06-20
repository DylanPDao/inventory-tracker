import { useState, useEffect } from 'react';
import { Api, toDollar, sortCart } from '../lib';
import { useParams } from 'react-router-dom';
import CartItem from '../components/CartItem';

type Props = {
  imageUrl: string;
  name: string;
  price: number;
  productId: number;
  cartId: number;
  cartItemId: number;
  user: string | undefined;
  quantity: number;
};

export default function Cart() {
  const { viewCart } = Api();
  const [cart, setCart] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const user = useParams();
  let subTotal = 0;

  useEffect(() => {
    async function loadCart() {
      try {
        let cart = await viewCart(user.userId);
        cart = sortCart(cart);
        setCart(cart);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!cart) loadCart();
  }, [cart, viewCart, user, subTotal]);

  if (cart) {
    cart.map(
      (cartItem: Props) =>
        (subTotal += Number(cartItem.price) * Number(cartItem.quantity))
    );
  }

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }
  return (
    <div className="container">
      <h1 className="mt-4 mb-4 text-center text-2xl font-bold">Cart Items</h1>
      <div className="flex items-start">
        <div className="w-8/12 p-4">
          {cart &&
            cart.map((cartItem: Props) => (
              <CartItem
                user={user}
                setCart={setCart}
                key={cartItem.productId}
                name={cartItem.name}
                price={cartItem.price}
                imageUrl={cartItem.imageUrl}
                productId={cartItem.productId}
                cartId={cartItem.cartId}
                cartItemId={cartItem.cartItemId}
                quantityCart={cartItem.quantity}
              />
            ))}
        </div>
        <div className="w-4/12 flex justify-center p-4">
          <div className="w-full rounded-lg border bg-gray-100 shadow-md p-4">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">{toDollar(subTotal)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">$4.99</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div className="">
                <p className="mb-1 text-lg font-bold">
                  {toDollar(subTotal + 4.99)} USD
                </p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
