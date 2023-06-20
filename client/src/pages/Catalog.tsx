import { Api } from '../lib/Api';
import { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';
import { ProductProps } from '../components/SearchBar';

type ProductsProps = {
  imageUrl: string;
  name: string;
  productId: number;
  price: number;
};

type Props = {
  type: string;
  filtered?: ProductProps[];
};

export default function Catalog({
  type,
  filtered = undefined,
}: Props): JSX.Element {
  const { getProducts } = Api();
  const [products, setProducts] = useState<any[]>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts(type);
        setProducts(productList);
      } catch (err) {
        setError(err);
      }
    }
    loadProducts();
  }, [products, type, getProducts]);

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <div className="container">
      <div className="flex flex-wrap justify-center items-end">
        {products
          ? products.map((product: ProductsProps) => (
              <InfoCard
                key={product.productId}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                productId={product.productId}
              />
            ))
          : null}
      </div>
    </div>
  );
}
