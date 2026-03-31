import { useState } from 'react';
import { CATEGORIES } from '../constants';

const EMPTY = { name: '', category: CATEGORIES[0], price: '', quantity: '', sku: '', description: '' };

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const price = parseFloat(form.price);
    const quantity = parseInt(form.quantity, 10);
    if (!form.name.trim() || !form.sku.trim()) {
      setError('Name and SKU are required.');
      return;
    }
    if (isNaN(price) || price < 0) { setError('Enter a valid price.'); return; }
    if (isNaN(quantity) || quantity < 0) { setError('Enter a valid quantity.'); return; }

    setSaving(true);
    try {
      await onAdd({ ...form, price, quantity });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. Philips Hue Starter Kit" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
              <input name="sku" value={form.sku} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. SN-021" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price ($) *</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="0.00" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} type="number" min="0" required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="0" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                placeholder="Brief product description..." />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              {saving ? 'Adding…' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
