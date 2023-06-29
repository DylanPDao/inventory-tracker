import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export type ProductProps = {
  imageUrl: string;
  longDescription: string;
  name: string;
  price: string;
  productId: number;
  stock: number;
  type: string;
};

export type Props = {
  searchString: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function SearchBar({ searchString }: Props) {
  const [effect, setEffect] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState<any[]>();
  const [error, setError] = useState<any>();
  const [filteredProducts, setFiltered] = useState<any[]>();
  const [isActive, setActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const req = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'all' }),
        };
        const res = await fetch('/catalog', req);
        if (!res.ok) throw new Error(`fetch Error ${res.status}`);
        const product = await res.json();
        setProducts(product);
      } catch (err) {
        setError(err);
      }
    }
    loadProducts();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value.toLowerCase());
    if (products) {
      const filterProducts = products.filter((product) =>
        product.name.toLowerCase().includes(inputValue)
      );
      setFiltered(filterProducts);
      setActive(true);
    }
  }

  function handleBlur() {
    setTimeout(() => setActive(false), 250);
    setInputValue('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    searchString(inputValue);
    navigate('/catalog/search');
    setInputValue('');
  }

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <div className="w-full flex justify-center items-center flex-col relative">
      <form className="w-full" onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            onBlur={handleBlur}
            value={inputValue}
            onChange={handleChange}
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg"
            placeholder="Search..."
            required></input>
          <button
            type="submit"
            className={`${
              effect && 'animate-wiggle'
            } absolute right-8 bottom-2 font-medium rounded-lg text-sm px-4 py-2`}
            onClick={() => setEffect(true)}
            onAnimationEnd={() => setEffect(false)}>
            Search
          </button>
        </div>
      </form>
      <div
        className={`${
          isActive || 'hidden'
        } top-14 absolute flex flex-col bg-white border-2 border-gray-200 rounded-lg w-full`}>
        {isActive &&
          filteredProducts &&
          filteredProducts.map((product) => (
            <Link
              key={product.productId}
              to={`/products/${product.productId}`}
              className="text-gray-900">
              {product.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
