import { Api } from '../lib/Api';
import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import OneProduct from '../components/OneProduct';

export default function ProductDetails() {
  type ProductProps = {
    imageUrl: string;
    name: string;
    productId: number;
    price: number;
    longDescription: string;
    stock: number;
  };

  const { getProduct } = Api();
  const { productId } = useParams();

  const [product, setProduct] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProduct(productId);
        setProduct(product);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!product) loadProduct();
  }, [productId, getProduct, product]);

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }

  if (!product) return null;
  return (
    <div className="container ml-auto mr-auto">
      {product ? (
        <OneProduct
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          productId={product.productId}
          longDescription={product.longDescription}
          stock={product.stock}
        />
      ) : null}
    </div>
  );
}
