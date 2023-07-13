import { useState, useEffect } from 'react';
import { Api, toDollar, sortCart } from '../lib';
import { useParams } from 'react-router-dom';
import { LoadingSpinner, CartItem } from '../components';

export type CartProps = {
  imageUrl: string;
  name: string;
  price: number;
  productId: number;
  cartId: number;
  cartItemId: number;
  user?: string | undefined;
  quantity: number;
  priceId?: string;
};

export default function Cart() {
  const { viewCart, checkout } = Api();
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
      (cartItem: CartProps) =>
        (subTotal += Number(cartItem.price) * Number(cartItem.quantity))
    );
  }
  async function handleCheckout() {
    setIsLoading(true);
    const url = await checkout(cart);
    window.location.href = url;
    setIsLoading(false);
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }
  return (
    <div className="container">
      <h1 className="mt-4 mb-4 text-center text-2xl font-bold">Cart Items</h1>
      <div className="flex md:items-start flex-col md:flex-row items-center">
        <div className="w-full md:w-8/12 p-4">
          {cart &&
            cart.map((cartItem: CartProps) => (
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
        <div className="w-full md:w-4/12 flex justify-center p-4">
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
            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
