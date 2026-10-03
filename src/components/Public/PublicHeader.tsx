import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { FloreaLogo } from '../FloreaLogo';
import { 
  ShoppingBag, 
  Store, 
  Lock, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { 
    publicTab, 
    setPublicTab, 
    setPortalMode, 
    cart, 
    setIsCartOpen,
    currentUser,
    allUsers,
    switchUser
  } = usePOS();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedStaffUser, setSelectedStaffUser] = useState<string>(currentUser.id);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenStaffPortal = (e: React.FormEvent) => {
    e.preventDefault();
    const success = switchUser(selectedStaffUser, pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput('');
      setPortalMode('staff_pos');
    } else {
      setPinError('PIN salah! Coba default: 1234 (Admin) atau 1111 (Kasir)');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'shop', label: 'Katalog Belanja' },
    { id: 'experience', label: 'Laboratorium Warna' },
    { id: 'locations', label: 'Lokasi & Bazaar' },
    { id: 'member_check', label: 'Cek Poin Member' },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Zone 1: Brand Wordmark with Logo */}
            <button
              onClick={() => setPublicTab('home')}
              className="text-left focus:outline-none transition-opacity hover:opacity-90"
            >
              <FloreaLogo size="md" showSubtitle={true} />
            </button>

            {/* Zone 2: Navigation Links (Clean text, no pill badges) */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map(link => {
                const isActive = publicTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setPublicTab(link.id)}
                    className={`text-xs font-semibold tracking-wide transition-colors whitespace-nowrap py-1 relative ${
                      isActive 
                        ? 'text-[#4E3875] font-bold' 
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4E3875] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Shopping Bag & Staff Switcher */}
            <div className="flex items-center gap-3">
              
              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl border border-[#E7E3DC] bg-white text-stone-800 hover:bg-stone-50 transition-colors flex items-center gap-2"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag className="w-4 h-4 text-[#4E3875]" />
                <span className="hidden sm:inline text-xs font-bold text-stone-900">
                  Keranjang
                </span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#9B3354] text-white text-[11px] font-bold flex items-center justify-center font-mono-num">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Staff / Kasir Portal Switcher */}
              <button
                onClick={() => {
                  setPinInput('');
                  setPinError('');
                  setShowPinModal(true);
                }}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#4E3875] hover:bg-[#3C2A5C] text-white text-xs font-bold transition-colors shadow-xs"
                title="Buka Sistem Kasir & Admin POS Florea"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal Kasir POS</span>
                <Lock className="w-3 h-3 opacity-60" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-[#E7E3DC] bg-white text-stone-700"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E3DC] bg-white px-4 py-3 space-y-2 animate-in fade-in duration-150">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setPublicTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  publicTab === link.id
                    ? 'bg-[#F2EEF8] text-[#4E3875]'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowPinModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-[#4E3875] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Masuk ke Mode Kasir (Staff)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Staff POS Auth Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F2EEF8] flex items-center justify-center text-[#4E3875]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Portal Kasir & Admin</h3>
                <p className="text-xs text-stone-500">Khusus tim pengusul & staf operasional FLOREA</p>
              </div>
            </div>

            <form onSubmit={handleOpenStaffPortal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pilih Staf / Kasir
                </label>
                <select
                  value={selectedStaffUser}
                  onChange={e => setSelectedStaffUser(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                >
                  {allUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role === 'owner_admin' ? 'Owner / Admin' : 'Kasir'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Masukkan PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  placeholder="Ketik 4-digit PIN..."
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-2 px-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1 text-center">{pinError}</p>
                )}
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  Petunjuk demo: Admin PIN <code className="font-mono bg-stone-100 px-1 rounded">1234</code> · Kasir PIN <code className="font-mono bg-stone-100 px-1 rounded">1111</code>
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#4E3875] hover:bg-[#3C2A5C] rounded-lg transition-colors shadow-xs"
                >
                  Buka Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
