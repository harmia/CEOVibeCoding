import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

// Groups home devices by room
function groupByRoom(devices) {
  return devices.reduce((acc, d) => {
    const r = d.room || 'General';
    if (!acc[r]) acc[r] = [];
    acc[r].push(d);
    return acc;
  }, {});
}

// Determines which product categories are missing from the home
function getSuggestedProducts(homeDevices, allProducts) {
  const homeProductIds = new Set(homeDevices.map(d => d.product_id));
  const installedCategories = new Set(homeDevices.map(d => d.category));

  // Suggest: HA hardware if not present but user has other devices
  // Suggest: Sensors if user has energy devices but no sensors
  const suggestions = [];

  // Filter out products already in home
  const notInstalled = allProducts.filter(p => !homeProductIds.has(p.id));

  // Priority 1: HA hardware – essential for any setup
  if (!installedCategories.has('Home Assistant Hardware')) {
    const haHardware = notInstalled.filter(p => p.category === 'Home Assistant Hardware');
    if (haHardware.length > 0) {
      suggestions.push({
        reason: 'You need a Home Assistant hub to control all your devices locally',
        products: haHardware,
      });
    }
  }

  // Priority 2: Sensors & Monitoring if user has energy/solar/storage devices
  const hasEnergyDevice = installedCategories.has('Solar & Inverters') ||
    installedCategories.has('Energy Storage') ||
    installedCategories.has('HVAC & Climate Control') ||
    installedCategories.has('Geothermal & Heat Pumps');
  if (hasEnergyDevice && !installedCategories.has('Sensors & Monitoring')) {
    const sensors = notInstalled.filter(p => p.category === 'Sensors & Monitoring');
    if (sensors.length > 0) {
      suggestions.push({
        reason: 'Add energy monitoring sensors to track consumption from your installed devices',
        products: sensors,
      });
    }
  }

  // Priority 3: Everything else grouped by category
  const coveredCategories = new Set(suggestions.flatMap(s => s.products.map(p => p.category)));
  installedCategories.forEach(cat => coveredCategories.add(cat));
  const remaining = notInstalled.filter(p => !coveredCategories.has(p.category));
  if (remaining.length > 0) {
    const byCategory = remaining.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
    Object.entries(byCategory).forEach(([cat, products]) => {
      suggestions.push({ reason: `Expand your ${cat} setup`, products });
    });
  }

  return suggestions;
}

export default function MyHome({ homeDevices, allProducts, onRemoveDevice, onAddToHome }) {
  const grouped = groupByRoom(homeDevices);
  const rooms = Object.keys(grouped).sort();
  const suggestions = homeDevices.length > 0 ? getSuggestedProducts(homeDevices, allProducts) : [];

  if (homeDevices.length === 0) {
    return (
      <div className="space-y-6">
        <HomeStats devices={homeDevices} />
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🏠</p>
          <p className="font-semibold text-gray-600 text-lg">Your home is empty</p>
          <p className="text-sm mt-2">
            Go to the <span className="font-medium text-cyan-600">Store</span> and click{' '}
            <span className="font-medium text-slate-700">"Add to My Home"</span> on any product
            to start building your smart home.
          </p>
        </div>
        <SuggestedSection suggestions={getSuggestedProducts([], allProducts)} onAddToHome={onAddToHome} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HomeStats devices={homeDevices} />

      {/* Devices by room */}
      {rooms.map(room => (
        <section key={room}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span>🚪</span> {room}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grouped[room].map(device => (
              <HomeDeviceCard
                key={device.id}
                device={device}
                onRemove={() => onRemoveDevice(device.id, device.name)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Suggested / additional products */}
      {suggestions.length > 0 && (
        <SuggestedSection suggestions={suggestions} onAddToHome={onAddToHome} />
      )}
    </div>
  );
}

/* ── Home Stats ── */
function HomeStats({ devices }) {
  const categoryCount = new Set(devices.map(d => d.category)).size;
  const rooms = new Set(devices.map(d => d.room)).size;
  const totalValue = devices.reduce((sum, d) => sum + d.price, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Installed Devices" value={devices.length} icon="⚡" color="bg-slate-50" />
      <StatCard label="Categories" value={categoryCount} icon="🗂️" color="bg-blue-50" />
      <StatCard label="Rooms Covered" value={rooms} icon="🚪" color="bg-cyan-50" />
      <StatCard
        label="Setup Value"
        value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon="💎"
        color="bg-emerald-50"
      />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`${color} rounded-2xl p-4 flex items-center gap-3`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

/* ── Single installed device card ── */
function HomeDeviceCard({ device, onRemove }) {
  const icon = CATEGORY_ICONS[device.category] || '📦';
  const badge = CATEGORY_COLORS[device.category] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-5 pt-5 pb-4 flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-sm">{device.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{device.sku}</p>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        <span className={`self-start text-xs font-medium px-2.5 py-0.5 rounded-full ${badge}`}>
          {device.category}
        </span>
        {device.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{device.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-slate-800">${device.price.toFixed(2)}</span>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Installed
          </span>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Room: <span className="font-medium text-gray-600">{device.room}</span>
        </span>
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
          aria-label="Remove from home"
          title="Remove from My Home"
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
  );
}

/* ── Suggested products section ── */
function SuggestedSection({ suggestions, onAddToHome }) {
  if (suggestions.length === 0) return null;
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
        <span>💡</span> Additional Products for Your Setup
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Products from the store that can enhance or complete your smart home.
      </p>
      <div className="space-y-6">
        {suggestions.map((group, i) => (
          <div key={i}>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
              💡 {group.reason}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.products.map(product => (
                <SuggestedCard key={product.id} product={product} onAddToHome={onAddToHome} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Single suggested product card ── */
function SuggestedCard({ product, onAddToHome }) {
  const icon = CATEGORY_ICONS[product.category] || '📦';
  const badge = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-800';
  const outOfStock = product.quantity === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 flex flex-col overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-5 pt-5 pb-4 flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-sm">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{product.sku}</p>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        <span className={`self-start text-xs font-medium px-2.5 py-0.5 rounded-full ${badge}`}>
          {product.category}
        </span>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-slate-800">${product.price.toFixed(2)}</span>
          {outOfStock && <span className="text-xs font-semibold text-red-500">Out of Stock</span>}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <button
          onClick={() => onAddToHome(product)}
          disabled={outOfStock}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add to My Home
        </button>
      </div>
    </div>
  );
}
