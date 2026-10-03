import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Search, SlidersHorizontal, Plus, ShoppingBag, X } from 'lucide-react';

interface PublicShopProps {
  onCustomizeProduct: (product: Product) => void;
}

export const PublicShop: React.FC<PublicShopProps> = ({ onCustomizeProduct }) => {
  const { products, addToCart, setIsCartOpen } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlower, setSelectedFlower] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFlower = selectedFlower === 'all' || p.flowerType === selectedFlower;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFlower && matchesSearch;
  });

  const handleProductAction = (product: Product) => {
    if (product.stock <= 0) return;
    if (product.customizable) {
      onCustomizeProduct(product);
    } else {
      addToCart(product);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
          Katalog Produk Resmi
        </span>
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-stone-900">
          Koleksi Seduhan Alami FLOREA
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Pilih kemasan praktis single-serve tea bag untuk dinikmati kapan saja, atau pesan minuman siap saji dingin untuk kesegaran instan.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Cari varian teh telang, rosella, tea bag, atau tumbler..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4E3875] bg-[#FAF7F2]/50"
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

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#4E3875] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Menu ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory('online_tea_bag')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'online_tea_bag'
                ? 'bg-[#4E3875] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Kemasan Tea Bag (Online Pouch)
          </button>
          <button
            onClick={() => setSelectedCategory('offline_rtd')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'offline_rtd'
                ? 'bg-[#4E3875] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Minuman Dingin Siap Minum (Cup RTD)
          </button>
          <button
            onClick={() => setSelectedCategory('signature_blend')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'signature_blend'
                ? 'bg-[#4E3875] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Signature Blends
          </button>
          <button
            onClick={() => setSelectedCategory('merchandise')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'merchandise'
                ? 'bg-[#4E3875] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Merchandise & Tumbler
          </button>
        </div>

        {/* Botanical subfilter */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span className="font-medium text-stone-400">Varian:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'all', label: 'Semua' },
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                isOutOfStock ? 'opacity-60' : 'hover:border-[#4E3875] hover:shadow-md'
              }`}
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="bg-white text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {product.unit}
                    </span>
                    {isOutOfStock && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Stok Habis
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-stone-400">
                    {product.flowerType.replace('_', ' ')} · SKU: {product.sku}
                  </div>
                  <h3 className="font-serif-brand font-bold text-base text-stone-900 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.benefits.map((b, idx) => (
                      <span key={idx} className="text-[10px] bg-[#FAF7F2] text-stone-700 px-2 py-0.5 rounded font-medium border border-stone-200">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Harga</span>
                  <span className="text-base font-bold font-mono-num text-stone-900">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleProductAction(product)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#4E3875] hover:bg-[#3C2A5C] text-white active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.customizable ? 'Kustom Pesanan' : 'Tambah Keranjang'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-2">
          <p className="text-sm font-semibold text-stone-700">Tidak ada produk yang sesuai filter</p>
          <p className="text-xs text-stone-400">Silakan ganti kata kunci pencarian atau kategori.</p>
        </div>
      )}

    </div>
  );
};
