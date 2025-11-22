
import Layout from '../../components/layout/Layout';
import Hero from './components/Hero';
import SampleVideo from './components/SampleVideo';
import FeaturedProducts from './components/FeaturedProducts';
import HowItWorks from './components/HowItWorks';
import ReminderService from './components/ReminderService';
import TrustSection from './components/TrustSection';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <SampleVideo />
      <FeaturedProducts />
      <HowItWorks />
      <ReminderService />
      <TrustSection />
    </Layout>
  );
};

export default HomePage;
