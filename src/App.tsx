import { useState, Suspense, lazy } from 'react';
import { Layout } from './components/Layout';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ModelComparison = lazy(() => import('./components/ModelComparison'));
const Recommendations = lazy(() => import('./components/Recommendations'));
const ESGReport = lazy(() => import('./components/ESGReport'));

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'comparison':
        return <ModelComparison />;
      case 'recommendations':
        return <Recommendations />;
      case 'reports':
        return <ESGReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
      <Suspense fallback={<div>Loading...</div>}>
        {renderScreen()}
      </Suspense>
    </Layout>
  );
}
