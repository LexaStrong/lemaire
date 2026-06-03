import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Lock, Tag } from 'lucide-react';
import { useCart } from '../CartContext';
import '../styles/store.css';

// Free delivery threshold
const FREE_DELIVERY_THRESHOLD = 500;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, handleCheckout } = useCart();
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Progress toward free delivery
  const deliveryProgress = Math.min((cartTotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - cartTotal, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-inner">
          <div className="cart-empty-state">
            <ShoppingBag size={72} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any designs to your cart yet.</p>
            <Link to="/store" className="btn primary">Browse Store</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-inner">

        {/* ── Header ── */}
        <div className="cart-page-header">
          <Link to="/store" className="back-link">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
          <div className="cart-header-row">
            <h1>
              Shopping Cart <span className="cart-page-count">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="cart-page-layout">

          {/* ── Cart Items ── */}
          <div className="cart-page-items">
            <AnimatePresence initial={false}>
              {cart.map((item, i) => (
                <motion.div
                  key={item.cartKey}
                  layout
                  className="cart-page-item"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link to={`/store/${item.id}`} className="cart-page-item-image">
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-page-item-info">
                    <Link to={`/store/${item.id}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    {item.selectedSize && (
                      <span className="cart-page-item-size">Size: {item.selectedSize}</span>
                    )}
                    <span className="cart-page-item-price">GH₵ {item.price} each</span>
                  </div>

                  <div className="cart-page-item-actions">
                    <div className="cart-page-qty">
                      <button
                        onClick={() => updateQuantity(item.cartKey, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="cart-page-item-total">GH₵ {item.price * item.qty}</span>

                    <button
                      className="cart-page-remove"
                      onClick={() => removeFromCart(item.cartKey)}
                      title="Remove item"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="cart-page-summary">
            <div className="summary-card">

              <div className="summary-card-header">
                <h3>Order Summary</h3>
              </div>

              {/* Free delivery progress */}
              <div className="free-delivery-bar">
                <p className="free-delivery-label">
                  {remaining > 0 ? (
                    <>Add <strong>GH₵ {remaining}</strong> more for free delivery</>
                  ) : (
                    <><strong>🎉 You've unlocked free delivery!</strong></>
                  )}
                </p>
                <div className="free-delivery-track">
                  <div
                    className="free-delivery-fill"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>

              {/* Promo code */}
              <div className="summary-promo">
                <Tag size={14} style={{ color: '#444', flexShrink: 0, marginTop: '0.6rem' }} />
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  aria-label="Enter promo code"
                />
                <button aria-label="Apply promo code">Apply</button>
              </div>

              {/* Breakdown */}
              <div className="summary-row">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span>GH₵ {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="delivery-note">Via WhatsApp</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total</span>
                <span>GH₵ {cartTotal}</span>
              </div>

              {/* Checkout */}
              <button
                id="checkout-whatsapp-btn"
                className="checkout-btn-full"
                onClick={handleCheckout}
                aria-label="Checkout via WhatsApp"
              >
                <i className="fab fa-whatsapp" />
                Checkout via WhatsApp
              </button>

              <p className="checkout-note">
                You'll be redirected to WhatsApp to confirm your order and arrange payment &amp; delivery.
              </p>

              <div className="summary-secure">
                <Lock size={12} />
                Secure &amp; encrypted conversation
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
