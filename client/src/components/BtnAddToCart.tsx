import { useState } from 'react';
import { Api } from '../lib/Api';
import { UserContext } from '../lib/UserContext';
import { useContext } from 'react';

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
  const user = useContext(UserContext);

  async function handleAdd() {
    try {
      const product = await getProduct(productId);
      await addToCart({ product, quantity, user });
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
