import { getProducts } from '../lib/Api';
import { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';

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
  console.log('catalog', type, searchString);
  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts({ type, searchString });
        setProducts(productList);
      } catch (err) {
        setError(err);
      }
    }
    loadProducts();
    console.log('called', type, searchString);
    debugger;
  }, [type, searchString]);

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
