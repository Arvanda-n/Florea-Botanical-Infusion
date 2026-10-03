/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Header } from './components/Header';
import { POSView } from './components/POS/POSView';
import { InventoryView } from './components/Inventory/InventoryView';
import { ReportsAnalyticsView } from './components/Reports/ReportsAnalyticsView';
import { LoyaltyMembersView } from './components/Loyalty/LoyaltyMembersView';
import { InteractiveColorLabView } from './components/CatalogLab/InteractiveColorLabView';
import { SecurityBackupView } from './components/SecurityBackup/SecurityBackupView';
import { ToastContainer } from './components/ToastContainer';
import { ThermalReceipt } from './components/ThermalReceipt';
import { CustomizationModal } from './components/POS/CustomizationModal';

// Public Website Components
import { PublicHeader } from './components/Public/PublicHeader';
import { PublicHome } from './components/Public/PublicHome';
import { PublicShop } from './components/Public/PublicShop';
import { PublicLocations } from './components/Public/PublicLocations';
import { PublicMemberCheck } from './components/Public/PublicMemberCheck';
import { PublicCartDrawer } from './components/Public/PublicCartDrawer';
import { FloreaLogo } from './components/FloreaLogo';
import { Product } from './types';
import { Lock, Store } from 'lucide-react';

const AppMain: React.FC = () => {
  const { 
    portalMode, 
    setPortalMode, 
    publicTab, 
    setPublicTab, 
    activeTab, 
    currentOrderReceipt,
    addToCart,
    setIsCartOpen 
  } = usePOS();

  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  const handleCustomizationConfirm = (options: {
    ice?: string;
    sugar?: string;
    toppings?: { id: string; name: string; price: number }[];
    package?: string;
    notes?: string;
  }) => {
    if (customizingProduct) {
      addToCart(customizingProduct, options);
      setCustomizingProduct(null);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-purple-100 selection:text-purple-900 font-sans">
      
      {/* Dynamic Header: Public Website vs Staff POS */}
      {portalMode === 'public' ? (
        <PublicHeader />
      ) : (
        <Header />
      )}

      {/* Main View Port */}
      <main className="flex-1 pb-16">
        {portalMode === 'public' ? (
          /* Public Website View */
          <>
            {publicTab === 'home' && (
              <PublicHome onCustomizeProduct={p => setCustomizingProduct(p)} />
            )}
            {publicTab === 'shop' && (
              <PublicShop onCustomizeProduct={p => setCustomizingProduct(p)} />
            )}
            {publicTab === 'experience' && (
              <InteractiveColorLabView />
            )}
            {publicTab === 'locations' && (
              <PublicLocations />
            )}
            {publicTab === 'member_check' && (
              <PublicMemberCheck />
            )}
            <PublicCartDrawer />
          </>
        ) : (
          /* Staff POS & Management View */
          <>
            {activeTab === 'pos' && <POSView />}
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'reports' && <ReportsAnalyticsView />}
            {activeTab === 'loyalty' && <LoyaltyMembersView />}
            {activeTab === 'catalog_lab' && <InteractiveColorLabView />}
            {activeTab === 'security_backup' && <SecurityBackupView />}
          </>
        )}
      </main>

      {/* Modern, Clean & Unified Brand Footer */}
      <footer className="bg-white border-t border-stone-200 py-10 text-stone-600 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <FloreaLogo size="md" showSubtitle={true} />
              <p className="text-xs text-stone-500 mt-2 max-w-md font-light leading-relaxed">
                Minuman botanical infusion sehat berbahan dasar bunga telang dan kelopak rosella lokal Indonesia. 100% alami, rendah gula, estetis, dan kaya antioksidan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
              <button 
                onClick={() => {
                  setPortalMode('public');
                  setPublicTab('home');
                }} 
                className="hover:text-[#4E3875] transition-colors"
              >
                Beranda
              </button>
              <button 
                onClick={() => {
                  setPortalMode('public');
                  setPublicTab('shop');
                }} 
                className="hover:text-[#4E3875] transition-colors"
              >
                Katalog Menu
              </button>
              <button 
                onClick={() => {
                  setPortalMode('public');
                  setPublicTab('experience');
                }} 
                className="hover:text-[#4E3875] transition-colors"
              >
                Experiential Lab
              </button>
              <button 
                onClick={() => {
                  setPortalMode('public');
                  setPublicTab('member_check');
                }} 
                className="hover:text-[#4E3875] transition-colors"
              >
                Cek Poin Member
              </button>
              <button 
                onClick={() => setPortalMode('staff_pos')}
                className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#FAF7F2] text-[#4E3875] hover:bg-[#F2EEF8] font-semibold border border-stone-200 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Portal Kasir & Admin</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
            <p>
              © {new Date().getFullYear()} FLOREA Botanical Infusion · Program Kreativitas Mahasiswa Kewirausahaan (PKM-K) UDB Surakarta
            </p>
            <div className="flex items-center gap-4">
              <span>Instagram: @florea.botanical</span>
              <span>·</span>
              <span>Solo Raya, Jawa Tengah</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Product Customization Modal */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={handleCustomizationConfirm}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Hidden print container for ESC/POS Thermal Printer */}
      {currentOrderReceipt && (
        <div className="hidden print:block">
          <ThermalReceipt transaction={currentOrderReceipt} />
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <AppMain />
    </POSProvider>
  );
}
