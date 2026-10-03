import React from 'react';
import { MapPin, Clock, Calendar, Phone, Share2, Coffee, Store } from 'lucide-react';

export const PublicLocations: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
          Lokasi & Titik Distribusi
        </span>
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-stone-900">
          Temukan FLOREA di Sekitarmu
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Kunjungi booth interaktif kami saat event kampus atau dapatkan seduhan telang dan rosella di kafe rekanan Solo Raya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Location 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E3875] flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3875]">
              Booth Utama PKM-K
            </span>
            <h3 className="font-serif-brand font-bold text-lg text-stone-900 mt-0.5">
              Bazaar Kampus UDB Surakarta
            </h3>
            <p className="text-xs text-stone-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>Kawasan Universitas Duta Bangsa, Jl. Bhayangkara No. 55, Surakarta, Jawa Tengah</span>
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Senin - Jumat: 09.00 - 16.30 WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-stone-400" />
              <span>Menyediakan varian Ready-to-Drink dingin & Tea Bag Pack</span>
            </div>
          </div>
        </div>

        {/* Location 2 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#9B3354] flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B3354]">
              Mitra Kafe Rekanan
            </span>
            <h3 className="font-serif-brand font-bold text-lg text-stone-900 mt-0.5">
              Botanical Coffee & Coworking Space
            </h3>
            <p className="text-xs text-stone-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>Area Manahan & Kartasura, Sukoharjo</span>
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Setiap Hari: 10.00 - 22.00 WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-stone-400" />
              <span>Signature Sunset Botanical Blend & Tea Bags</span>
            </div>
          </div>
        </div>

        {/* Location 3 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#2E6F40] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E6F40]">
              Pemesanan Daring & Kurir
            </span>
            <h3 className="font-serif-brand font-bold text-lg text-stone-900 mt-0.5">
              Pengiriman Seluruh Indonesia
            </h3>
            <p className="text-xs text-stone-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>Online via Tokopedia, Shopee, TikTok Shop & Website</span>
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>CS Online 24 Jam (Pengiriman Reguler & Same Day)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>WhatsApp Official: 0821-3350-6723</span>
            </div>
          </div>
        </div>

      </div>

      {/* Partnership Call to Action */}
      <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#E7E3DC] text-center max-w-3xl mx-auto space-y-3">
        <h3 className="font-serif-brand font-bold text-2xl text-stone-900">
          Ingin Menghadirkan FLOREA di Kafe atau Acara Kampusmu?
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-light">
          Kami membuka peluang kemitraan konsinyasi dan pengadaan paket seduhan teh telang & rosella untuk event, seminar, serta kafe.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/?text=Halo%20Admin%20FLOREA,%20saya%20tertarik%20mengajukan%20kemitraan%20penjualan%20produk%20botanical%20infusion."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#4E3875] text-white text-xs font-bold hover:bg-[#3C2A5C] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Hubungi Tim Kemitraan FLOREA</span>
          </a>
        </div>
      </div>

    </div>
  );
};
