import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Lemaire Clothing" className="footer-logo" />
        </Link>
        <div className="footer-links-group">
          <Link to="/">Home</Link>
          <Link to="/store">Store</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/admin">Admin</Link>
        </div>
        <p>&copy; 2026 Lemaire Clothing. All rights reserved.</p>
        <div className="footer-socials">
          <a href="https://www.instagram.com/lemaireclothings/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
