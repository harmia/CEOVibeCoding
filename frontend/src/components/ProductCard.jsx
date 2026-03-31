import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

export default function ProductCard({ product, onQuantityChange, onDelete, onAddToHome, homeCount }) {
  const icon = CATEGORY_ICONS[product.category] || '📦';
  const badge = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-800';
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOutOfStock = product.quantity === 0;

  function handleQtyInput(e) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) onQuantityChange(product.id, val);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-5 pt-5 pb-4 flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-sm">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{product.sku}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badge}`}>
            {product.category}
          </span>
          {product.ha_supported ? (
            <a
              href="https://www.home-assistant.io/"
              target="_blank"
              rel="noopener noreferrer"
              title="This product supports Home Assistant integration — click to learn more"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#18BCF2]/10 text-[#0A7EAD] hover:bg-[#18BCF2]/25 transition-colors border border-[#18BCF2]/30"
            >
              {/* Official Home Assistant logo icon */}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#18BCF2] flex-shrink-0">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M21.803 10.822 12.896 2.01A1.263 1.263 0 0 0 12 1.61c-.336 0-.66.13-.896.4L2.196 10.822a.752.752 0 0 0 .527 1.283H4.27v9.188c0 .415.335.75.75.75H9.67a.75.75 0 0 0 .75-.75v-5.9h3.16v5.9c0 .415.336.75.75.75h4.65a.75.75 0 0 0 .75-.75v-9.188h1.547a.752.752 0 0 0 .527-1.283z"/>
                </svg>
              </span>
              Home Assistant
            </a>
          ) : null}
        </div>

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-slate-800">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex flex-col items-end gap-0.5">
            {isOutOfStock && (
              <span className="text-xs font-semibold text-red-500">Out of Stock</span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="text-xs font-semibold text-amber-500">Low Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-3">
        {/* Add to Home button */}
        {onAddToHome && (
          <button
            onClick={() => onAddToHome(product)}
            disabled={product.quantity === 0}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {homeCount > 0 ? `Add again to My Home (${homeCount} installed)` : 'Add to My Home'}
          </button>
        )}

        <div className="flex items-center justify-between gap-3">
          {/* Quantity control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onQuantityChange(product.id, Math.max(0, product.quantity - 1))}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min="0"
              value={product.quantity}
              onChange={handleQtyInput}
              className="w-14 text-center text-sm font-semibold border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Quantity"
            />
            <button
              onClick={() => onQuantityChange(product.id, product.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(product.id, product.name)}
            className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            aria-label="Delete product"
            title="Delete product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
