import React, { useState, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatDateTime } from '../../utils/formatters';
import { 
  ShieldCheck, 
  Cloud, 
  CloudCheck, 
  Download, 
  Upload, 
  Key, 
  Users, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  HardDrive
} from 'lucide-react';

export const SecurityBackupView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    isOwnerAdmin,
    backups,
    lastBackupTime,
    isCloudSynced,
    triggerManualBackup,
    restoreFromBackup,
    exportDatabaseJSON,
    resetToDemoData,
    products,
    rawMaterials,
    transactions,
    members
  } = usePOS();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [selectedPinUser, setSelectedPinUser] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinStatusMsg, setPinStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      triggerManualBackup();
      setIsBackingUp(false);
    }, 800);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FLOREA_Cloud_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        restoreFromBackup(parsed);
      } catch {
        alert('File JSON tidak valid atau korup!');
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPinUser) return;
    const ok = switchUser(selectedPinUser, enteredPin);
    if (ok) {
      setPinStatusMsg({ type: 'success', text: 'Otentikasi berhasil! Berpindah pengguna.' });
      setEnteredPin('');
      setSelectedPinUser(null);
    } else {
      setPinStatusMsg({ type: 'error', text: 'PIN salah! Silakan coba lagi.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-serif-brand text-2xl font-bold text-stone-900">
            Keamanan Tingkat Tinggi & Cadangan Cloud Otomatis
          </h1>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            End-to-End Secure
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Perlindungan data transaksi, otentikasi multi-user dengan enkripsi PIN, dan sistem sinkronisasi cloud real-time.
        </p>
      </div>

      {/* Cloud Health Status Banner */}
      <div className="p-5 rounded-2xl bg-stone-900 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
            <CloudCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                Cloud Backup Engine: Aktif & Terlindungi
              </h3>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                SHA-256 Verified
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Sinkronisasi terakhir: <span className="font-semibold text-white">{lastBackupTime}</span> · Enkripsi snapshot otomatis setiap perubahan data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Menyinkronkan...' : 'Snapshot Cloud Sekarang'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex-1 md:flex-none py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center justify-center gap-1.5"
            title="Download file backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Multi-User & Access Control (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-900" />
              <h3 className="font-serif-brand font-bold text-base text-stone-900">
                Manajemen Akses Multi-User & Tim Pengusul
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {allUsers.length} Akun Terdaftar
            </span>
          </div>

          {/* User List */}
          <div className="space-y-2.5">
            {allUsers.map(user => {
              const isCurrent = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between ${
                    isCurrent
                      ? 'border-purple-800 bg-purple-50/60'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${user.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-stone-900">{user.name}</p>
                        {isCurrent && (
                          <span className="text-[10px] bg-purple-900 text-white font-semibold px-1.5 py-0.2 rounded">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500">{user.division} {user.nim ? `· NIM: ${user.nim}` : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      user.role === 'owner_admin' ? 'bg-indigo-100 text-indigo-900' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {user.role === 'owner_admin' ? 'Owner / Admin' : 'Kasir'}
                    </span>

                    {!isCurrent && (
                      <button
                        onClick={() => {
                          setSelectedPinUser(user.id);
                          setEnteredPin('');
                          setPinStatusMsg(null);
                        }}
                        className="py-1 px-2.5 text-xs font-semibold text-purple-900 bg-white border border-purple-200 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        Beralih
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick PIN Auth Form if user selected */}
          {selectedPinUser && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Konfirmasi PIN untuk: {allUsers.find(u => u.id === selectedPinUser)?.name}
                </span>
                <button
                  onClick={() => setSelectedPinUser(null)}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handlePinSubmit} className="flex gap-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Ketik 4-digit PIN..."
                  autoFocus
                  value={enteredPin}
                  onChange={e => setEnteredPin(e.target.value)}
                  className="flex-1 py-1.5 px-3 text-xs font-mono border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Masuk
                </button>
              </form>

              {pinStatusMsg && (
                <p className={`text-xs ${pinStatusMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {pinStatusMsg.text}
                </p>
              )}
            </div>
          )}

          {/* Role Permissions Matrix */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Matriks Hak Akses & Keamanan Sistem (RBAC)
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden text-[11px]">
              <div className="grid grid-cols-3 bg-stone-50 p-2 font-semibold text-stone-600 border-b border-stone-200">
                <span>Fitur / Modul</span>
                <span className="text-center">Kasir Bertugas</span>
                <span className="text-center">Owner / Admin</span>
              </div>
              <div className="divide-y divide-stone-100 text-stone-700">
                <div className="grid grid-cols-3 p-2">
                  <span>Kasir POS & Transaksi</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Akses Penuh</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Akses Penuh</span>
                </div>
                <div className="grid grid-cols-3 p-2 bg-stone-50/40">
                  <span>Cetak Struk Thermal Kasir</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Ya</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Ya</span>
                </div>
                <div className="grid grid-cols-3 p-2">
                  <span>Laporan Laba Rugi & HPP</span>
                  <span className="text-center text-stone-400">Terbatas</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Akses Lengkap</span>
                </div>
                <div className="grid grid-cols-3 p-2 bg-stone-50/40">
                  <span>Stock Opname & Restock Pemasok</span>
                  <span className="text-center text-stone-400">View Saja</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Ubah Data</span>
                </div>
                <div className="grid grid-cols-3 p-2">
                  <span>Cadangan Cloud & Pemulihan</span>
                  <span className="text-center text-stone-400">Otomatis</span>
                  <span className="text-center text-emerald-600 font-bold">✓ Manual & Restore</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Disaster Recovery & Snapshots (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Snapshot History Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-900" />
                <h3 className="font-serif-brand font-bold text-base text-stone-900">
                  Riwayat Snapshot Cadangan
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono-num">
                {backups.length} Arsip
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backups.map((b, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 font-mono">
                      {b.backupId}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                      Cloud Synced
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>{formatDateTime(b.timestamp)}</span>
                    <span className="font-mono-num">{b.sizeKb} KB</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono truncate">
                    Checksum: {b.checksum}
                  </div>
                </div>
              ))}
            </div>

            {/* Restore Database Trigger */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>Pulihkan Database dari File Cadangan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mereset data ke default awal proposal PKM FLOREA?')) {
                    resetToDemoData();
                  }
                }}
                className="w-full py-1.5 text-stone-400 hover:text-stone-600 text-[11px] font-medium transition-colors text-center"
              >
                Reset ke Data Default Awal
              </button>
            </div>
          </div>

          {/* Database Summary Box */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs space-y-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Ringkasan Data Tersimpan:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-stone-600">
              <div>• {products.length} SKU Produk</div>
              <div>• {rawMaterials.length} Bahan Baku Botani</div>
              <div>• {transactions.length} Transaksi Kasir</div>
              <div>• {members.length} Member Terdaftar</div>
            </div>
            <p className="text-[10px] text-stone-400 pt-1">
              Data tersinkron otomatis ke local secure storage dan snapshot cloud Florea.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
