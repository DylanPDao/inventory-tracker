type Props = {
  productId: string | number;
  className: string;
};

export default function BtnAddToCart({ productId, className }: Props) {
  function handleAdd() {
    console.log('yay');
  }

  return (
    <button className={className} onClick={handleAdd}>
      Add to cart
    </button>
  );
}
