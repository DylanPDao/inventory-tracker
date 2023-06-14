import { useEffect, useState } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CurrencyYenIcon,
} from '@heroicons/react/24/outline';

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
    <div className="container">
      <div className="flex">
        <ArrowButton
          right={false}
          onShow={() =>
            setActiveIndex((activeIndex - 1 + banners.length) % banners.length)
          }
        />
        <Images banners={banners} isActive={activeIndex} />
        <ArrowButton
          right={true}
          onShow={() => setActiveIndex((activeIndex + 1) % banners.length)}
        />
      </div>
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
        className={isActive === banner.id ? '' : 'hidden'}
        key={banner.id}></img>
    );
  });
  return <div className="flex w-10/12">{bannerArr}</div>;
}

function ArrowButton({
  right,
  onShow,
}: {
  right: Boolean;
  onShow: () => void;
}) {
  return (
    <>
      {right ? (
        <ChevronRightIcon onClick={onShow} className="right w-1/12" />
      ) : (
        <ChevronLeftIcon onClick={onShow} className="left w-1/12" />
      )}
    </>
  );
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

  return <div className="flex h-4 justify-center">{buttons}</div>;
}
