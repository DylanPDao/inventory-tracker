import { Link } from 'react-router-dom';
import { BtnAddToCart } from '../components';
import { toDollar } from '../lib';

type Props = {
  imageUrl: string;
  name: string;
  productId: number;
  price: number;
};

export default function InfoCard({ imageUrl, name, productId, price }: Props) {
  return (
    <>
      <div className="md:w-3/12 m-4 w-full">
        <div className="w-full flex flex-col">
          <Link
            to={`/products/${productId}`}
            className="w-full flex items-center justify-center">
            <img className="w-10/12 pt-4" src={imageUrl} alt="product" />
          </Link>
          <div className="flex flex-col w-full">
            <Link to={`/products/${productId}`} className="w-full pt-2">
              <h5 className="text-l font-semibold dark:text-white w-full">
                {name}
              </h5>
            </Link>
            <div className="flex w-full pt-2 justify-center items-center">
              <div className=" font-bold text-gray-900 dark:text-white w-6/12">
                {toDollar(price)}
              </div>
              <BtnAddToCart
                quantity={1}
                className="text-white w-6/12 text-xs m-2 p-2 bg-blue-700 hover:bg-blue-800 active:ring-4 rounded-lg text-center"
                productId={productId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
