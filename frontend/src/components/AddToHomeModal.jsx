import { useState } from 'react';
import { CATEGORY_ICONS } from '../constants';

const SUGGESTED_ROOMS = ['Living Room', 'Kitchen', 'Bedroom', 'Basement', 'Attic', 'Garage', 'Garden', 'Office', 'General'];

export default function AddToHomeModal({ product, onClose, onConfirm }) {
  const [room, setRoom] = useState('General');
  const [customRoom, setCustomRoom] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const icon = CATEGORY_ICONS[product.category] || '📦';

  function handleSubmit(e) {
    e.preventDefault();
    const finalRoom = useCustom ? customRoom.trim() || 'General' : room;
    onConfirm(product.id, finalRoom);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-white font-semibold text-sm leading-tight">Add to My Home</h2>
              <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a room</label>
            <div className="grid grid-cols-3 gap-2">
              {SUGGESTED_ROOMS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRoom(r); setUseCustom(false); }}
                  className={`text-xs px-3 py-2 rounded-xl border font-medium transition-all ${
                    !useCustom && room === r
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setUseCustom(v => !v)}
              className={`text-xs font-medium transition-colors ${useCustom ? 'text-cyan-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {useCustom ? '✕ Cancel custom room' : '+ Enter a custom room name'}
            </button>
            {useCustom && (
              <input
                type="text"
                value={customRoom}
                onChange={e => setCustomRoom(e.target.value)}
                placeholder="e.g. Utility Room"
                className="mt-2 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                autoFocus
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors"
            >
              Add to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
