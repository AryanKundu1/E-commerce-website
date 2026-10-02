import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import About from './pages/About';
import Journal from './pages/Journal';
import NotFound from './pages/NotFound';
import styles from './App.module.css';

// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => window.scrollTo(0, 0), [pathname]);
//   return null;
// }
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main" key={pathname} className={styles.page}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
