import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, ProductCategory, FlowerType } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { CustomizationModal } from './CustomizationModal';
import { MemberSelectModal } from './MemberSelectModal';
import { CheckoutModal } from './CheckoutModal';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  SlidersHorizontal, 
  Tag, 
  UserCheck, 
  X,
  CreditCard,
  ChevronRight
} from 'lucide-react';

export const POSView: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    cartSubtotal,
    activeCustomer,
    setActiveCustomer,
    pointsToRedeem,
    setPointsToRedeem,
    discountVoucher,
    applyVoucher,
    removeVoucher,
    currentUser,
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlower, setSelectedFlower] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [voucherInput, setVoucherInput] = useState<string>('');

  // Mobile cart drawer open state
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFlower = selectedFlower === 'all' || p.flowerType === selectedFlower;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFlower && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0) return;
    if (product.customizable) {
      setCustomizingProduct(product);
    } else {
      addToCart(product);
    }
  };

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
    }
  };

  const discountAmount = discountVoucher ? discountVoucher.amount : 0;
  const pointsDiscount = pointsToRedeem * 10;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount - pointsDiscount);
  const maxRedeemablePoints = activeCustomer 
    ? Math.min(activeCustomer.points, Math.floor(cartSubtotal / 10))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Top Banner Notice: Target Market Gen Z & Brand Experience */}
      <div className="mb-4 sm:mb-6 p-4 rounded-2xl bg-[#4E3875] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-brand font-bold text-lg tracking-wide">
              FLOREA POS & Cashier Station
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#3C2A5C] text-white">
              Sip The Magic
            </span>
          </div>
          <p className="text-xs text-purple-200 mt-0.5 font-light">
            Solusi seduhan botanical telang & rosella kekinian · Transaksi cepat, pencatatan otomatis, dan point reward.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-purple-200">Kasir Bertugas:</span>
          <span className="font-semibold bg-[#3C2A5C] px-2.5 py-1 rounded-lg border border-purple-400/30">
            {currentUser.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Catalog & Products (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search and Category Filter Bar */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari menu telang, rosella, tea bag, atau scan SKU..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 bg-stone-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs: Category */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua Produk ({products.length})
              </button>
              <button
                onClick={() => setSelectedCategory('offline_rtd')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'offline_rtd'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Minuman Segar Ready-to-Drink (Cup)
              </button>
              <button
                onClick={() => setSelectedCategory('online_tea_bag')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'online_tea_bag'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Kemasan Tea Bag (Online/Pouch)
              </button>
              <button
                onClick={() => setSelectedCategory('signature_blend')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'signature_blend'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Signature Blends
              </button>
              <button
                onClick={() => setSelectedCategory('merchandise')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'merchandise'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Merchandise
              </button>
            </div>

            {/* Sub Filter: Flower Type */}
            <div className="flex items-center gap-2 pt-1 border-t border-stone-100 text-xs text-stone-500">
              <span className="font-medium text-stone-400">Varian Botani:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'Semua Bahan' },
                  { id: 'butterfly_pea', label: 'Bunga Telang 🪻' },
                  { id: 'roselle', label: 'Kelopak Rosella 🌺' },
                  { id: 'blend', label: 'Sunset Blend ✨' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlower(f.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      selectedFlower === f.id
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map(product => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock <= product.minStockAlert && !isOutOfStock;

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`group relative bg-white rounded-2xl border transition-all overflow-hidden flex flex-col cursor-pointer ${
                    isOutOfStock
                      ? 'border-stone-200 opacity-60 pointer-events-none'
                      : 'border-stone-200/90 hover:border-purple-800 hover:shadow-md active:scale-[0.99]'
                  }`}
                >
                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock Alert Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isOutOfStock ? (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          Habis
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          Sisa {product.stock}
                        </span>
                      ) : null}

                      {product.isPopular && !isOutOfStock && (
                        <span className="bg-purple-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                          Favorit
                        </span>
                      )}
                    </div>

                    {/* Customizable indicator icon */}
                    {product.customizable && (
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-stone-700 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        <SlidersHorizontal className="w-3 h-3 text-purple-700" />
                        <span>Kustom</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                        {product.sku} · {product.flowerType.replace('_', ' ')}
                      </div>
                      <h4 className="font-serif-brand font-bold text-sm text-stone-900 group-hover:text-purple-950 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-purple-950 font-mono-num">
                          {formatRupiah(product.price)}
                        </span>
                        <p className="text-[10px] text-stone-400">
                          Stok: {product.stock}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`Tambah ${product.name}`}
                        className="w-7 h-7 rounded-lg bg-purple-50 text-purple-900 group-hover:bg-purple-900 group-hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <p className="text-sm font-semibold text-stone-700">Tidak ada produk yang cocok</p>
              <p className="text-xs text-stone-400 mt-1">Coba ubah kata kunci atau filter varian botani.</p>
            </div>
          )}
        </div>

        {/* Right Column: Active Cart & Fast Checkout Panel (4 Cols Desktop, Bottom Drawer Mobile) */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 flex flex-col">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-brand font-bold text-base text-stone-900 leading-tight">
                    Daftar Pesanan
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {cart.reduce((s, i) => s + i.quantity, 0)} item terpilih
                  </p>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-600 text-xs font-semibold p-1 transition-colors"
                  title="Kosongkan Pesanan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Member Card / Selector */}
            <div className="my-3 p-3 rounded-xl bg-purple-50/70 border border-purple-200/80">
              {activeCustomer ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-purple-950">
                        {activeCustomer.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded">
                        {activeCustomer.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800 font-mono-num mt-0.5">
                      Poin: <strong>{activeCustomer.points}</strong> pts · {activeCustomer.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCustomer(null)}
                    className="p-1 text-purple-500 hover:text-purple-800"
                    title="Hapus member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMemberModal(true)}
                  className="w-full flex items-center justify-between text-left text-xs text-purple-950 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-800" />
                    <span>Pilih Member (Dapatkan Poin)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                </button>
              )}

              {/* Point Redemption Slider if Customer has Points */}
              {activeCustomer && activeCustomer.points > 0 && (
                <div className="mt-2.5 pt-2 border-t border-purple-200/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-purple-900 font-medium">Tukar Poin Member:</span>
                    <span className="font-bold text-purple-950 font-mono-num">
                      {pointsToRedeem} pts (-{formatRupiah(pointsToRedeem * 10)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxRedeemablePoints}
                    step={10}
                    value={pointsToRedeem}
                    onChange={e => setPointsToRedeem(Number(e.target.value))}
                    className="w-full accent-purple-800 h-1.5 bg-purple-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-purple-700 mt-0.5 font-mono-num">
                    <span>0</span>
                    <span>Maks: {maxRedeemablePoints} pts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 py-1 pr-1">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <p className="text-xs font-bold text-stone-900 leading-tight">
                          {item.product.name}
                        </p>
                        {/* Options summary */}
                        {(item.selectedIce || item.selectedSugar || item.selectedPackage || (item.selectedToppings && item.selectedToppings.length > 0)) && (
                          <p className="text-[10px] text-stone-500 italic mt-0.5">
                            {[
                              item.selectedPackage,
                              item.selectedIce,
                              item.selectedSugar,
                              item.selectedToppings?.map(t => t.name).join(', ')
                            ].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        {item.customNotes && (
                          <p className="text-[10px] text-purple-700">
                            Ket: {item.customNotes}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-bold text-stone-900 font-mono-num shrink-0">
                        {formatRupiah(item.lineTotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <span className="text-[11px] text-stone-400 font-mono-num">
                        @ {formatRupiah(item.unitPrice)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono-num w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Keranjang transaksi masih kosong</p>
                  <p className="text-[10px] mt-0.5">Pilih menu di samping untuk memulai</p>
                </div>
              )}
            </div>

            {/* Voucher Coupon Section */}
            {cart.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                {discountVoucher ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{discountVoucher.code}</span>
                      <span className="font-mono-num">(-{formatRupiah(discountVoucher.amount)})</span>
                    </div>
                    <button
                      onClick={removeVoucher}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ketik voucher (BOTANICALCHILL)..."
                      value={voucherInput}
                      onChange={e => setVoucherInput(e.target.value)}
                      className="flex-1 py-1.5 px-2.5 text-xs uppercase font-mono border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (applyVoucher(voucherInput)) {
                          setVoucherInput('');
                        }
                      }}
                      className="py-1.5 px-3 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
                    >
                      Pakai
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Calculations & Checkout CTA */}
            <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono-num">{formatRupiah(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Diskon Promo:</span>
                  <span className="font-mono-num">-{formatRupiah(discountAmount)}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-xs text-purple-700">
                  <span>Tukar Poin ({pointsToRedeem} pts):</span>
                  <span className="font-mono-num">-{formatRupiah(pointsDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-stone-200">
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Total Bayar:
                </span>
                <span className="text-xl font-bold font-serif-brand text-purple-950 font-mono-num">
                  {formatRupiah(finalTotal)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setShowCheckoutModal(true)}
                className={`w-full mt-3 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  cart.length > 0
                    ? 'bg-purple-900 hover:bg-purple-800 text-white active:scale-[0.99]'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Transaksi ({formatRupiah(finalTotal)})</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Drink Customization Modal */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={handleCustomizationConfirm}
        />
      )}

      {/* Member Selection Modal */}
      {showMemberModal && (
        <MemberSelectModal
          onClose={() => setShowMemberModal(false)}
          onSelect={member => setActiveCustomer(member)}
        />
      )}

      {/* Checkout & Digital Payment Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

    </div>
  );
};
