import BannerCarousel from '../components/BannerCarousel';

const banners = [
  { bannerUrl: '/images/Banner1.jpeg', id: 1 },
  { bannerUrl: '/images/Banner2.jpeg', id: 2 },
  { bannerUrl: '/images/Banner3.jpeg', id: 3 },
  { bannerUrl: '/images/Banner4.jpeg', id: 4 },
  { bannerUrl: '/images/Banner5.jpeg', id: 5 },
];

export default function LandingPage() {
  return <BannerCarousel banners={banners} />;
}
