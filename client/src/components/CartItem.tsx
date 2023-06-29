import AddOrSubItem from './AddOrSubItem';
import { useState, useEffect } from 'react';
import { Api, toDollar, sortCart } from '../lib';
import { Params } from 'react-router-dom';

type CartProps = {
  imageUrl: string;
  name: string;
  price: number;
  productId: number;
  cartId: number;
  cartItemId: number;
  setCart: React.Dispatch<React.SetStateAction<[]>>;
  user: Readonly<Params<string>>;
  quantityCart: number;
};

export default function CartItem({
  imageUrl,
  name,
  price,
  productId,
  cartId,
  cartItemId,
  setCart,
  user,
  quantityCart,
}: CartProps) {
  const { getProduct, deleteCartItem, viewCart, updateCart } = Api();
  const [product, setProduct] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadCart() {
      try {
        const product = await getProduct(productId);
        setProduct(product);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!product) loadCart();
  }, [getProduct, product, productId]);

  async function handleClick() {
    try {
      await deleteCartItem({ cartId, cartItemId });
      const cart = await viewCart(user.userId);
      setCart(cart);
    } catch (err) {
      setError(err);
    }
  }

  async function handleQuantityChange(quantity: number) {
    try {
      await updateCart({ quantity, cartId, cartItemId });
      let cart = await viewCart(user.userId);
      cart = sortCart(cart);
      setCart(cart);
    } catch (err) {
      setError(err);
    }
  }

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <>
      <div className="justify-between mb-6 rounded-lg bg-gray-100 p-6 shadow-md md:flex md:justify-start">
        <img src={imageUrl} alt={name} className="w-full rounded-lg md:w-40" />
        <div className="md:ml-4 md:flex md:w-full md:justify-between">
          <div className="mt-5 md:mt-0 flex justify-center">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{name}</h2>
          </div>
          <div className="flex flex-col justify-around">
            {
              <AddOrSubItem
                quantityCart={quantityCart}
                stock={product.stock}
                counts={handleQuantityChange}
              />
            }
            <div className="mt-2 flex justify-center items-center space-x-4">
              <p className="text-md">{toDollar(price)}</p>
              <svg
                onClick={handleClick}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
