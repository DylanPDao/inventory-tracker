import { Link } from 'react-router-dom';
import AddOrSubItem from '../components/AddOrSubItem';

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
  return (
    <div className="flex justify-center items-center border-2 mt-4">
      <div className="w-6/12 flex">
        <img className="w-full" alt={name} src={imageUrl} />
      </div>
      <div className="w-6/12">
        <p className="mb-4 text-2xl font-bold">{name}</p>
        <div className="mb-2 w-full flex justify-center items-center">
          <p className="w-6/12 text-red-600">{`Only ${stock} left!`}</p>
          <AddOrSubItem stock={stock} />
        </div>
        <div className="mb-2 flex items-center justify-around">
          <div className="w-2/12 text-blue-900 text-2xl">{`$${price}`}</div>
          <Link
            className={`${productId} text-white w-2/12 text-xs m-2 p-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 rounded-lg text-center`}
            to="/add-to-cart">
            Add to cart
          </Link>
        </div>
        <div className="h-56 overflow-auto pr-2 text-left w-11/12 ml-auto mr-auto">
          {longDescription}
        </div>
      </div>
    </div>
  );
}
