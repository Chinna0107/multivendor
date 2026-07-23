import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function VendorCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('vendor_token');
        const res = await fetch(`${BACKEND_URL}/vendor/categories`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setCategories(data.categories || []);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Categories</h1>
        <p className="text-gray-500 mt-1">Reference the available categories when listing your products.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            No categories available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <div key={category.id} className="p-4 border border-gray-100 rounded-xl hover:border-[#fe6603]/30 transition-colors">
                <img src={category.image_url || '/placeholder.png'} alt={category.name} className="w-full h-32 object-cover rounded-lg bg-gray-50 mb-3" />
                <h3 className="font-medium text-gray-900 text-center">{category.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
