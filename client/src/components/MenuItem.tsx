type Props = {
  src: string;
  alt: string;
  text: string;
};

export default function MenuItem({ src, alt, text }: Props): JSX.Element {
  return (
    <>
      <div className="w-1/4 flex items-center justify-center">
        <img className="h-10" alt={alt} src={src} />
        <h1 className="">{text}</h1>
      </div>
    </>
  );
}
