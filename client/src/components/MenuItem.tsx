import { Link } from 'react-router-dom';
type Props = {
  src: string;
  alt: string;
  text: string;
  link: string;
};

export default function MenuItem({ src, alt, text, link }: Props): JSX.Element {
  return (
    <>
      <Link to={link} className="w-1/4 flex items-center justify-center">
        <div className="mr-2">
          <img className="h-10" alt={alt} src={src} />
        </div>
        <h1 className="">{text}</h1>
      </Link>
    </>
  );
}
