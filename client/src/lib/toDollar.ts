export default function toDollar(price: number) {
  const newPrice = Number(price);
  return `$${newPrice.toFixed(2)}`;
}
