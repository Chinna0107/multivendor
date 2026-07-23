import React, { useEffect, useState } from "react";
import { Package, Plus, Trash2, Edit2, X, Save, Upload, Search } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    category: '',
    images: [],
    variants: [],
    is_active: true,
    is_bestseller: false,
    is_trending: false,
    is_offer: false
  });
  
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([]);
  const [customAttributes, setCustomAttributes] = useState({});
  
  const [newColorVariant, setNewColorVariant] = useState({ color: '' });
  const [newSizeVariant, setNewSizeVariant] = useState({ size: '', price: '', stock: '' });

  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/admin/categories`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      
      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) setCategories(catData.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(fieldName);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        setCustomAttributes(prev => ({...prev, [fieldName]: data.url}));
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      category: '',
      images: [],
      variants: [],
      is_active: true,
      is_bestseller: false,
      is_trending: false,
      is_offer: false
    });
    setNewColorVariant({ color: "" });
    setNewSizeVariant({ size: "", price: "", stock: "" });
    setEditProduct({});
    setCustomAttributes({});
    setSelectedCategoryFields([]);
    setIsNew(true);
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
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
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
      const token = localStorage.getItem("token");
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`${BACKEND_URL}/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      
      const updatedVariants = [...(formData.variants || [])];
      updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), ...urls];
      setFormData(prev => ({ ...prev, variants: updatedVariants }));
    } catch (err) {
      console.error('Upload failed');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = isNew ? `${BACKEND_URL}/admin/products` : `${BACKEND_URL}/admin/products/${editProduct.id}`;
      
      const reqBody = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        short_description: formData.short_description,
        description: formData.description,
        category: formData.category,
        custom_attributes: JSON.stringify(customAttributes),
        image_url: formData.images && formData.images.length > 0 ? formData.images[0] : (formData.variants && formData.variants.length > 0 && formData.variants[0].images && formData.variants[0].images.length > 0 ? formData.variants[0].images[0] : ''),
        images: formData.images || [],
        variants: formData.variants || [],
        is_active: formData.is_active,
        is_bestseller: formData.is_bestseller,
        is_trending: formData.is_trending,
        is_offer: formData.is_offer
      };

      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(reqBody),
      });
      setEditProduct(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#036e26] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage inventory, sizes, and pricing</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none w-full sm:w-64"
            />
          </div>
          <button onClick={handleAdd} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Vendor</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => {
                let parsedSizes = [];
                try {
                  if (typeof p.sizes === 'string') {
                    parsedSizes = JSON.parse(p.sizes);
                  } else if (Array.isArray(p.sizes)) {
                    parsedSizes = p.sizes;
                  }
                } catch (e) {}

                let price = p.price || 0;
                let stock = p.stock || 0;

                if (parsedSizes && parsedSizes.length > 0) {
                  if (parsedSizes[0].sizes && Array.isArray(parsedSizes[0].sizes) && parsedSizes[0].sizes.length > 0) {
                    price = parsedSizes[0].sizes[0].price;
                    stock = parsedSizes.reduce((acc, color) => acc + (color.sizes?.reduce((sum, s) => sum + (Number(s.stock)||0), 0)||0), 0);
                  } else if (parsedSizes[0].price !== undefined) {
                    price = parsedSizes[0].price;
                    stock = parsedSizes.reduce((acc, s) => acc + (Number(s.stock)||0), 0);
                  }
                }
                
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center p-1 overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="font-semibold text-gray-900 line-clamp-1">{p.name || 'Unnamed Product'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{p.category}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{p.vendor_id ? `Vendor #${p.vendor_id}` : 'Admin'}</td>
                    <td className="px-5 py-3 font-medium text-brand-orange">₹{price}</td>
                    <td className="px-5 py-3 text-gray-600">{stock}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded shadow-sm transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded shadow-sm transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{isNew ? 'New Product' : 'Edit Product'}</h2>
              <button onClick={() => setEditProduct(null)} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-1">Product Name *</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-1">Slug (URL snippet)</label>
                <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="Leave blank to auto-generate from name" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-1">Short Description</label>
                <input type="text" value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-1">Detailed Description</label>
                <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Category *</label>
                <select 
                  value={formData.category || ''} 
                  onChange={handleCategoryChange} 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white"
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
                  <h3 className="font-bold text-gray-900 pt-2 border-t border-gray-100">Dynamic Attributes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategoryFields.map((field, idx) => {
                      const lower = field.name.toLowerCase();
                      if (lower.includes('name') || lower.includes('title') || lower.includes('price') || lower.includes('stock') || lower.includes('quantity')) return null;

                      return (
                      <div key={idx} className={field.type === 'long_text' ? 'col-span-full' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.name} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'long_text' ? (
                          <textarea
                            required={field.required}
                            value={customAttributes[field.name] || ''}
                            onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                            rows={3}
                          />
                        ) : field.type === 'number' ? (
                          <input
                            type="number"
                            required={field.required}
                            value={customAttributes[field.name] || ''}
                            onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                          />
                        ) : field.type === 'upload' || field.type === 'image' ? (
                          <div>
                            {customAttributes[field.name] ? (
                              <div className="flex items-center gap-2 mb-2">
                                <img src={customAttributes[field.name]} alt="preview" className="h-12 w-12 object-cover rounded" />
                                <button type="button" onClick={() => setCustomAttributes({...customAttributes, [field.name]: ''})} className="text-red-500 text-xs hover:underline">Remove</button>
                              </div>
                            ) : null}
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              required={field.required && !customAttributes[field.name]}
                              onChange={(e) => handleFileUpload(e, field.name)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                              disabled={uploadingField === field.name}
                            />
                            {uploadingField === field.name && <span className="text-xs text-brand-orange mt-1">Uploading...</span>}
                          </div>
                        ) : (
                          <input
                            type="text"
                            required={field.required}
                            value={customAttributes[field.name] || ''}
                            onChange={(e) => setCustomAttributes({...customAttributes, [field.name]: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                          />
                        )}
                      </div>
                    )})}
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded text-[#036e26] focus:ring-[#036e26]" />
                  <span className="text-sm font-medium text-gray-700">Active Status</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_bestseller} onChange={e => setFormData({...formData, is_bestseller: e.target.checked})} className="rounded text-brand-orange focus:ring-brand-orange" />
                  <span className="text-sm font-medium text-gray-700">Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_trending} onChange={e => setFormData({...formData, is_trending: e.target.checked})} className="rounded text-[#036e26] focus:ring-[#036e26]" />
                  <span className="text-sm font-medium text-gray-700">Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_offer} onChange={e => setFormData({...formData, is_offer: e.target.checked})} className="rounded text-[#036e26] focus:ring-[#036e26]" />
                  <span className="text-sm font-medium text-gray-700">Special Offer</span>
                </label>
              </div>

            </div>
            
            <div className="p-5 border-t border-gray-100 bg-white">
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : (isNew ? 'Create Product' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
