import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  Droplet, 
  ShieldCheck, 
  HeartHandshake, 
  Instagram, 
  Share2, 
  Check, 
  Coffee,
  ShoppingBag
} from 'lucide-react';

interface PublicHomeProps {
  onCustomizeProduct: (product: any) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onCustomizeProduct }) => {
  const { products, addToCart, setPublicTab, setIsCartOpen } = usePOS();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section (Solid Colors, No Gradients) */}
      <section className="bg-[#FAF7F2] border-b border-[#E7E3DC] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-xs font-semibold text-[#4E3875]">
                <Sparkles className="w-3.5 h-3.5 text-[#9B3354]" />
                <span>Minuman Botanical Infusion Sehat & Estetik</span>
              </div>

              <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] text-balance">
                Kebaikan Alami <br />
                <span className="text-[#4E3875]">Bunga Telang</span> &{' '}
                <span className="text-[#9B3354]">Rosella</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl">
                Nikmati seduhan herbal modern tanpa gula buatan. Kaya antioksidan antosianin alami, menyegarkan hari, dan ramah lingkungan dalam kemasan praktis single-serve.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setPublicTab('shop')}
                  className="py-3 px-6 rounded-xl bg-[#4E3875] hover:bg-[#3C2A5C] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Katalog Belanja Online</span>
                </button>

                <button
                  onClick={() => setPublicTab('experience')}
                  className="py-3 px-5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-[#E7E3DC] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <Droplet className="w-4 h-4 text-[#4E3875]" />
                  <span>Uji Laboratorium Warna</span>
                </button>
              </div>

              {/* Trust Badges (Solid unboxed) */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#2E6F40]" />
                  100% Botani Murni
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#2E6F40]" />
                  Bebas Gula Tambahan
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#2E6F40]" />
                  Petani Lokal Sukoharjo
                </span>
              </div>
            </div>

            {/* Hero Visual Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-[#E7E3DC] bg-white shadow-lg p-3">
                <img
                  src="/src/assets/images/florea_ready_to_drink_cup_1790712562653.jpg"
                  alt="FLOREA Botanical Infusion"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-brand font-bold text-base text-stone-900">
                      Magic Butterfly Pea & Sparkling Roselle
                    </h3>
                    <p className="text-xs text-stone-500">
                      Varian Ready-to-Drink di Bazaar Kampus & Kafe Rekanan
                    </p>
                  </div>
                  <span className="text-sm font-bold font-mono-num text-[#4E3875]">
                    Rp 18.000
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2 Formats Showcase: Online vs Offline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
            Solusi Dua Format Praktis
          </span>
          <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Nikmati FLOREA Sesuai Kebutuhanmu
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tersedia dalam kemasan praktis untuk seduh sendiri di rumah/kost, atau minuman segar siap minum di area kampus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Format 1: Online Tea Bags */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-56 rounded-2xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src="/src/assets/images/florea_butterfly_pea_tea_1790712539892.jpg"
                  alt="FLOREA Tea Bag Pouch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
                  Kemasan Daring (Online Store)
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-stone-900 mt-0.5">
                  Single-Serve Tea Bag Pouch (Isi 5 Kantong)
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Bunga telang dan kelopak rosella kering terstandardisasi higienis dalam kantong teh serat jagung (cornfiber) ramah lingkungan. Cukup seduh 3 menit di air panas atau dingin!
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Dua varian: Butterfly Pea Brew & Roselle Brew</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Tahan simpan hingga 12 bulan bebas pengawet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Dapat dikirim ke seluruh Indonesia</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">Mulai dari</span>
                <span className="text-base sm:text-lg font-bold text-stone-900 font-mono-num">
                  Rp 15.000 / box
                </span>
                <span className="text-[10px] text-stone-500 block">Telang Rp 15k · Rosella Rp 17k</span>
              </div>
              <button
                onClick={() => setPublicTab('shop')}
                className="py-2 px-4 rounded-xl bg-[#4E3875] text-white text-xs font-semibold hover:bg-[#3C2A5C] transition-colors"
              >
                Pesan Tea Bag
              </button>
            </div>
          </div>

          {/* Format 2: Offline Ready to Drink */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-56 rounded-2xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src="/src/assets/images/florea_roselle_tea_1790712550945.jpg"
                  alt="FLOREA Ready to Drink"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B3354]">
                  Minuman Siap Minum (Offline Bazaar & Kafe)
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-stone-900 mt-0.5">
                  Ready-to-Drink Chilled Botanical Cup (350ml)
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Seduhan dingin segar dengan demonstrasi warna alami di booth event kampus. Dilengkapi perasan lemon segar asli, madu randu murni, atau racikan sparkling soda menyegarkan dahaga.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Kustomisasi es, gula alami, dan topping chia/jelly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Wadah ramah lingkungan (PLA Biodegradable cup)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Diskon refill Rp 2.000 menggunakan Tumbler Florea</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">Harga cup</span>
                <span className="text-lg font-bold font-serif-brand text-stone-900 font-mono-num">
                  Rp 17.000 - Rp 18.000
                </span>
              </div>
              <button
                onClick={() => setPublicTab('locations')}
                className="py-2 px-4 rounded-xl bg-[#9B3354] text-white text-xs font-semibold hover:bg-[#822037] transition-colors"
              >
                Cek Lokasi Booth
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Pilihan Terfavorit
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
              Menu Rekomendasi Hari Ini
            </h2>
          </div>
          <button
            onClick={() => setPublicTab('shop')}
            className="text-xs font-semibold text-[#4E3875] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-white text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {product.unit}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-stone-400">
                    {product.flowerType.replace('_', ' ')}
                  </div>
                  <h3 className="font-serif-brand font-bold text-sm text-stone-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <span className="font-bold text-sm font-mono-num text-stone-900">
                  {formatRupiah(product.price)}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (product.customizable) {
                      onCustomizeProduct(product);
                    } else {
                      addToCart(product);
                      setIsCartOpen(true);
                    }
                  }}
                  className="py-1.5 px-3 rounded-lg bg-[#4E3875] hover:bg-[#3C2A5C] text-white text-xs font-semibold transition-colors"
                >
                  {product.customizable ? 'Kustom' : '+ Tambah'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiential Teaser Banner: Color Changing Phenomenon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FAF7F2] border border-[#E7E3DC] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
              Sains & Keajaiban Botani
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-900">
              Kenapa Warna Bunga Telang Bisa Berubah?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Bunga telang kaya akan pigmen antosianin alami yang sangat peka terhadap tingkat keasaman (pH). Saat kamu menambahkan beberapa tetes perasan lemon segar, warnanya seketika bermutasi dari biru safir menjadi ungu royal yang memikat!
            </p>
            <div className="pt-2">
              <button
                onClick={() => setPublicTab('experience')}
                className="py-2.5 px-5 rounded-xl bg-[#4E3875] text-white text-xs font-bold hover:bg-[#3C2A5C] transition-colors inline-flex items-center gap-2"
              >
                <span>Coba Simulator Perubahan Warna</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-72 p-5 bg-white rounded-2xl border border-stone-200 text-center space-y-3 shadow-xs shrink-0">
            <div className="flex justify-center gap-3 text-3xl">
              <span>🔵</span>
              <span>➡️</span>
              <span>🟣</span>
            </div>
            <p className="text-xs font-bold text-stone-900">
              pH 7.0 Netral → pH 4.0 Asam
            </p>
            <p className="text-[11px] text-stone-500">
              Interaksi molekuler alami tanpa setetes pun pewarna sintetis buatan.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
