export default function StatsBar({ products }) {
  const total = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Total Products" value={total} icon="📦" color="bg-slate-50" />
      <StatCard label="Inventory Value" value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" color="bg-cyan-50" />
      <StatCard label="Low Stock" value={lowStock} icon="⚠️" color="bg-amber-50" />
      <StatCard label="Out of Stock" value={outOfStock} icon="🚫" color="bg-red-50" />
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
