import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingBag, Minus, Plus, Truck, Shield,
  RotateCcw, Heart, Star, BadgeCheck, ChevronDown, ChevronUp, Maximize
} from 'lucide-react';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import '../styles/store.css';

// Social proof data (simulated)
const SOCIAL_PROOF = { rating: 4.3, reviews: 128, sold: '10k+' };

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [qty, setQty] = useState(1);
  const [addedCartStatus, setAddedCartStatus] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Touch carousel state
  const carouselRef = useRef(null);
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setDescExpanded(false);
    setQty(1);
    setAddedCartStatus(false);
    setWishlisted(false);
  }, [id]);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Build gallery
  const gallery = product?.images && product.images.length > 1
    ? product.images
    : product ? [product.image] : [];

  // MOCK COLORS for demonstration
  const colors = [
    { name: 'black', hex: '#222222' },
    { name: 'burgundy', hex: '#800020' },
    { name: 'emerald', hex: '#50C878' },
    { name: 'sand', hex: '#C2B280' },
  ];

  // Swipe handlers for mobile carousel
  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStart.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0 && activeImg < gallery.length - 1) {
        setActiveImg((p) => p + 1);
      } else if (touchDelta.current > 0 && activeImg > 0) {
        setActiveImg((p) => p - 1);
      }
    }
    touchStart.current = null;
    touchDelta.current = 0;
  }, [activeImg, gallery.length]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/store" className="btn primary">Back to Store</Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product, selectedSize);
    }
    setAddedCartStatus(true);
    setTimeout(() => setAddedCartStatus(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    navigate('/cart');
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Truncate description for mobile "Read More"
  const DESC_LIMIT = 100;
  const descTruncated = product.description.length > DESC_LIMIT;
  const descText = descExpanded || !descTruncated
    ? product.description
    : product.description.slice(0, DESC_LIMIT) + '...';

  // Star rating display
  const fullStars = Math.floor(SOCIAL_PROOF.rating);
  const halfStar = SOCIAL_PROOF.rating % 1 >= 0.5;

  // Psychological Pricing Math (assuming current is discounted)
  const discountRate = 0.25; // 25%
  const originalPrice = Math.round(product.price / (1 - discountRate));

  const scrollVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="product-page">

      {/* ── Mobile: Minimal header ── */}
      <div className="pdp-mobile-header">
        <button onClick={() => navigate(-1)} className="pdp-mobile-back" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <button
          className={`pdp-mobile-heart${wishlisted ? ' active' : ''}`}
          onClick={() => setWishlisted(w => !w)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={20} fill={wishlisted ? 'var(--primary)' : 'none'} />
        </button>
      </div>

      {/* ── Desktop breadcrumb ── */}
      <div className="product-breadcrumb product-breadcrumb-desktop">
        <button onClick={() => navigate(-1)} className="back-link">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="breadcrumb-trail">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/store">Store</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      {/* ── Product Detail (Grid layout on mobile via CSS) ── */}
      <div className="product-detail">

        {/* Gallery column */}
        <motion.div
          className="product-detail-gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main image / Mobile Carousel */}
          <div
            className="product-detail-main-image"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={gallery[activeImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {/* Immersive CTA Overlay */}
            <button 
              className="pdp-immersive-btn" 
              onClick={() => navigate(`/store/${product.id}/try-on`)}
              aria-label="View in Immersive Mode"
            >
               <Maximize size={16} /> <span>Virtual Try-On</span>
            </button>

            {/* Image counter badge (mobile) */}
            {gallery.length > 1 && (
              <div className="pdp-img-counter">
                {activeImg + 1}/{gallery.length}
              </div>
            )}

            {/* Carousel dots (mobile) */}
            {gallery.length > 1 && (
              <div className="pdp-carousel-dots">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`pdp-dot${activeImg === i ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop thumbnails */}
          {gallery.length > 1 && (
            <div className="product-detail-thumbs">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  className={`product-thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info column */}
        <div className="product-detail-info mobile-grid-layout">
          
          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pdp-brand-row">
              <span className="pdp-brand-name">
                <BadgeCheck size={14} className="pdp-verified" />
                Lemaire
              </span>
              <span className="product-detail-category">{product.category}</span>
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            {/* Star rating + Social proof */}
            <div className="pdp-social-proof">
              <div className="pdp-stars" aria-label={`Rating: ${SOCIAL_PROOF.rating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < fullStars ? '#f5a623' : (i === fullStars && halfStar ? '#f5a623' : 'none')}
                    stroke={i < fullStars || (i === fullStars && halfStar) ? '#f5a623' : '#e0e0e0'}
                    strokeWidth={1.5}
                  />
                ))}
                <span className="pdp-rating-num">{SOCIAL_PROOF.rating}</span>
              </div>
              <span className="pdp-divider">·</span>
              <span className="pdp-sold">{SOCIAL_PROOF.sold} Sold</span>
            </div>
          </motion.div>

          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* Price section with psychological pricing */}
            <div className="pdp-pricing">
              <div className="pdp-price-current">GH₵ {product.price.toFixed(2)}</div>
              <div className="pdp-price-original">GH₵ {originalPrice.toFixed(2)}</div>
              <div className="pdp-price-badge">-{(discountRate * 100).toFixed(0)}%</div>
            </div>
          </motion.div>

          {/* Description Accordion */}
          <motion.div className="pdp-description-section" variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="product-detail-description">
              {descText}
            </p>
            {descTruncated && (
              <button
                className="pdp-read-more"
                onClick={() => setDescExpanded(e => !e)}
              >
                {descExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </motion.div>
          
          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <hr className="pdp-separator" />
          </motion.div>

          {/* Color Selector */}
          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="pdp-color-selector">
              <div className="pdp-selector-header">
                <h4>Color:</h4> <span>{selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</span>
              </div>
              <div className="color-swatches">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    className={`color-swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={`Select color ${c.name}`}
                  >
                    <span className="color-swatch-circle" style={{ backgroundColor: c.hex }}></span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="product-detail-sizes pdp-size-selector">
                <div className="pdp-selector-header">
                  <h4>Size</h4>
                  <button className="size-guide-link">Size Guide</button>
                </div>
                <div className="size-options pill-format">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn pill ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                      aria-label={`Select size ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="product-detail-qty">
              <h4>Quantity</h4>
              <div className="qty-picker">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={15} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desktop action buttons */}
          <div className="product-detail-actions product-detail-actions-desktop">
            <button
              className={`product-add-to-cart${addedCartStatus ? ' added' : ''}`}
              onClick={handleAdd}
            >
              {addedCartStatus ? '✓ Added' : 'Add to Cart'}
            </button>
            <button className="product-wishlist-btn" onClick={() => setWishlisted(w => !w)}>
              <Heart size={16} fill={wishlisted ? 'var(--primary)' : 'none'} />
              {wishlisted ? 'Saved' : 'Save to Wishlist'}
            </button>
          </div>

          <motion.div variants={scrollVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="trust-badges mobile-grid-badges">
              <div className="trust-badge">
                <Truck size={18} />
                <span>Fast Delivery</span>
              </div>
              <div className="trust-badge">
                <Shield size={18} />
                <span>Guaranteed</span>
              </div>
              <div className="trust-badge">
                <RotateCcw size={18} />
                <span>Free Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile sticky footer CTA bar ── */}
      <div className="pdp-sticky-footer dual-cta">
        <button
          className={`pdp-footer-add-cart ${addedCartStatus ? 'success-toast' : ''}`}
          onClick={handleAdd}
          aria-label="Add to cart"
        >
          {addedCartStatus ? '✓ Success' : 'Add Cart'}
        </button>
        <button
          className="pdp-footer-buy-now"
          onClick={handleBuyNow}
          aria-label="Buy now"
        >
          Buy Now
        </button>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="related-products">
          <div className="related-header">
            <h2>You May Also Like</h2>
            <Link to="/store">View All</Link>
          </div>
          <div className="related-grid scroll-effect">
            {related.map((rp, i) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link to={`/store/${rp.id}`} className="related-card">
                  <div className="related-card-image">
                    <img src={rp.image} alt={rp.name} loading="lazy" />
                  </div>
                  <div className="related-card-info">
                    <h4>{rp.name}</h4>
                    <span>GH₵ {rp.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
