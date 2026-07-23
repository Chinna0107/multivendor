import React, { useEffect, useState } from "react";
import { Ticket, Plus, Trash2, Edit2, X, Save, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({ code: "", type: "percentage", value: 0, min_purchase: 0, max_discount: 0, expires_at: "", is_active: true });
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ code: "", type: "percentage", value: 0, min_purchase: 0, max_discount: 0, expires_at: "", is_active: true });
    setEditCoupon({});
    setIsNew(true);
  };

  const handleEdit = (coupon) => {
    setFormData({ ...coupon, expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : "" });
    setEditCoupon(coupon);
    setIsNew(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete coupon?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/admin/coupons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = isNew ? `${BACKEND_URL}/admin/coupons` : `${BACKEND_URL}/admin/coupons/${editCoupon.id}`;
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      setEditCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#036e26] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage discount codes</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-white hover:bg-[#004012] text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon, i) => (
          <motion.div key={coupon.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden">
            {!coupon.is_active && (
              <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">INACTIVE</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                <Ticket className="w-4 h-4" />
                <span className="font-bold tracking-wider">{coupon.code}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(coupon)} className="text-gray-900 hover:bg-gray-50 p-1.5 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">
                {coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
              </p>
              <div className="text-xs text-gray-900/60 space-y-1">
                <p>Min Purchase: ₹{coupon.min_purchase}</p>
                {coupon.type === "percentage" && <p>Max Discount: ₹{coupon.max_discount}</p>}
                {coupon.expires_at && (
                  <p className="flex items-center gap-1 text-gray-900">
                    <Calendar className="w-3.5 h-3.5" /> Expires: {new Date(coupon.expires_at).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {editCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{isNew ? "Add" : "Edit"} Coupon</h2>
              <button onClick={() => setEditCoupon(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Coupon Code</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none uppercase" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Discount Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Discount Value</label>
                  <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Min Purchase (₹)</label>
                  <input type="number" value={formData.min_purchase} onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.type === "percentage" && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Max Discount (₹)</label>
                    <input type="number" value={formData.max_discount} onChange={(e) => setFormData({ ...formData, max_discount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Expires At (Optional)</label>
                  <input type="date" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-900 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="coupon_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-gray-900" />
                <label htmlFor="coupon_active" className="text-sm font-semibold text-gray-900 cursor-pointer">Active</label>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setEditCoupon(null)} className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-[#fe6603] text-white hover:bg-[#e55c02] rounded-xl font-semibold flex justify-center items-center gap-2">
                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
