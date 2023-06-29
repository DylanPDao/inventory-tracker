import { Api } from '../lib/Api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OneProduct, LoadingSpinner } from '../components';

export default function ProductDetails() {
  const { getProduct } = Api();
  const { productId } = useParams();
  const [product, setProduct] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProduct(productId);
        setProduct(product);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, getProduct]);

  if (isLoading) return <LoadingSpinner />;

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
