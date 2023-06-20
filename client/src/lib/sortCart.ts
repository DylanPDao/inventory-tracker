type Props = {
  imageUrl: string;
  name: string;
  price: number;
  productId: number;
  cartId: number;
  cartItemId: number;
  user: string | undefined;
  quantity: number;
};

export default function sortCart(cart: Props[]) {
  const sortedCart = cart.sort((a: Props, b: Props) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return sortedCart;
}
