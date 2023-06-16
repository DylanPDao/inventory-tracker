import AddOrSubItem from './AddOrSubItem';
import toDollar from '../lib/toDollar';
import { useState, useEffect } from 'react';
import { Api } from '../lib';

type CartProps = {
  imageUrl: string;
  name: string;
  price: number;
  productId: number;
  cartId: null | string;
};

export default function CartItem({
  imageUrl,
  name,
  price,
  productId,
  cartId,
}: CartProps) {
  const { getProduct } = Api();
  const [quantity, setQuantity] = useState(1);
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

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <>
      <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
        <img src={imageUrl} alt={name} className="w-full rounded-lg sm:w-40" />
        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
          <div className="mt-5 sm:mt-0">
            <h2 className="text-lg font-bold text-gray-900">{name}</h2>
          </div>
          <div className="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
            {<AddOrSubItem stock={product.stock} counts={setQuantity} />}
            <div className="flex items-center space-x-4">
              <p className="text-sm">{toDollar(price)}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
