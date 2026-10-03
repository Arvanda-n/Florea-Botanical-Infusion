import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod, SalesChannel, Transaction } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ThermalReceipt } from '../ThermalReceipt';
import confetti from 'canvas-confetti';
import { 
  QrCode, 
  Wallet, 
  Banknote, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  RefreshCw,
  Copy,
  Check,
  Share2,
  X
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { 
    cartSubtotal, 
    discountVoucher, 
    pointsToRedeem, 
    processCheckout, 
    activeCustomer,
    printerSettings,
    printThermalReceipt
  } = usePOS();

  const discountAmount = discountVoucher ? discountVoucher.amount : 0;
  const pointsDiscount = pointsToRedeem * 10;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount - pointsDiscount);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [salesChannel, setSalesChannel] = useState<SalesChannel>('bazaar_event');
  const [cashReceived, setCashReceived] = useState<number>(finalTotal);
  const [notes, setNotes] = useState<string>('');

  // QRIS Simulation
  const [qrisStatus, setQrisStatus] = useState<'waiting' | 'verifying' | 'paid'>('waiting');
  
  // Virtual Account Simulation
  const [vaCopied, setVaCopied] = useState<boolean>(false);

  // Completed State
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const cashPresets = [
    finalTotal,
    Math.ceil(finalTotal / 10000) * 10000,
    Math.ceil(finalTotal / 20000) * 20000 || 20000,
    50000,
    100000
  ].filter((val, idx, self) => val >= finalTotal && self.indexOf(val) === idx).slice(0, 4);

  const cashChange = Math.max(0, cashReceived - finalTotal);

  const handleExecutePayment = () => {
    if (paymentMethod === 'cash' && cashReceived < finalTotal) {
      alert('Nominal uang tunai kurang dari total tagihan!');
      return;
    }

    const tx = processCheckout({
      paymentMethod,
      channel: salesChannel,
      cashReceived: paymentMethod === 'cash' ? cashReceived : undefined,
      notes: notes || undefined,
    });

    setCompletedTx(tx);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 }
      });
    } catch {
      // safe fallback
    }

    if (printerSettings.autoPrintReceipt) {
      setTimeout(() => {
        printThermalReceipt(tx);
      }, 500);
    }
  };

  const handleSimulateQrisScan = () => {
    setQrisStatus('verifying');
    setTimeout(() => {
      setQrisStatus('paid');
      handleExecutePayment();
    }, 1200);
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText('8088' + '0857' + Math.floor(1000 + Math.random() * 9000));
    setVaCopied(true);
    setTimeout(() => setVaCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div>
            <h2 className="font-serif-brand font-bold text-lg text-stone-900">
              {completedTx ? 'Pembayaran Berhasil ✨' : 'Checkout & Pembayaran Digital'}
            </h2>
            <p className="text-xs text-stone-500">
              {completedTx 
                ? `Order ID: ${completedTx.orderNumber}`
                : `Total Tagihan: ${formatRupiah(finalTotal)}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {!completedTx ? (
            <div className="space-y-5">
              
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Saluran Penjualan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSalesChannel('bazaar_event')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      salesChannel === 'bazaar_event'
                        ? 'border-purple-800 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Bazaar & Event Kampus
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesChannel('offline_store')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      salesChannel === 'offline_store'
                        ? 'border-purple-800 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Toko Ritel Fisik
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalesChannel('online_order')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      salesChannel === 'online_order'
                        ? 'border-purple-800 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Pesanan Online / WA
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-purple-800 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-700/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-purple-800" />
                    <span className="text-xs">QRIS Dinamis</span>
                    <span className="text-[10px] text-stone-500 font-normal">BCA/GoPay/OVO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gopay')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'gopay'
                        ? 'border-purple-800 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-700/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">GoPay / Shopee</span>
                    <span className="text-[10px] text-stone-500 font-normal">E-Wallet Direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-purple-800 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-700/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">Tunai (Cash)</span>
                    <span className="text-[10px] text-stone-500 font-normal">Kalkulator Kas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bca_va')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'bca_va'
                        ? 'border-purple-800 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-700/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">Transfer VA</span>
                    <span className="text-[10px] text-stone-500 font-normal">BCA / Mandiri</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Payment Views */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                {/* 1. QRIS Interactive view */}
                {paymentMethod === 'qris' && (
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Authentic QR Box */}
                    <div className="bg-white p-3 rounded-xl border border-stone-300 shadow-xs flex flex-col items-center shrink-0">
                      <div className="text-[10px] font-bold tracking-widest text-stone-700 mb-1">
                        QRIS · GPN
                      </div>
                      <div className="w-40 h-40 bg-stone-900 rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                        {/* High fidelity SVG QR pattern */}
                        <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="0" y="0" width="30" height="30" fill="white" />
                          <rect x="5" y="5" width="20" height="20" fill="black" />
                          <rect x="10" y="10" width="10" height="10" fill="white" />

                          <rect x="70" y="0" width="30" height="30" fill="white" />
                          <rect x="75" y="5" width="20" height="20" fill="black" />
                          <rect x="80" y="10" width="10" height="10" fill="white" />

                          <rect x="0" y="70" width="30" height="30" fill="white" />
                          <rect x="5" y="75" width="20" height="20" fill="black" />
                          <rect x="10" y="80" width="10" height="10" fill="white" />

                          <circle cx="50" cy="50" r="12" fill="white" />
                          <circle cx="50" cy="50" r="7" fill="black" />
                          
                          {/* Pattern blocks */}
                          <rect x="35" y="10" width="8" height="8" fill="white" />
                          <rect x="48" y="15" width="8" height="8" fill="white" />
                          <rect x="20" y="45" width="8" height="8" fill="white" />
                          <rect x="75" y="45" width="8" height="8" fill="white" />
                          <rect x="40" y="75" width="8" height="8" fill="white" />
                          <rect x="60" y="80" width="8" height="8" fill="white" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-purple-900 text-white font-serif-brand font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
                            FLOREA
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-1 font-mono-num">
                        NMID: ID102409290001
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-stone-900">QRIS Siap Di-Scan Pelanggan</span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Nominal <span className="font-bold text-purple-900 font-mono-num">{formatRupiah(finalTotal)}</span> sudah tertanam otomatis. Pelanggan tidak perlu mengetik nominal.
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Didukung oleh BCA Mobile, Livin' Mandiri, GoPay, ShopeePay, DANA, OVO, LinkAja.
                      </p>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleSimulateQrisScan}
                          disabled={qrisStatus === 'verifying'}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          {qrisStatus === 'verifying' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Memverifikasi Notifikasi Bank...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Simulasikan Pelanggan Sukses Scan & Bayar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. E-Wallet view */}
                {paymentMethod === 'gopay' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">Direct E-Wallet Pay:</span>
                      <span className="font-bold text-sm text-stone-900 font-mono-num">{formatRupiah(finalTotal)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['GoPay QR', 'ShopeePay Instant', 'DANA ID', 'OVO Direct'].map((walletName, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-800">{walletName}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Ready</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Gunakan fitur integrasi scanner barcode atau push payment ke nomor ponsel pelanggan: <span className="font-semibold">{activeCustomer?.phone || 'Umum'}</span>
                    </p>
                  </div>
                )}

                {/* 3. Cash View */}
                {paymentMethod === 'cash' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-800">
                        Nominal Uang Tunai Diterima:
                      </label>
                      <span className="text-xs text-stone-500 font-mono-num">
                        Tagihan: {formatRupiah(finalTotal)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-semibold">Rp</span>
                        <input
                          type="number"
                          value={cashReceived || ''}
                          onChange={e => setCashReceived(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 text-sm font-bold font-mono-num border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {cashPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCashReceived(preset)}
                          className={`py-1.5 px-2.5 rounded-md text-xs font-semibold transition-colors font-mono-num ${
                            cashReceived === preset
                              ? 'bg-purple-900 text-white'
                              : 'bg-white border border-stone-200 hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          {preset === finalTotal ? 'Uang Pas' : formatRupiah(preset)}
                        </button>
                      ))}
                    </div>

                    {/* Change result */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                          Uang Kembalian Pelanggan:
                        </p>
                        <p className="text-lg font-bold text-emerald-950 font-mono-num">
                          {formatRupiah(cashChange)}
                        </p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                )}

                {/* 4. Bank Transfer VA View */}
                {paymentMethod === 'bca_va' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">Nomor Rekening Virtual Account BCA:</span>
                      <span className="text-[11px] text-stone-500">Auto-check</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white border border-stone-300 rounded-lg font-mono">
                      <div>
                        <span className="text-xs text-stone-400">FLOREA BCA VA</span>
                        <div className="text-base font-bold tracking-wider text-stone-900">
                          8088 0857 2401 0324
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
                      >
                        {vaCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{vaCopied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Instruksikan pembeli untuk transfer via m-BCA atau ATM. Sistem otomatis memverifikasi mutasi.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Catatan Pesanan Khusus (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pisah es batu, kemasan paper box pita hadiah..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-4 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Konfirmasi Pembayaran ({formatRupiah(finalTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Post-Payment Success View */
            <div className="space-y-5 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  Transaksi Selesai & Dicatat Real-Time!
                </h3>
                <p className="text-xs text-stone-500">
                  Stok barang dan bahan baku botani telah otomatis dikurangi di sistem.
                </p>
              </div>

              {/* Quick Thermal Receipt View */}
              <div className="max-h-72 overflow-y-auto border border-stone-200 rounded-xl bg-stone-50 p-2">
                <ThermalReceipt transaction={completedTx} />
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => printThermalReceipt(completedTx)}
                  className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Ulang Struk</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*STRUK FLOREA BOTANICAL*\nNo: ${completedTx.orderNumber}\nTotal: ${formatRupiah(
                      completedTx.total
                    )}\nTerima kasih telah berbelanja teh telang & rosella alami!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-xs"
                >
                  Selesai & Buka Transaksi Baru
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
