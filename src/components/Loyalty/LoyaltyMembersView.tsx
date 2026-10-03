import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CustomerMember } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { 
  Award, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Sparkles, 
  Gift, 
  Share2, 
  Check, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export const LoyaltyMembersView: React.FC = () => {
  const { members, addMember, updateMemberPoints } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CustomerMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Point adjustment
  const [adjustPointsValue, setAdjustPointsValue] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>('Bonus event bazaar');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newM = addMember({ name, phone, email: email || undefined });
    setName('');
    setPhone('');
    setEmail('');
    setShowAddModal(false);
    setSelectedMember(newM);
  };

  const handleAdjustPoints = (multiplier: number) => {
    if (!selectedMember) return;
    updateMemberPoints(selectedMember.id, adjustPointsValue * multiplier, adjustReason);
    setSelectedMember(prev => prev ? { ...prev, points: Math.max(0, prev.points + adjustPointsValue * multiplier) } : null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-brand text-2xl font-bold text-stone-900">
              Sistem Loyalitas & Member Komunitas Gen Z
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Florea Circle
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Program retensi pelanggan setia: dapatkan 1 poin per Rp 1.000 belanja, tukar poin dengan diskon & voucher seduhan gratis.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftarkan Member Baru</span>
        </button>
      </div>

      {/* Rewards Catalog Highlight Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Sprout Tier (0 - Rp 75k)</h4>
            <p className="text-[11px] text-stone-500">Welcome bonus 50 pts · Diskon 5% ulang tahun</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Bloom Tier (Rp 75k - Rp 200k)</h4>
            <p className="text-[11px] text-stone-500">Free topping tiap pesan RTD · Akses varian blend eksklusif</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Flora VIP Tier (&gt; Rp 200k)</h4>
            <p className="text-[11px] text-stone-500">Poin 1.5x lebih cepat · Free cup bulanan & diskon merchandise</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Member Directory + Selected Member Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Members Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari member berdasarkan nama atau No. WhatsApp..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-700 bg-stone-50/50"
              />
            </div>
            <span className="text-xs text-stone-400 shrink-0 font-medium">
              {filteredMembers.length} Pelanggan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-3">Kontak WhatsApp</th>
                  <th className="py-3 px-3">Tier Komunitas</th>
                  <th className="py-3 px-3 text-right">Saldo Poin</th>
                  <th className="py-3 px-3 text-right">Total Belanja</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMembers.map(member => (
                  <tr 
                    key={member.id} 
                    onClick={() => setSelectedMember(member)}
                    className={`hover:bg-purple-50/40 cursor-pointer transition-colors ${
                      selectedMember?.id === member.id ? 'bg-purple-50/70 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{member.name}</p>
                      <p className="text-[10px] text-stone-400">Bergabung: {member.joinedDate}</p>
                    </td>

                    <td className="py-3 px-3 font-mono text-stone-600">
                      {member.phone}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.tier === 'Flora VIP'
                          ? 'bg-amber-100 text-amber-800'
                          : member.tier === 'Bloom'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {member.tier}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono-num font-bold text-purple-950">
                      {member.points} pts
                    </td>

                    <td className="py-3 px-3 text-right font-mono-num text-stone-700">
                      {formatRupiah(member.totalSpent)}
                      <span className="text-[10px] text-stone-400 block font-normal">
                        {member.totalOrders}x transaksi
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                        className="p-1 text-purple-900 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Member Detail Sidebar (4 Cols) */}
        <div className="lg:col-span-4 sticky top-20">
          {selectedMember ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm">
                    {selectedMember.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif-brand font-bold text-base text-stone-900">
                      {selectedMember.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {selectedMember.phone}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedMember.tier === 'Flora VIP'
                    ? 'bg-amber-100 text-amber-800'
                    : selectedMember.tier === 'Bloom'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {selectedMember.tier}
                </span>
              </div>

              {/* Point Card */}
              <div className="p-4 rounded-xl bg-[#4E3875] text-white shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-purple-200 font-medium">Saldo Poin Florea</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-serif-brand mt-1 font-mono-num text-white">
                  {selectedMember.points} <span className="text-sm font-sans font-normal text-purple-200">pts</span>
                </div>
                <p className="text-[11px] text-purple-200/80 mt-1">
                  Bernilai potongan {formatRupiah(selectedMember.points * 10)} saat checkout kasir.
                </p>
              </div>

              {/* Quick WhatsApp Greeting Generator */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kirim Promo & Saldo via WhatsApp
                </label>
                <a
                  href={`https://wa.me/${selectedMember.phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Halo Kak ${selectedMember.name}! ✨\nKamu saat ini memiliki ${selectedMember.points} Poin di Florea Botanical Infusion.\n\nYuk mampir ke booth kami untuk nikmati Magic Butterfly Pea Lemonade atau varian Roselle Brew segar. Poinmu bisa langsung ditukarkan diskon lho!\n\nStay calm & sip Florea 🪻🌺`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim Notifikasi WA ke Pelanggan</span>
                </a>
              </div>

              {/* Manual Point Adjustment for Cashier */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-xs font-semibold text-stone-700 block">
                  Penyesuaian Poin Manual (Kasir / Event)
                </span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={adjustPointsValue}
                    onChange={e => setAdjustPointsValue(Number(e.target.value))}
                    className="w-20 text-xs py-1.5 px-2 border border-stone-300 rounded-lg text-center font-mono-num"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdjustPoints(1)}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold bg-purple-50 text-purple-900 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                  >
                    + Tambah Poin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustPoints(-1)}
                    className="py-1.5 px-2 text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
                  >
                    - Kurangi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-stone-400">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">Pilih salah satu member di tabel untuk melihat profil dan penukaran poin.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif-brand font-bold text-base text-stone-900">
                Pendaftaran Member Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama customer..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  No. WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Mahasiswa / Pribadi
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-950 text-xs">
                ✨ Member otomatis mendapatkan <strong>50 Poin Selamat Datang</strong> yang langsung bisa digunakan di kasir.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
