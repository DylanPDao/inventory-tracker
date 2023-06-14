import { useState } from 'react';
import { Api } from '../lib/Api';

type Props = {
  productId: string | number;
  className: string;
  quantity: number;
};

export default function BtnAddToCart({
  productId,
  className,
  quantity,
}: Props) {
  const { getProduct, addToCart } = Api();
  const [error, setError] = useState<unknown>();

  async function handleAdd() {
    try {
      const product = await getProduct(productId);
      console.log(product);
      console.log(quantity);
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    console.error('Could not fetch product!:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <button className={className} onClick={handleAdd}>
      Add to cart
    </button>
  );
}
