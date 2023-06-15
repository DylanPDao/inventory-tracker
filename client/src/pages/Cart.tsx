import { useState, useEffect } from 'react';
import { Api } from '../lib';
import { useParams } from 'react-router-dom';

export default function Cart() {
  const { viewCart } = Api();
  const [cart, setCart] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const user = useParams();

  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await viewCart(user.userId);
        setCart(cart);
        console.log(cart);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!cart) loadCart();
  }, [cart, viewCart, user]);

  if (isLoading) return <div> Loading... </div>;

  if (error) {
    console.error('Fetch error:', error);
    return <div>{`Error! ${error}`}</div>;
  }
  return <></>;
}
