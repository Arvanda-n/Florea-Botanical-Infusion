import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { FloreaLogo } from './FloreaLogo';
import { 
  Store, 
  Package, 
  BarChart3, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CloudCheck, 
  UserCheck, 
  ChevronDown,
  Printer,
  Lock,
  ArrowLeft
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    allUsers, 
    switchUser, 
    isOwnerAdmin,
    lowStockProducts,
    lowStockMaterials,
    isCloudSynced,
    lastBackupTime,
    printerSettings,
    updatePrinterSettings,
    setPortalMode
  } = usePOS();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedSwitchUser, setSelectedSwitchUser] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [showPrinterModal, setShowPrinterModal] = useState(false);

  const totalLowStock = lowStockProducts.length + lowStockMaterials.length;

  const handleSelectUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    setSelectedSwitchUser(userId);
    setPinInput('');
    setPinError('');
    setShowPinModal(true);
    setShowUserDropdown(false);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSwitchUser) return;
    const success = switchUser(selectedSwitchUser, pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput('');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF7F2] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Zone 1: Brand Wordmark with Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('pos')}
                className="flex items-center gap-2 text-left focus:outline-none"
              >
                <FloreaLogo size="sm" showSubtitle={false} />
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4E3875] text-white">
                  Staff POS
                </span>
              </button>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'pos'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Kasir POS</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap relative ${
                  activeTab === 'inventory'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Manajemen Stok</span>
                {totalLowStock > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Laporan & Analitik</span>
              </button>

              <button
                onClick={() => setActiveTab('loyalty')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'loyalty'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Loyalitas Poin</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog_lab')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'catalog_lab'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Katalog & Visual Lab</span>
              </button>

              <button
                onClick={() => setActiveTab('security_backup')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'security_backup'
                    ? 'bg-[#4E3875] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cloud & Keamanan</span>
              </button>
            </nav>

            {/* Zone 3: Primary Actions & User Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Back to Public Website Button */}
              <button
                onClick={() => setPortalMode('public')}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-bold text-stone-800 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ke Website Publik</span>
              </button>

              {/* Low Stock Warning Trigger */}
              {totalLowStock > 0 && (
                <button
                  onClick={() => setShowLowStockModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                  title="Peringatan stok menipis"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="hidden sm:inline font-mono-num">{totalLowStock}</span>
                </button>
              )}

              {/* Printer Thermal Quick Status */}
              <button
                onClick={() => setShowPrinterModal(true)}
                className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title={`Printer Thermal: ${printerSettings.paperWidth}`}
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Active User Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors text-left"
                >
                  <div className={`w-6 h-6 rounded-md ${currentUser.avatarBg} text-white flex items-center justify-center text-[11px] font-bold`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {isOwnerAdmin ? 'Owner / Admin' : 'Kasir'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-stone-200 shadow-lg py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3.5 py-2 border-b border-stone-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Pilih Pengguna Sistem
                      </p>
                    </div>
                    <div className="py-1">
                      {allUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 transition-colors ${
                            user.id === currentUser.id ? 'bg-[#FAF7F2] font-semibold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-md ${user.avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs text-stone-900 font-medium">{user.name}</p>
                              <p className="text-[10px] text-stone-500">{user.division}</p>
                            </div>
                          </div>
                          {user.id === currentUser.id && (
                            <UserCheck className="w-4 h-4 text-[#4E3875]" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="px-3.5 py-2 border-t border-stone-100 text-[11px] text-stone-500 bg-stone-50/50">
                      PIN default: Admin <code className="font-mono bg-white px-1 border border-stone-200 rounded">1234</code>, Kasir <code className="font-mono bg-white px-1 border border-stone-200 rounded">1111</code>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around px-2 py-1.5 border-t border-stone-200 bg-white overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 ${
              activeTab === 'pos' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Kasir POS
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 relative ${
              activeTab === 'inventory' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Stok
            {totalLowStock > 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 ml-1"></span>}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 ${
              activeTab === 'reports' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Laporan
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 ${
              activeTab === 'loyalty' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Member
          </button>
          <button
            onClick={() => setActiveTab('catalog_lab')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 ${
              activeTab === 'catalog_lab' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Katalog Lab
          </button>
          <button
            onClick={() => setActiveTab('security_backup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md shrink-0 ${
              activeTab === 'security_backup' ? 'bg-purple-900 text-white' : 'text-stone-600'
            }`}
          >
            Cloud
          </button>
        </div>
      </header>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Autentikasi Pengguna</h3>
                <p className="text-xs text-stone-500">
                  Masukkan PIN akun {allUsers.find(u => u.id === selectedSwitchUser)?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmPin}>
              <div className="mb-4">
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
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 text-center">{pinError}</p>
                )}
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  Petunjuk demo: Admin PIN <code className="font-mono">1234</code> · Kasir PIN <code className="font-mono">1111</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Verifikasi Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Low Stock Drawer / Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">Notifikasi Stok Menipis Real-Time</h3>
                  <p className="text-xs text-stone-500">Segera lakukan persiapan bahan & pengadaan supplier</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLowStockModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-4 flex-1">
              {lowStockProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2">
                    Produk Jadi Siap Jual ({lowStockProducts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80">
                        <div>
                          <p className="text-xs font-medium text-stone-900">{p.name}</p>
                          <p className="text-[11px] text-stone-500">SKU: {p.sku} · Min: {p.minStockAlert} {p.unit}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-700 font-mono-num">
                            Sisa {p.stock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockMaterials.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2">
                    Bahan Baku & Kemasan Botani ({lowStockMaterials.length})
                  </h4>
                  <div className="space-y-1.5">
                    {lowStockMaterials.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/60 border border-rose-200/80">
                        <div>
                          <p className="text-xs font-medium text-stone-900">{m.name}</p>
                          <p className="text-[11px] text-stone-500">Pemasok: {m.supplier} · Min: {m.minThreshold} {m.unit}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-rose-700 font-mono-num">
                            {m.currentStock} {m.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">Audit sistem real-time aktif</span>
              <button
                onClick={() => {
                  setShowLowStockModal(false);
                  setActiveTab('inventory');
                }}
                className="py-1.5 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
              >
                Buka Manajemen Stok & Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printer Thermal Settings Modal */}
      {showPrinterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-purple-800" />
                <h3 className="font-semibold text-stone-900 text-base">Konfigurasi Printer Thermal</h3>
              </div>
              <button 
                onClick={() => setShowPrinterModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Lebar Kertas Thermal (ESC/POS)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updatePrinterSettings({ paperWidth: '58mm' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                      printerSettings.paperWidth === '58mm'
                        ? 'border-purple-800 bg-purple-50 text-purple-900'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    58mm (Printer Bluetooth Mini)
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePrinterSettings({ paperWidth: '80mm' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                      printerSettings.paperWidth === '80mm'
                        ? 'border-purple-800 bg-purple-50 text-purple-900'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    80mm (Desktop Thermal Printer)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Toko di Header Struk
                </label>
                <input
                  type="text"
                  value={printerSettings.storeName}
                  onChange={e => updatePrinterSettings({ storeName: e.target.value })}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Alamat / Lokasi Stand
                </label>
                <input
                  type="text"
                  value={printerSettings.storeAddress}
                  onChange={e => updatePrinterSettings({ storeAddress: e.target.value })}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Pesan Footer Gen Z
                </label>
                <input
                  type="text"
                  value={printerSettings.footerNote}
                  onChange={e => updatePrinterSettings({ footerNote: e.target.value })}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPrinterModal(false)}
                  className="w-full py-2 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Simpan & Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
