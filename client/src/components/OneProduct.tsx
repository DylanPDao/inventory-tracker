type ProductsProps = {
  imageUrl: string;
  name: string;
  productId: number;
  price: number;
  longDescription: string;
  stock: number;
};

export default function OneProduct({
  imageUrl,
  name,
  productId,
  price,
  longDescription,
  stock,
}: ProductsProps): JSX.Element {
  return (
    <div className="">
      <div className="">
        <img className="" alt={name} src={imageUrl} />
        <div className="">
          <div className="">{price}</div>
          <a className={`${productId} `} href="/add-to-cart">
            Add to cart
          </a>
        </div>
      </div>
      <div className="">
        <p className="">{name}</p>
        <p className="">{longDescription}</p>
        <p className="">{`Only ${stock} left!`}</p>
      </div>
    </div>
  );
}
