import '@/scss/globals.scss';
import '@/styles/utils/_container.scss';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Detail } from '@/pages/Detail';
import Favorites from '@/pages/Favorites/Favorites';
import { SearchProvider } from '@/context/SearchContext';
import { ToastProvider } from '@/provider/ToastProvider/ToastProvider';
import { SearchOverlayResults } from '@/components/ui/SearchOverlayResults/SearchOverlayResults';
import './App.scss';

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <SearchProvider>
        <div className='app-root'>
          <Header />
          {location.pathname !== '/favorites' && (
            <SearchOverlayResults />
          )}

          <main className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/detail/:id' element={<Detail />} />
              <Route path='/favorites' element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </ToastProvider>
  );
}
export default App;
