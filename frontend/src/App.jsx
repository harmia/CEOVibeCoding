import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories, createProduct, updateProductQuantity, deleteProduct, fetchHomeDevices, addHomeDevice, removeHomeDevice } from './api';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import AddToHomeModal from './components/AddToHomeModal';
import StatsBar from './components/StatsBar';
import ConfirmDialog from './components/ConfirmDialog';
import MyHome from './components/MyHome';
import { CATEGORY_ICONS } from './constants';

export default function App() {
  const [activeView, setActiveView] = useState('store'); // 'store' | 'home'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirm, setConfirm] = useState(null); // { id, name }
  const [toast, setToast] = useState('');

  // My Home state
  const [homeDevices, setHomeDevices] = useState([]);
  const [addToHomeProduct, setAddToHomeProduct] = useState(null); // product to add
  const [homeConfirm, setHomeConfirm] = useState(null); // { id, name } for removal

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // All products (unfiltered) for the My Home suggestions panel
  const [allProducts, setAllProducts] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts({ search, category: activeCategory });
      setProducts(data);
      // When no filter is active, keep allProducts in sync (avoids a separate API call)
      if (!search && (activeCategory === 'All' || !activeCategory)) {
        setAllProducts(data);
      }
    } catch (e) {
      setError(e.message);
    }
  }, [search, activeCategory]);

  useEffect(() => {
    setLoading(true);
    loadProducts().finally(() => setLoading(false));
  }, [loadProducts]);

  useEffect(() => {
    fetchCategories().then(cats => setCategories(['All', ...cats])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchHomeDevices().then(setHomeDevices).catch(() => {});
  }, []);

  async function handleQuantityChange(id, quantity) {
    try {
      const updated = await updateProductQuantity(id, quantity);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (e) {
      showToast('⚠️ ' + e.message);
    }
  }

  function handleDeleteClick(id, name) {
    setConfirm({ id, name });
  }

  async function handleDeleteConfirm() {
    try {
      await deleteProduct(confirm.id);
      setProducts(prev => prev.filter(p => p.id !== confirm.id));
      setAllProducts(prev => prev.filter(p => p.id !== confirm.id));
      showToast(`🗑️ "${confirm.name}" deleted.`);
    } catch (e) {
      showToast('⚠️ ' + e.message);
    } finally {
      setConfirm(null);
    }
  }

  async function handleAdd(data) {
    const product = await createProduct(data);
    setProducts(prev => [...prev, product].sort((a, b) => a.name.localeCompare(b.name)));
    setAllProducts(prev => [...prev, product].sort((a, b) => a.name.localeCompare(b.name)));
    showToast(`✅ "${product.name}" added.`);
    if (!categories.includes(product.category)) {
      setCategories(prev => ['All', ...[...prev.filter(c => c !== 'All'), product.category].sort()]);
    }
  }

  // My Home handlers
  function handleOpenAddToHome(product) {
    setAddToHomeProduct(product);
  }

  async function handleConfirmAddToHome(productId, room) {
    try {
      const device = await addHomeDevice(productId, room);
      setHomeDevices(prev => [...prev, device]);
      setAddToHomeProduct(null);
      showToast(`🏠 "${device.name}" added to ${device.room}.`);
    } catch (e) {
      showToast('⚠️ ' + e.message);
    }
  }

  function handleRemoveHomeDevice(id, name) {
    setHomeConfirm({ id, name });
  }

  async function handleConfirmRemoveHome() {
    try {
      await removeHomeDevice(homeConfirm.id);
      setHomeDevices(prev => prev.filter(d => d.id !== homeConfirm.id));
      showToast(`🗑️ "${homeConfirm.name}" removed from My Home.`);
    } catch (e) {
      showToast('⚠️ ' + e.message);
    } finally {
      setHomeConfirm(null);
    }
  }

  // Map product_id → count of home devices for that product
  const homeCountByProduct = homeDevices.reduce((acc, d) => {
    acc[d.product_id] = (acc[d.product_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-400 rounded-xl flex items-center justify-center text-slate-900 text-xl font-bold shadow">
              ⚡
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">SmartNest Pro</h1>
              <p className="text-slate-400 text-xs">Professional Home Automation · HA-Ready Products</p>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
            <button
              onClick={() => setActiveView('store')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'store'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏪 Store
            </button>
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'home'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏠 My Home
              {homeDevices.length > 0 && (
                <span className="bg-cyan-400 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {homeDevices.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── My Home View ── */}
        {activeView === 'home' && (
          <MyHome
            homeDevices={homeDevices}
            allProducts={allProducts}
            onRemoveDevice={handleRemoveHomeDevice}
            onAddToHome={handleOpenAddToHome}
          />
        )}

        {/* ── Store View ── */}
        {activeView === 'store' && (
          <>
            {/* Stats */}
            <StatsBar products={products} />

            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or SKU…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat] || '📦'}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {error && (
              <div className="text-center py-12 text-red-500">
                <p className="text-lg font-medium">Unable to connect to the server.</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {!error && loading && (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!error && !loading && products.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-medium text-gray-600">No products found.</p>
                <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
              </div>
            )}

            {!error && !loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuantityChange={handleQuantityChange}
                    onDelete={handleDeleteClick}
                    onAddToHome={handleOpenAddToHome}
                    homeCount={homeCountByProduct[product.id] || 0}
                  />
                ))}
              </div>
            )}

            {!loading && !error && (
              <p className="text-xs text-gray-400 text-center">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                {search ? ` matching "${search}"` : ''}
              </p>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {confirm && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${confirm.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {addToHomeProduct && (
        <AddToHomeModal
          product={addToHomeProduct}
          onClose={() => setAddToHomeProduct(null)}
          onConfirm={handleConfirmAddToHome}
        />
      )}
      {homeConfirm && (
        <ConfirmDialog
          message={`Remove "${homeConfirm.name}" from My Home? This won't affect your store inventory.`}
          onConfirm={handleConfirmRemoveHome}
          onCancel={() => setHomeConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
