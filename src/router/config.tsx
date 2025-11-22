
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components
const Home = lazy(() => import('../pages/home/page'));
const About = lazy(() => import('../pages/about/page'));
const SantaMessages = lazy(() => import('../pages/santa-messages/page'));
const GreetingVideos = lazy(() => import('../pages/greeting-videos/page'));
const Bundles = lazy(() => import('../pages/bundles/page'));
const CardsGifts = lazy(() => import('../pages/cards-gifts/page'));
const RetailWholesale = lazy(() => import('../pages/retail-wholesale/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const Account = lazy(() => import('../pages/account/page'));
const Success = lazy(() => import('../pages/success/page'));
const Cancel = lazy(() => import('../pages/cancel/page'));
const VideoApproval = lazy(() => import('../pages/video-approval/page'));
const PrivacyPolicy = lazy(() => import('../pages/privacy-policy/page'));
const AdminVideoDashboard = lazy(() => import('../pages/admin/video-dashboard'));
const TestDashboard = lazy(() => import('../pages/test-dashboard/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/santa-messages',
    element: <SantaMessages />,
  },
  {
    path: '/greeting-videos',
    element: <GreetingVideos />,
  },
  {
    path: '/bundles',
    element: <Bundles />,
  },
  {
    path: '/cards-gifts',
    element: <CardsGifts />,
  },
  {
    path: '/retail-wholesale',
    element: <RetailWholesale />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/account',
    element: <Account />,
  },
  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/cancel',
    element: <Cancel />,
  },
  {
    path: '/approve-video',
    element: <VideoApproval />,
  },
  {
    path: '/video-approval',
    element: <VideoApproval />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/admin/video-dashboard',
    element: <AdminVideoDashboard />,
  },
  {
    path: '/test-dashboard',
    element: <TestDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
