import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CustomerMember } from '../../types';
import { Search, UserPlus, Check, Award, Phone, X } from 'lucide-react';

interface MemberSelectModalProps {
  onClose: () => void;
  onSelect: (member: CustomerMember) => void;
}

export const MemberSelectModal: React.FC<MemberSelectModalProps> = ({
  onClose,
  onSelect,
}) => {
  const { members, addMember, activeCustomer } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New member form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newMember = addMember({
      name,
      phone,
      email: email || undefined,
    });
    onSelect(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-800" />
            <h3 className="font-serif-brand font-bold text-base text-stone-900">
              {showAddForm ? 'Daftar Member Florea Baru' : 'Pilih / Cari Member Pelanggan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!showAddForm ? (
            <>
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Ketik nama atau No. WhatsApp (08...)..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              {/* Members list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        onSelect(member);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                        activeCustomer?.id === member.id
                          ? 'border-purple-800 bg-purple-50'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-stone-900">{member.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            member.tier === 'Flora VIP'
                              ? 'bg-amber-100 text-amber-800'
                              : member.tier === 'Bloom'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {member.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-purple-950 font-mono-num">
                          {member.points} pts
                        </span>
                        <p className="text-[10px] text-stone-400">
                          {member.totalOrders} order
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-stone-500 text-xs">
                    Tidak menemukan member dengan kata kunci tersebut.
                  </div>
                )}
              </div>

              {/* Create new member button */}
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-purple-800 text-purple-900 hover:bg-purple-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Daftarkan Member Baru (Dapat 50 Poin)</span>
              </button>
            </>
          ) : (
            /* Registration Form */
            <form onSubmit={handleCreateMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama pembeli..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  No. Telepon / WhatsApp *
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
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-950 text-xs">
                ✨ Member baru otomatis mendapatkan <strong>50 Poin Selamat Datang</strong> yang bisa langsung dipakai untuk diskon!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Simpan & Pilih
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
