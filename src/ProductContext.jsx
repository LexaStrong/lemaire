import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from './data';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Load products from LocalStorage or fallback to default
  useEffect(() => {
    const saved = localStorage.getItem('lemaire_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(defaultProducts);
      }
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('lemaire_products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Save whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('lemaire_products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = async (productData, imageFiles) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    let base64Images = [];

    if (imageFiles && imageFiles.length > 0) {
      // Limit to 7 images max
      const filesToProcess = Array.from(imageFiles).slice(0, 7);
      base64Images = await Promise.all(filesToProcess.map(file => compressAndEncode(file)));
    }

    const newProduct = {
      ...productData,
      id: newId,
      image: base64Images.length > 0 ? base64Images[0] : '/assets/placeholder-store.jpg', // Fallback or primary
      images: base64Images,
      inStock: true
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Helper to reliably resize image to prevent localStorage cap
const compressAndEncode = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.floor(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use high-compression JPEG 0.65
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};
