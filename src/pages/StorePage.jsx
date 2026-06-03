import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { categories } from '../data';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';
import '../styles/store.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name', label: 'Name: A → Z' },
];

const StorePage = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  // Count products per category
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
    return acc;
  }, {});
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [addedId, setAddedId] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || null);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  let filtered = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort';

  return (
    <div className="store-page">
      {/* ── Store Hero ── */}
      <div className="store-hero">
        <div className="store-hero-content">
          <motion.span
            className="store-hero-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Lemaire Clothing
          </motion.span>
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Collection
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium African hand-sewn designs, shipped directly to you.
          </motion.p>
        </div>
      </div>

      {/* ── Store Body: Sidebar + Content ── */}
      <div className="store-body">

        {/* ── Desktop Sidebar ── */}
        <aside className="store-sidebar">
          {/* Categories */}
          <div className="sidebar-section">
            <p className="sidebar-section-title">Categories</p>
            <div className="sidebar-cats">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`sidebar-cat-btn${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  <span className="sidebar-cat-count">{categoryCounts[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-divider" />

          {/* Sort */}
          <div className="sidebar-section">
            <p className="sidebar-section-title">Sort By</p>
            <div className="sidebar-sort">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`sidebar-sort-btn${sortBy === opt.value ? ' active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  <span className="sidebar-sort-dot" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right Content ── */}
        <div className="store-content">

          {/* Toolbar */}
          <div className="store-toolbar">
            <div className="store-toolbar-left">
              {/* Search */}
              <div className="store-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#555' }}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <button
                className="store-mobile-filter-btn"
                onClick={() => setMobileFilterOpen(true)}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={15} />
                Filter &amp; Sort
                {(activeCategory !== 'All' || sortBy !== 'default') && (
                  <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '100px', fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginLeft: '0.25rem' }}>
                    {(activeCategory !== 'All' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            <p className="store-result-count">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'design' : 'designs'}
            </p>
          </div>

          {/* Grid */}
          <div className="store-grid-container">
            {filtered.length === 0 ? (
              <div className="no-results">
                <ShoppingBag size={48} strokeWidth={1} />
                <p>No designs match your search.</p>
                <span>Try a different keyword or category.</span>
              </div>
            ) : (
              <div className="store-grid">
                <AnimatePresence>
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      className="store-product-card"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <Link to={`/store/${product.id}`} className="store-product-image-link">
                        <div className="store-product-image">
                          <img src={product.image} alt={product.name} loading="lazy" />
                          {/* Badge for first few products */}
                          {product.id <= 3 && (
                            <span className="store-product-badge">New</span>
                          )}
                          <div className="store-product-overlay">
                            <span>View Details</span>
                          </div>
                        </div>
                      </Link>

                      <div className="store-product-details">
                        <div className="store-product-meta">
                          <span className="store-product-category">{product.category}</span>
                          {product.inStock && <span className="store-in-stock">In Stock</span>}
                        </div>
                        <Link to={`/store/${product.id}`}>
                          <h3>{product.name}</h3>
                        </Link>
                        <div className="store-product-bottom">
                          <span className="store-product-price">GH₵ {product.price}</span>
                          <button
                            id={`add-to-cart-${product.id}`}
                            className={`store-add-btn${addedId === product.id ? ' added' : ''}`}
                            onClick={(e) => handleAddToCart(product, e)}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {addedId === product.id ? (
                              <span>✓ Added</span>
                            ) : (
                              <>
                                <ShoppingBag size={14} />
                                <span>Add to cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <div
        className={`store-mobile-filter-overlay${mobileFilterOpen ? ' open' : ''}`}
        onClick={() => setMobileFilterOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`store-mobile-filter-drawer${mobileFilterOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Filter and sort options"
      >
        <div className="store-mobile-filter-drawer-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <p className="store-mobile-drawer-title">Filter &amp; Sort</p>
          <button
            onClick={() => setMobileFilterOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <p className="store-mobile-section-title">Categories</p>
        <div className="store-mobile-cats">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`store-mobile-cat-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} ({categoryCounts[cat]})
            </button>
          ))}
        </div>

        <p className="store-mobile-section-title">Sort By</p>
        <div className="store-mobile-sort">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`store-mobile-sort-btn${sortBy === opt.value ? ' active' : ''}`}
              onClick={() => setSortBy(opt.value)}
            >
              <span className="store-mobile-sort-dot" />
              {opt.label}
            </button>
          ))}
        </div>

        <button
          className="store-mobile-apply-btn"
          onClick={() => setMobileFilterOpen(false)}
        >
          View {filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}
        </button>
      </div>
    </div>
  );
};

export default StorePage;
