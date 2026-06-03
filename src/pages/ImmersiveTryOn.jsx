import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag, MoveHorizontal } from 'lucide-react';
import { galleryImages } from '../data';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import '../styles/store.css';

const ImmersiveTryOn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  // Find initial product to determine category
  const initialProduct = products.find((p) => p.id === Number(id));
  
  // Create a list of related items or different visuals for the immersive experience
  // In a real app this would be a list of 3D models or different color variants of the same product.
  const immersiveItems = products.filter(p => !initialProduct || p.category === initialProduct.category).slice(0, 5);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Automatically hide gesture instructions after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Ensure index aligns with ID on load if possible
  useEffect(() => {
    if (initialProduct) {
      const idx = immersiveItems.findIndex(p => p.id === initialProduct.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentItem = immersiveItems[currentIndex] || immersiveItems[0];

  // Gesture handling
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
    setShowInstructions(false); // Hide instructions as soon as user interacts
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0 && currentIndex < immersiveItems.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else if (touchDelta.current > 0 && currentIndex > 0) {
        setCurrentIndex((p) => p - 1);
      }
    }
    touchStart.current = null;
    touchDelta.current = 0;
  }, [currentIndex, immersiveItems.length]);

  const handleAddToCart = () => {
    if (currentItem) {
      const size = currentItem.sizes ? currentItem.sizes[0] : null;
      addToCart(currentItem, size);
      // Optional: show a quick immersive toast
    }
  };

  if (!currentItem) return <div style={{color:'white'}}>Item not found.</div>;

  return (
    <div className="immersive-container">
      
      {/* Background Media */}
      <div 
        className="immersive-media"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="full-screen-img"
          />
        </AnimatePresence>
      </div>

      {/* Top Bar Navigation */}
      <div className="immersive-header">
        <button onClick={() => navigate(-1)} className="immersive-back-btn" aria-label="Go back">
          <ChevronLeft color="white" size={28} />
        </button>
      </div>

      {/* Gesture Instructions Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            className="immersive-instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <MoveHorizontal size={32} />
            <p>Swipe to try on another outfit</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interface */}
      <div className="immersive-bottom-interface">
        
        {/* Floating Product Info */}
        <motion.div 
          className="floating-product-info"
          key={`info-${currentItem.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>{currentItem.name}</h3>
          <p>GH₵ {currentItem.price.toFixed(2)}</p>
        </motion.div>

        {/* Variant Carousel */}
        <div className="variant-carousel">
          {immersiveItems.map((item, idx) => (
            <button
              key={item.id}
              className={`variant-thumb ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                setShowInstructions(false);
              }}
              aria-label={`Switch to ${item.name}`}
            >
              <img src={item.image} alt={item.name} />
            </button>
          ))}
        </div>

        {/* Sticky Footer */}
        <div className="immersive-sticky-footer">
          <button 
            className="btn-see-detail" 
            onClick={() => navigate(`/store/${currentItem.id}`)}
          >
            See Detail
          </button>
          <button 
            className="btn-add-cart-immersive" 
            onClick={handleAddToCart}
          >
            <ShoppingBag size={18} /> Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveTryOn;
