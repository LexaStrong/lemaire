import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import ImmersiveTryOn from './pages/ImmersiveTryOn';
import CartPage from './pages/CartPage';
import Dashboard from './pages/Dashboard';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:id" element={<ProductPage />} />
          <Route path="/store/:id/try-on" element={<ImmersiveTryOn />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
