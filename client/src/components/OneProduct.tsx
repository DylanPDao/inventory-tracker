import { BtnAddToCart, AddOrSubItem } from '../components';
import { useState } from 'react';
import { toDollar } from '../lib';

type ProductsProps = {
  imageUrl: string;
  name: string;
  productId: number;
  price: number;
  longDescription: string;
  stock: number;
};

export default function OneProduct({
  imageUrl,
  name,
  productId,
  price,
  longDescription,
  stock,
}: ProductsProps): JSX.Element {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center border-2 mt-4">
      <div className="w-6/12 flex justify-center">
        <img className="w-10/12 lg:w-6/12" alt={name} src={imageUrl} />
      </div>
      <div className="md:w-6/12 w-full">
        <p className="mb-4 text-2xl font-bold">{name}</p>
        <div className="mb-2 w-full flex justify-center items-center">
          <p className="w-6/12 text-red-600">{`Only ${stock} left!`}</p>
          <div className="w-6/12">
            <AddOrSubItem quantityCart={1} counts={setQuantity} stock={stock} />
          </div>
        </div>
        <div className="mb-2 flex items-center justify-around">
          <div className="w-2/12 text-blue-900 text-2xl">{toDollar(price)}</div>
          <BtnAddToCart
            quantity={quantity}
            className="text-white w-2/12 text-xs m-2 p-2 bg-blue-700 hover:bg-blue-800 active:ring-4 rounded-lg text-center"
            productId={productId}
          />
        </div>
        <div className="h-56 overflow-auto pr-2 text-left w-11/12 ml-auto mr-auto">
          {longDescription}
        </div>
      </div>
    </div>
  );
}
