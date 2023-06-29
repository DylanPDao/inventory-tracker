import BannerCarousel from '../components/BannerCarousel';

const banners = [
  { bannerUrl: '/images/Banner1.jpeg', id: 1 },
  { bannerUrl: '/images/Banner2.jpeg', id: 2 },
  { bannerUrl: '/images/Banner3.jpeg', id: 3 },
  { bannerUrl: '/images/Banner4.jpeg', id: 4 },
  { bannerUrl: '/images/Banner0.jpeg', id: 0 },
];

const mobileBanners = banners.map((banner) => (
  <li className="md:hidden p-2" key={banner.bannerUrl}>
    <img alt="banner" src={banner.bannerUrl} />
  </li>
));

export default function LandingPage() {
  return (
    <div className="container">
      <div className="hidden md:block">
        <BannerCarousel banners={banners} />
      </div>
      <ul>{mobileBanners}</ul>
    </div>
  );
}
