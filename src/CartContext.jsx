import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lemaire_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lemaire_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = null) => {
    setCart((prev) => {
      const key = size ? `${product.id}-${size}` : `${product.id}`;
      const existing = prev.find(item => item.cartKey === key);
      if (existing) {
        return prev.map(item =>
          item.cartKey === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, cartKey: key, selectedSize: size, qty: 1 }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartKey === cartKey) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const message =
      `Hello Lemaire Clothing! I would like to place an order:%0A%0A` +
      cart
        .map(
          (item) =>
            `• ${item.qty}x ${item.name}${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''} — GH₵${item.price * item.qty}`
        )
        .join('%0A') +
      `%0A%0ATotal: GH₵${cartTotal}%0A%0APlease let me know the payment and delivery details.`;
    window.open(`https://wa.me/233248293815?text=${message}`, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
