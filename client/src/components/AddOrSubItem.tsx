import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AddOrSubItem({ stock }: { stock: number }) {
  const [count, setCount] = useState(1);

  function handlePlus() {
    if (count >= stock) {
      return;
    } else {
      setCount(count + 1);
    }
  }

  function handleMinus() {
    if (count === 1) {
      return;
    } else {
      setCount(count - 1);
    }
  }

  return (
    <div className="w-6/12 flex  justify-around items-center">
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
