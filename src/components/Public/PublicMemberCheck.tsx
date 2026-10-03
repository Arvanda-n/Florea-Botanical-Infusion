import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CustomerMember } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Search, Award, Gift, Sparkles, UserPlus, CheckCircle2, Phone } from 'lucide-react';

export const PublicMemberCheck: React.FC = () => {
  const { members, addMember } = usePOS();

  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchedMember, setSearchedMember] = useState<CustomerMember | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // New member form
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneQuery.trim();
    const found = members.find(m => m.phone === clean || m.phone.replace(/\D/g, '') === clean.replace(/\D/g, ''));
    setSearchedMember(found || null);
    setHasSearched(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    const m = addMember({
      name: newName,
      phone: newPhone,
    });
    setSearchedMember(m);
    setShowRegisterForm(false);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3875]">
          Florea Loyalty Circle
        </span>
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-stone-900">
          Cek Saldo Poin & Keuntungan Member
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Setiap pembelian produk FLOREA menghasilkan poin yang bisa kamu tukar dengan potongan harga atau minuman segar gratis!
        </p>
      </div>

      {/* Phone Search Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Masukkan Nomor WhatsApp Kamu
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phoneQuery}
                onChange={e => {
                  setPhoneQuery(e.target.value);
                  setHasSearched(false);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4E3875] bg-[#FAF7F2]/40 font-mono"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Demo phone: <code className="font-mono text-stone-600">081234567890</code> atau <code className="font-mono text-stone-600">085712344321</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#4E3875] hover:bg-[#3C2A5C] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Cek Poin Sekarang
          </button>
        </form>

        {/* Search Result */}
        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-stone-100">
            {searchedMember ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#4E3875] flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-serif-brand font-bold text-lg text-stone-900">
                    Halo, {searchedMember.name}! ✨
                  </h3>
                  <div className="inline-block mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#4E3875] border border-[#E7E3DC]">
                      Tier: {searchedMember.tier} Member
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E3DC] text-center">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">
                    Saldo Poin Kamu
                  </span>
                  <div className="text-3xl font-bold font-serif-brand text-[#4E3875] font-mono-num mt-1">
                    {searchedMember.points} <span className="text-sm font-sans font-normal text-stone-500">pts</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Setara dengan diskon belanja senilai <strong className="text-stone-900">{formatRupiah(searchedMember.points * 10)}</strong>
                  </p>
                </div>

                <div className="text-left text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span>Total Pesanan:</span>
                    <span className="font-semibold text-stone-800">{searchedMember.totalOrders} kali</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Belanja:</span>
                    <span className="font-semibold text-stone-800 font-mono-num">{formatRupiah(searchedMember.totalSpent)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 py-2">
                <p className="text-xs text-stone-600">
                  Nomor <strong>{phoneQuery}</strong> belum terdaftar di FLOREA Loyalty Circle.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewPhone(phoneQuery);
                    setShowRegisterForm(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#255C35] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Sekarang (Dapat 50 Bonus Poin)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Registration Form Modal/Box */}
        {showRegisterForm && (
          <div className="mt-6 pt-6 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Daftar Member Baru
            </h4>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama kamu..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875] font-mono"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#4E3875] rounded-lg hover:bg-[#3C2A5C]"
                >
                  Daftarkan Saya
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Rewards Catalog Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#4E3875] flex items-center justify-center mx-auto">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="font-serif-brand font-bold text-sm text-stone-900">
            Tukar Diskon Rp 5.000
          </h4>
          <p className="text-xs text-stone-500">
            Cukup kumpulkan 50 poin dari pembelian seduhan telang/rosella.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#9B3354] flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-serif-brand font-bold text-sm text-stone-900">
            Free Topping Spesial
          </h4>
          <p className="text-xs text-stone-500">
            Tukarkan 30 poin untuk chia seeds, extra lemon, atau aloe vera jelly.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#2E6F40] flex items-center justify-center mx-auto">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-serif-brand font-bold text-sm text-stone-900">
            Gratis 1 Cup Ready-to-Drink
          </h4>
          <p className="text-xs text-stone-500">
            Kumpulkan 150 poin untuk menikmati segelas Magic Butterfly Pea dingin gratis!
          </p>
        </div>
      </div>

    </div>
  );
};
