import { useEffect, useState } from 'react';
import { CurrencyYenIcon } from '@heroicons/react/24/outline';

type Props = {
  banners: BannerProps[];
};

type BannerProps = {
  bannerUrl: string;
  id: number;
};

export default function BannerCarousel({ banners }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length, activeIndex]);

  return (
    <div className="container px-8 mt-4">
      <Images banners={banners} isActive={activeIndex} />
      <Indicators
        banners={banners}
        onSelect={(e) => setActiveIndex(e)}
        isActive={activeIndex}
      />
    </div>
  );
}
type imagesProp = {
  banners: BannerProps[];
  isActive: number;
};
function Images({ banners, isActive }: imagesProp) {
  const bannerArr: JSX.Element[] = [];
  banners.map((banner) => {
    bannerArr.push(
      <img
        src={banner.bannerUrl}
        alt="pokemon"
        className={isActive === banner.id ? 'w-full rounded-xl' : 'hidden'}
        key={banner.id}></img>
    );
  });
  return <div className="w-full mt-0">{bannerArr}</div>;
}

type indicatorProps = {
  banners: BannerProps[];
  onSelect: (id: number) => void;
  isActive: number;
};
function Indicators({ banners, onSelect, isActive }: indicatorProps) {
  const buttons: JSX.Element[] = [];
  banners.map((banner) => {
    buttons.push(
      <CurrencyYenIcon
        key={banner.id}
        onClick={() => onSelect(banner.id)}
        className={
          isActive === banner.id ? 'indicator text-primary' : 'indicator'
        }
      />
    );
  });

  return (
    <div className="relative flex h-6 justify-center bottom-12">{buttons}</div>
  );
}
