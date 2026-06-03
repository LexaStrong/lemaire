import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryImages } from '../data';

const HomePage = () => {
  const [modalImg, setModalImg] = useState(null);
  const galleryRef = useRef(null);

  // Intersection observer for gallery scroll animations
  useEffect(() => {
    const items = document.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      const delay = (i % 4) * 0.1;
      item.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* HERO */}
      <header id="home" className="hero">
        <div className="hero-slideshow-mobile">
          <div className="slide"></div>
          <div className="slide"></div>
          <div className="slide"></div>
          <div className="slide"></div>
          <div className="slide"></div>
        </div>
        <div className="hero-content">
          <h1 className="animate-up">
            African Elegance,<br />Hand-Sown for You
          </h1>
          <p className="animate-up delay-1">
            Discover the vibrant heritage of Ankara designs at Konongo's premier clothing boutique.
          </p>
          <div className="hero-btns animate-up delay-2">
            <a href="#collection" className="btn primary">Explore Collection</a>
            <Link to="/store" className="btn secondary">Shop Now</Link>
          </div>
        </div>
        <div className="hero-image-container animate-in">
          <img src="/assets/images/hero.png" alt="Ankara Dress Feature" className="hero-image" />
        </div>
      </header>

      {/* COLLECTION GALLERY (original) */}
      <section id="collection" className="gallery-section" ref={galleryRef}>
        <div className="section-header">
          <h2>Our Collection</h2>
          <p>Handcrafted dresses and unique Ankara patterns.</p>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div className="gallery-item" key={i} onClick={() => setModalImg(img)}>
              <img src={img} alt={`Lemaire Ankara Design ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="visit-us" className="contact-section">
        <div className="glass-card contact-info">
          <h2>Visit Our Store</h2>
          <p className="subtitle">Experience the quality of our fabrics in person.</p>

          <div className="info-group">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Location</h3>
              <p>JQFP+P9X, Accra - Kumasi Rd<br />Konongo</p>
            </div>
          </div>

          <div
            className="info-group"
            onClick={() => window.open('https://wa.me/233248293815', '_blank')}
            style={{ cursor: 'pointer' }}
            title="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
            <div>
              <h3>Contact</h3>
              <p>024 829 3815</p>
            </div>
          </div>

          <div className="info-group">
            <i className="fas fa-clock"></i>
            <div>
              <h3>Hours</h3>
              <p>Open · Closes 7 pm</p>
            </div>
          </div>
        </div>

        <div className="glass-card map-container" style={{ padding: 0, overflow: 'hidden' }}>
          <iframe
            src="https://maps.google.com/maps?q=JQFP%2BP9X%2C%20Accra%20-%20Kumasi%20Rd%2C%20Konongo&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lemaire Clothing Location"
          ></iframe>
        </div>
      </section>

      {/* IMAGE MODAL */}
      {modalImg && (
        <div className="modal show" onClick={() => setModalImg(null)}>
          <span className="modal-close" onClick={() => setModalImg(null)}>&times;</span>
          <img className="modal-content" src={modalImg} alt="Enlarged" />
        </div>
      )}
    </>
  );
};

export default HomePage;
