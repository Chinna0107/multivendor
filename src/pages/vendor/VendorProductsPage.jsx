import React, { useState, useEffect } from 'react';
import { Search, Plus, PackageSearch, Edit2, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([]);
  const [customAttributes, setCustomAttributes] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    category: '',
    images: [],
    variants: []
  });
  
  const [newColorVariant, setNewColorVariant] = useState({ color: '' });
  const [newSizeVariant, setNewSizeVariant] = useState({ size: '', price: '', stock: '' });

  const [isNew, setIsNew] = useState(true);
  const [editProduct, setEditProduct] = useState({});

  const handleAdd = () => {
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      category: '',
      images: [],
      variants: []
    });
    setNewColorVariant({ color: "" });
    setNewSizeVariant({ size: "", price: "", stock: "" });
    setEditProduct({});
    setCustomAttributes({});
    setSelectedCategoryFields([]);
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    const images = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image_url ? [product.image_url] : []);
      
    let parsedVariants = [];
    try {
      if (typeof product.sizes === 'string') {
        parsedVariants = JSON.parse(product.sizes);
      } else if (Array.isArray(product.sizes)) {
        parsedVariants = product.sizes;
      }
    } catch (e) {}

    setFormData({ ...product, variants: parsedVariants, images });
    setNewColorVariant({ color: "" });
    setNewSizeVariant({ size: "", price: "", stock: "" });
    setEditProduct(product);
    
    const cat = categories.find(c => c.name === product.category);
    if (cat && cat.custom_fields) {
      setSelectedCategoryFields(cat.custom_fields);
    } else {
      setSelectedCategoryFields([]);
    }
    
    const attrs = typeof product.custom_attributes === 'string' ? JSON.parse(product.custom_attributes) : (product.custom_attributes || {});
    setCustomAttributes(attrs);
    
    setIsNew(false);
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('vendor_token');
      const res = await fetch(`${BACKEND_URL}/vendor/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/vendor/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('vendor_token')}` }
      });
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    setFormData({ ...formData, category: catName });
    
    const cat = categories.find(c => c.name === catName);
    if (cat && cat.custom_fields) {
      setSelectedCategoryFields(cat.custom_fields);
    } else {
      setSelectedCategoryFields([]);
    }
    setCustomAttributes({}); 
  };

  const [uploadingField, setUploadingField] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(fieldName);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/upload`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        setCustomAttributes(prev => ({...prev, [fieldName]: data.url}));
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  const addColorVariant = () => {
    if (newColorVariant.color.trim()) {
      setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), { color: newColorVariant.color.trim(), images: [], sizes: [] }]
      }));
      setNewColorVariant({ color: '' });
    }
  };

  const removeColorVariant = (idx) => {
    const updated = [...(formData.variants || [])];
    updated.splice(idx, 1);
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  const handleVariantImageUpload = async (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`${BACKEND_URL}/admin/upload`, {
          method: 'POST',
          body: fd
        });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      
      const updatedVariants = [...(formData.variants || [])];
      updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), ...urls];
      setFormData(prev => ({ ...prev, variants: updatedVariants }));
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingImages(false);
    }
  };
  
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...(formData.variants || [])];
    updatedVariants[variantIndex].images.splice(imageIndex, 1);
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addSizeToVariant = (variantIndex) => {
    if (newSizeVariant.size.trim() && newSizeVariant.price !== '') {
      const updatedVariants = [...(formData.variants || [])];
      updatedVariants[variantIndex].sizes.push({
        size: newSizeVariant.size.trim(),
        price: Number(newSizeVariant.price),
        stock: Number(newSizeVariant.stock) || 0
      });
      setFormData(prev => ({ ...prev, variants: updatedVariants }));
      setNewSizeVariant({ size: '', price: '', stock: '' });
    }
  };

  const removeSizeFromVariant = (variantIndex, sizeIndex) => {
    const updatedVariants = [...(formData.variants || [])];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('vendor_token');
      
      const reqBody = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        short_description: formData.short_description,
        description: formData.description,
        category: formData.category,
        custom_attributes: JSON.stringify(customAttributes),
        image_url: formData.images && formData.images.length > 0 ? formData.images[0] : (formData.variants && formData.variants.length > 0 && formData.variants[0].images && formData.variants[0].images.length > 0 ? formData.variants[0].images[0] : ''),
        images: formData.images || [],
        variants: formData.variants || []
      };

      const url = isNew ? `${BACKEND_URL}/vendor/products` : `${BACKEND_URL}/vendor/products/${editProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      });
      if (res.ok) {
        toast.success(isNew ? 'Product added successfully!' : 'Product updated successfully!');
        setIsModalOpen(false);
        setFormData({
          name: '',
          slug: '',
          short_description: '',
          description: '',
          category: '',
          images: [],
          variants: []
        });    
        setCustomAttributes({});
        setSelectedCategoryFields([]);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add product');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('vendor_token');
      const res = await fetch(`${BACKEND_URL}/vendor/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory and pricing</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange w-full sm:w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          let parsedSizes = [];
          try {
            if (typeof product.sizes === 'string') {
              parsedSizes = JSON.parse(product.sizes);
            } else if (Array.isArray(product.sizes)) {
              parsedSizes = product.sizes;
            }
          } catch (e) {}

          let displayPrice = product.price || 0;
          let displayStock = product.stock || 0;

          if (parsedSizes && parsedSizes.length > 0) {
            if (parsedSizes[0].sizes && Array.isArray(parsedSizes[0].sizes) && parsedSizes[0].sizes.length > 0) {
              displayPrice = parsedSizes[0].sizes[0].price;
              displayStock = parsedSizes.reduce((acc, color) => acc + (color.sizes?.reduce((sum, s) => sum + (Number(s.stock)||0), 0)||0), 0);
            } else if (parsedSizes[0].price !== undefined) {
              displayPrice = parsedSizes[0].price;
              displayStock = parsedSizes.reduce((acc, s) => acc + (Number(s.stock)||0), 0);
            }
          }

          return (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt="" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <PackageSearch className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm border border-gray-100">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
              <p className="text-sm font-semibold text-brand-orange mt-auto">₹{displayPrice}</p>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
              <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )})}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <PackageSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-500">Start selling by adding your first product!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1 bg-gray-50/50">
              <form onSubmit={handleSubmit} id="productForm">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Slug (URL snippet)</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="Leave blank to auto-generate from name" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Short Description</label>
                  <input type="text" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Detailed Description</label>
                  <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={handleCategoryChange} 
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="mb-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Hierarchical Variants (Color → Images → Sizes)</label>
                  <p className="text-xs text-gray-500 mb-4">Add colors, upload specific images for each color, and then define sizes/pricing for that color.</p>
                  
                  {formData.variants && formData.variants.map((variant, vIdx) => (
                    <div key={vIdx} className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                        <h4 className="font-bold text-gray-900">Color: {variant.color}</h4>
                        <button type="button" onClick={() => removeColorVariant(vIdx)} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"><Trash2 className="w-3 h-3"/> Remove Color</button>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Images for {variant.color}</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {variant.images && variant.images.map((url, iIdx) => (
                            <div key={iIdx} className="relative group">
                              <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                              <button type="button" onClick={() => removeVariantImage(vIdx, iIdx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                        <div className="relative inline-block">
                          <input type="file" multiple accept="image/*" onChange={(e) => handleVariantImageUpload(e, vIdx)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <button type="button" className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                            <Upload className="w-3 h-3" /> Add Images
                          </button>
                        </div>
                        {uploadingImages && <span className="text-xs text-brand-orange ml-2">Uploading...</span>}
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Sizes/Models for {variant.color}</label>
                        
                        <div className="space-y-2 mb-3">
                          {variant.sizes && variant.sizes.map((s, sIdx) => (
                            <div key={sIdx} className="flex justify-between items-center bg-white px-3 py-2 border border-gray-200 rounded-lg text-sm shadow-sm">
                              <span className="font-medium text-gray-900">{s.size}</span>
                              <div className="flex items-center gap-3 text-gray-600 text-xs">
                                <span>₹{s.price}</span>
                                <span>Stock: {s.stock}</span>
                                <button type="button" onClick={() => removeSizeFromVariant(vIdx, sIdx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <input type="text" placeholder="Size (e.g. 128GB)" value={newSizeVariant.size} onChange={e => setNewSizeVariant({...newSizeVariant, size: e.target.value})} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none" />
                          <input type="number" placeholder="Price" value={newSizeVariant.price} onChange={e => setNewSizeVariant({...newSizeVariant, price: e.target.value})} className="w-20 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none" />
                          <input type="number" placeholder="Stock" value={newSizeVariant.stock} onChange={e => setNewSizeVariant({...newSizeVariant, stock: e.target.value})} className="w-20 px-3 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none" />
                          <button type="button" onClick={() => addSizeToVariant(vIdx)} className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-800">Add Size</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input type="text" placeholder="New Color Variant (e.g. Midnight Blue)" value={newColorVariant.color} onChange={e => setNewColorVariant({color: e.target.value})} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" />
                    <button type="button" onClick={addColorVariant} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 whitespace-nowrap">Add Color</button>
                  </div>
                </div>

                {selectedCategoryFields.length > 0 && (
                  <>
                    <h3 className="font-bold text-gray-900 pt-4 border-t border-gray-100">Dynamic Attributes</h3>
                    {selectedCategoryFields.map((field, idx) => {
                      // Filter out anything that's inherently static like name/price/stock
                      const lower = field.name.toLowerCase();
                      if (lower.includes('name') || lower.includes('title') || lower.includes('price') || lower.includes('stock') || lower.includes('quantity')) return null;
                      
                      return (
                        <div key={idx} className="mb-4">
                          <label className="block text-sm font-bold text-gray-900 mb-1">{field.name} {field.required && '*'}</label>
                          
                          {field.type === 'text' && (
                            <input 
                              type="text" 
                              required={field.required}
                              value={customAttributes[field.name] || ''}
                              onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" 
                            />
                          )}

                          {field.type === 'number' && (
                            <input 
                              type="number" 
                              required={field.required}
                              value={customAttributes[field.name] || ''}
                              onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" 
                            />
                          )}

                          {field.type === 'select' && (
                            <select 
                              required={field.required}
                              value={customAttributes[field.name] || ''}
                              onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                            >
                              <option value="">Select...</option>
                              {field.options && field.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                            </select>
                          )}

                          {field.type === 'boolean' && (
                            <select 
                              required={field.required}
                              value={customAttributes[field.name] || ''}
                              onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                            >
                              <option value="">Select...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          )}

                          {field.type === 'image' && (
                            <div className="flex flex-col gap-2">
                              {customAttributes[field.name] && (
                                <img src={customAttributes[field.name]} alt="preview" className="h-20 object-contain rounded border border-gray-200" />
                              )}
                              <div className="relative inline-block w-fit">
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, field.name)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <button type="button" className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-200 border border-gray-300">
                                  {uploadingField === field.name ? 'Uploading...' : 'Choose Image'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-white">
              <button 
                type="submit" 
                form="productForm"
                disabled={saving}
                className="w-full bg-[#036e26] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#02561d] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : (isNew ? 'Add Product' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
