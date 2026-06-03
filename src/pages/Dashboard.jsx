import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../ProductContext';
import { categories } from '../data'; // Using predefined categories
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  Search, Plus, Filter, MoreHorizontal, X, UploadCloud,
  CheckCircle, Shield, Image as ImageIcon
} from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  
  const [activeTab, setActiveTab] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOp, setIsToastOp] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0],
    description: '',
    sizes: 'S, M, L'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null);

  // Close modal with Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Hard architectural limit: Up to 7 images
    const currentCount = imageFiles.length;
    const remainingSlots = 7 - currentCount;
    
    if (files.length > remainingSlots) {
      alert(`You can only upload a maximum of 7 images per product. You've selected too many. We'll add the first ${remainingSlots} instead.`);
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    
    setImageFiles(prev => [...prev, ...acceptedFiles]);
    
    // Generate previews
    const previews = acceptedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    
    // Clear input so we can select same files again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const parsedSizes = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    
    await addProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      sizes: parsedSizes.length > 0 ? parsedSizes : null,
    }, imageFiles);

    // Reset Form
    setFormData({ name: '', price: '', category: categories[0], description: '', sizes: 'S, M, L' });
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(false);
    
    // Show toast
    setIsToastOp(true);
    setTimeout(() => setIsToastOp(false), 3000);
  };

  return (
    <div className="dashboard-layout">
      
      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <Shield size={24} className="accent" />
          <span>Lemaire Admin</span>
        </div>
        
        <nav className="dash-nav">
          <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`dash-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={18} /> Products
          </button>
          <button className={`dash-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={18} /> Orders
          </button>
          <button className={`dash-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <Users size={18} /> Customers
          </button>
          <div className="dash-nav-spacer" />
          <button className="dash-nav-item">
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="dash-main">
        <header className="dash-header">
          <h2>Product Inventory</h2>
          
          <div className="dash-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="btn primary icon-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </header>

        <section className="dash-content-area">
          <div className="dash-table-container">
            <div className="table-toolbar">
              <button className="btn ghost"><Filter size={14} /> Filter</button>
              <div className="table-stats">Total: <strong>{products.length}</strong> items</div>
            </div>
            
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Inventory</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state-td">No products found.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="td-product-info">
                          <img src={p.image} alt={p.name} className="td-product-img" />
                          <div className="td-product-details">
                            <strong>{p.name}</strong>
                            <span>{p.images?.length > 1 ? `${p.images.length} images` : '1 image'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="td-badge category">{p.category}</span>
                      </td>
                      <td>
                        {p.inStock ? 
                          <span className="td-badge success">In Stock</span> : 
                          <span className="td-badge danger">Out of Stock</span>
                        }
                      </td>
                      <td className="td-price">GH₵ {p.price.toFixed(2)}</td>
                      <td className="td-actions">
                        <button className="icon-only" aria-label="More actions"><MoreHorizontal size={18}/></button>
                        <button className="icon-only text-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── Add Product Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              className="modal-backdrop" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              className="dash-modal"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
            >
              <div className="modal-header">
                <h3>Add New Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={20}/></button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Midnight Duchess" />
                  </div>
                  <div className="form-group">
                    <label>Price (GH₵)</label>
                    <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sizes (comma separated)</label>
                    <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} placeholder="S, M, L, XL" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea required rows="4" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed product description..."></textarea>
                </div>

                {/* Image Uploader area (up to 7 images) */}
                <div className="form-group uploader-group">
                  <label>Media Gallery <span className="uploader-hint">({imageFiles.length}/7 images)</span></label>
                  
                  <div className="image-previews-grid">
                    {imagePreviews.map((src, index) => (
                      <div className="preview-tile" key={index}>
                        <img src={src} alt="Preview" />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(index)} aria-label="Remove image"><X size={14} /></button>
                      </div>
                    ))}
                    
                    {imageFiles.length < 7 && (
                      <div className="upload-btn-tile" onClick={() => fileInputRef.current?.click()}>
                        <Plus size={24} color="#888" />
                        <span>Add</span>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="drag-drop-zone" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ display: imageFiles.length === 0 ? 'flex' : 'none' }}
                  >
                    <UploadCloud size={40} className="accent" />
                    <p>Click to browse or drag local files here</p>
                    <span>Supports JPG, PNG up to 7 files</span>
                  </div>
                  
                  <input 
                    type="file" 
                    multiple 
                    max="7"
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    onChange={handleFileChange}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn primary">Save Product</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {isToastOp && (
          <motion.div 
            className="dash-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <CheckCircle size={20} color="#25D366" /> 
            Product added successfully!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
