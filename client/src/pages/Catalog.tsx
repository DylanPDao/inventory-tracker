import { getProducts } from '../lib/Api';
import { useState, useEffect } from 'react';
import { LoadingSpinner, InfoCard } from '../components';

type ProductsProps = {
  imageUrl: string;
  name: string;
  productId: number;
  price: number;
};

type Props = {
  type: string;
  searchString?: string | undefined;
};

export default function Catalog({ type, searchString }: Props): JSX.Element {
  const [products, setProducts] = useState<any[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts({ type, searchString });
        setProducts(productList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [type, searchString]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  return (
    <div className="container">
      <div className="flex md:flex-wrap flex-col md:flex-row justify-center items-end">
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
