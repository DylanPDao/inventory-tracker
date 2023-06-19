import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

type Props = {
  stock: number;
  counts: (count: number) => void;
  quantityCart: number;
};

export default function AddOrSubItem({
  stock,
  counts,
  quantityCart,
}: Props): JSX.Element {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (quantityCart) {
      setCount(quantityCart);
    }
  }, [quantityCart]);

  function handlePlus() {
    if (count >= stock) {
      return;
    } else {
      setCount(count + 1);
      counts(count + 1);
    }
  }

  function handleMinus() {
    if (count >= 2) {
      setCount(count - 1);
      counts(count - 1);
    }
  }

  return (
    <div className="w-full flex  justify-around items-center">
      <button className="flex justify-center w-4/12" onClick={handleMinus}>
        <MinusIcon className="w-6" />
      </button>
      <div className="w-4/12">
        <p className="text-xl font-bold">{count}</p>
      </div>
      <button className="flex justify-center w-4/12" onClick={handlePlus}>
        <PlusIcon className="w-6" />
      </button>
    </div>
  );
}
