import BannerCarousel from '../components/BannerCarousel';

const banners = [
  '/images/Banner1.jpeg',
  '/images/Banner2.jpeg',
  '/images/Banner4.jpeg',
  '/images/Banner5.jpeg',
  '/images/Banner6.jpeg',
];

export default function LandingPage() {
  return <BannerCarousel banners={banners} />;
}
