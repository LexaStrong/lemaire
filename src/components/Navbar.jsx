import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, X, Menu } from 'lucide-react';
import { useCart } from '../CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const close = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo-container">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Lemaire Clothing Logo" className="logo" />
        </Link>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={close}>Home</NavLink>
        {isHome ? (
          <a href="#collection" onClick={close}>Collection</a>
        ) : (
          <Link to="/#collection" onClick={close}>Collection</Link>
        )}
        {isHome ? (
          <a href="#visit-us" onClick={close}>Visit Us</a>
        ) : (
          <Link to="/#visit-us" onClick={close}>Visit Us</Link>
        )}
        <NavLink
          to="/store"
          className={({ isActive }) => `nav-store-link${isActive ? ' active' : ''}`}
          onClick={close}
        >
          Shop Now
        </NavLink>
        <div className="social-links mobile-socials">
          <a href="https://www.instagram.com/lemaireclothings/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>

      <div className="nav-actions">
        <div className="social-links desktop-socials">
          <a href="https://www.instagram.com/lemaireclothings/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
        <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(o => !o)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
