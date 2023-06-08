import { Api } from '../lib/Api';
import { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';

export default function Catalog({ type }: { type: string }): JSX.Element {
  const { getProducts } = Api();
  const [products, setProducts] = useState<unknown>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts(type);
        setProducts(productList);
        console.log(products);
      } catch (err) {
        setError(err);
      }
    }
    if (!products) loadProducts();
  }, [products, type, getProducts]);

  return <></>;
}
