import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  Sparkles, 
  Droplet, 
  Leaf, 
  Share2, 
  Instagram, 
  ExternalLink, 
  Check, 
  Flame, 
  ShieldCheck, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const InteractiveColorLabView: React.FC = () => {
  const { products, addToCart, setActiveTab } = usePOS();

  // Color transformation state
  // 0 = pH 7 (Pure Blue), 50 = pH 4.5 (Vivid Purple), 100 = pH 2.5 (Pink Magenta)
  const [lemonAcidity, setLemonAcidity] = useState<number>(35);

  // Dynamic solid color calculation based on lemon acidity (no gradients)
  const getTeaColor = (val: number) => {
    if (val < 25) {
      // Royal Sapphire Blue
      return {
        bgColor: '#1D4ED8', // Solid sapphire blue
        glow: 'rgba(29, 78, 216, 0.3)',
        ph: (7.0 - (val / 25) * 1.5).toFixed(1),
        stateName: 'Royal Sapphire Blue (pH Netral)',
        desc: 'Pigmen Antosianin alami dalam kondisi basa/netral. Memberikan efek menenangkan dan relaksasi pikiran.'
      };
    } else if (val < 70) {
      // Purple / Violet Magic
      return {
        bgColor: '#6D28D9', // Solid royal violet
        glow: 'rgba(109, 40, 217, 0.3)',
        ph: (5.5 - ((val - 25) / 45) * 1.5).toFixed(1),
        stateName: 'Mystic Floral Purple (pH Asam Sedang)',
        desc: 'Reaksi kimia organik ion hidrogen mengubah konformasi molekul antosianin menjadi warna ungu spektakuler.'
      };
    } else {
      // Vivid Pinkish Magenta
      return {
        bgColor: '#BE185D', // Solid magenta pink
        glow: 'rgba(190, 24, 93, 0.3)',
        ph: (4.0 - ((val - 70) / 30) * 1.2).toFixed(1),
        stateName: 'Vivid Sunset Magenta (pH Kaya Vitamin C)',
        desc: 'Kadar asam sitrat lemon tinggi. Sangat segar di tenggorokan dengan suntikan vitamin C alami ganda.'
      };
    }
  };

  const currentTeaState = getTeaColor(lemonAcidity);

  // Social media quick share text
  const shareText = "Aku baru coba botanical infusion dari FLOREA! Teh bunga telang dan rosela alami yang estetik, anti-stress, dan bebas gula. Yuk cobain di @florea.botanical ✨";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="/src/assets/images/florea_hero_brand_1790712572770.jpg"
            alt="FLOREA Botanical Tea Ritual"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Katalog Estetik & Experiential Lab Gen Z</span>
          </div>

          <h1 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Sensasi Seduhan Alami yang Cantik & Sehat
          </h1>

          <p className="text-sm sm:text-base text-stone-300 mt-3 font-light leading-relaxed">
            FLOREA menghadirkan botanical infusion bunga telang dan kelopak rosella lokal dalam kemasan single-serve praktis untuk gaya hidup sehat tanpa ribet.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveTab('pos')}
              className="py-2.5 px-5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Buka Menu Kasir POS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>@florea.botanical</span>
            </a>
          </div>
        </div>
      </div>

      {/* The Magic Color-Changing Lemon Lab Experiment */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
            <Droplet className="w-4 h-4 text-purple-700" />
            <span>Demonstrasi Experiential Marketing Bazaar</span>
          </div>
          <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
            Laboratorium Visual: Keajaiban Perubahan Warna Bunga Telang
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Uji coba interaktif reaksi antosianin bunga telang (Clitoria ternatea) saat berinteraksi dengan ion asam lemon segar. Geser slider untuk melihat transformasinya secara langsung!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Glass Cup Simulation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-stone-50 rounded-2xl border border-stone-200">
            
            {/* Chilled Glass Silhouette */}
            <div className="relative w-44 h-64 rounded-b-3xl rounded-t-lg border-4 border-white/80 shadow-2xl p-2 bg-white/40 backdrop-blur-sm flex flex-col justify-end overflow-hidden">
              
              {/* Condensation droplets on glass */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-white/20" />

              {/* Liquid Body */}
              <div 
                className="w-full h-52 rounded-b-2xl transition-colors duration-700 relative shadow-inner"
                style={{
                  backgroundColor: currentTeaState.bgColor,
                  boxShadow: `0 8px 20px ${currentTeaState.glow}`
                }}
              >
                {/* Floating Ice Cubes */}
                <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-white/40 backdrop-blur-xs border border-white/60 transform rotate-12 animate-pulse" />
                <div className="absolute top-8 right-5 w-8 h-8 rounded-lg bg-white/30 backdrop-blur-xs border border-white/50 transform -rotate-6 animate-pulse" />

                {/* Lemon slice floating */}
                {lemonAcidity > 20 && (
                  <div className="absolute top-12 left-10 w-11 h-11 rounded-full bg-yellow-300/80 border-2 border-yellow-200 flex items-center justify-center shadow-xs transform rotate-45 transition-opacity duration-500">
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  </div>
                )}

                {/* Botanical Blossom Floating */}
                <div className="absolute bottom-6 right-6 text-xl opacity-70">
                  🪻
                </div>
              </div>
            </div>

            {/* Current State Info */}
            <div className="mt-5 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                pH Seduhan: <span className="text-purple-900 font-mono-num">{currentTeaState.ph}</span>
              </span>
              <h3 className="font-serif-brand font-bold text-base text-stone-900">
                {currentTeaState.stateName}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm">
                {currentTeaState.desc}
              </p>
            </div>
          </div>

          {/* Interactive Controls & Educational Facts */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Slider Control */}
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-purple-800" />
                  <span>Kadar Perasan Lemon Segar</span>
                </label>
                <span className="text-xs font-bold font-mono-num text-purple-900">
                  {lemonAcidity}% (Citric Acid)
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={lemonAcidity}
                onChange={e => setLemonAcidity(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-900"
              />

              <div className="flex justify-between text-[11px] text-stone-500 font-medium">
                <span>0% (Biru Telang Asli)</span>
                <span>50% (Ungu Royal)</span>
                <span>100% (Pink Rosella Blend)</span>
              </div>
            </div>

            {/* Scientific & Wellness Benefits for Gen Z */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Mengapa Gen Z Menyukai FLOREA?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Zero Guilt & Bebas Gula</h5>
                    <p className="text-[11px] text-stone-500">
                      100% botani murni tanpa sirup gula buatan penyebab diabetes usia muda.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Anti-Stress & Glow Booster</h5>
                    <p className="text-[11px] text-stone-500">
                      Tinggi antosianin & Vitamin C untuk stamina kuliah dan kesehatan kulit.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Ramah Lingkungan (Eco)</h5>
                    <p className="text-[11px] text-stone-500">
                      Cornfiber pyramid tea bag terurai alami + kemasan paper box daur ulang.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Dukungan Petani Lokal</h5>
                    <p className="text-[11px] text-stone-500">
                      Kemitraan penyerapan bahan baku herbal dari petani Sukoharjo & Karanganyar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Order via WhatsApp Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Halo Admin FLOREA! ✨\nSaya tertarik pesan seduhan botanical:\n- 1x Magic Butterfly Pea Lemonade (pH Ungu Magis)\n- 1x Roselle Brew Tea Bag Pouch\nMohon info ketersediaan stok & pengiriman ya!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Pesan Cepat via WhatsApp Official FLOREA</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Featured Botanical Catalog Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-brand font-bold text-xl text-stone-900">
              Katalog Produk Resmi FLOREA
            </h3>
            <p className="text-xs text-stone-500">
              Dua format praktis: Kemasan Tea Bag (Online) dan Minuman Segar Siap Saji RTD (Bazaar)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pos')}
            className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-1"
          >
            <span>Beli di Kasir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {product.unit}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    {product.flowerType.replace('_', ' ')}
                  </div>
                  <h4 className="font-serif-brand font-bold text-base text-stone-900 mt-0.5">
                    {product.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.benefits.map((b, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-50 text-purple-900 px-2 py-0.5 rounded font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">Harga</span>
                  <span className="text-base font-bold font-mono-num text-purple-950">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    setActiveTab('pos');
                  }}
                  className="py-2 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
