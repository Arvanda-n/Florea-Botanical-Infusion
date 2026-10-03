import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod, Transaction } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  QrCode, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  Share2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicCartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    discountVoucher,
    applyVoucher,
    removeVoucher,
    processCustomerOrder
  } = usePOS();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [notes, setNotes] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  const [confirmedTx, setConfirmedTx] = useState<Transaction | null>(null);

  if (!isCartOpen) return null;

  const discountAmount = discountVoucher ? discountVoucher.amount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Silakan isi nama dan nomor WhatsApp Anda!');
      return;
    }
    if (deliveryMethod === 'delivery' && !deliveryAddress) {
      alert('Silakan masukkan alamat pengiriman!');
      return;
    }

    const tx = processCustomerOrder({
      customerName,
      customerPhone,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      paymentMethod,
      notes: notes || undefined,
    });

    setConfirmedTx(tx);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setConfirmedTx(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#4E3875]" />
            <h3 className="font-serif-brand font-bold text-base text-stone-900">
              {confirmedTx ? 'Pesanan Terkonfirmasi ✨' : 'Keranjang Belanja Florea'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {!confirmedTx ? (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
                  <span>Daftar Menu ({cart.reduce((s, i) => s + i.quantity, 0)} Item)</span>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-stone-400 hover:text-rose-600 transition-colors lowercase"
                    >
                      kosongkan
                    </button>
                  )}
                </div>

                {cart.length > 0 ? (
                  cart.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-stone-200 bg-[#FAF7F2]/60 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900 leading-tight">
                            {item.product.name}
                          </p>
                          {(item.selectedIce || item.selectedSugar || item.selectedPackage || (item.selectedToppings && item.selectedToppings.length > 0)) && (
                            <p className="text-[11px] text-stone-500 italic mt-0.5">
                              {[
                                item.selectedPackage,
                                item.selectedIce,
                                item.selectedSugar,
                                item.selectedToppings?.map(t => t.name).join(', ')
                              ].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-stone-900 font-mono-num shrink-0">
                          {formatRupiah(item.lineTotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
                        <span className="text-[11px] text-stone-400 font-mono-num">
                          @ {formatRupiah(item.unitPrice)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono-num w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100"
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
                  <div className="text-center py-10 text-stone-400 space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs font-medium">Keranjang belanja Anda masih kosong</p>
                    <p className="text-[11px]">Silakan pilih teh telang atau rosella di menu belanja kami.</p>
                  </div>
                )}
              </div>

              {/* Order Form when cart has items */}
              {cart.length > 0 && (
                <form onSubmit={handleSubmitOrder} id="public-checkout-form" className="space-y-4 pt-3 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Informasi Pembeli
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Pemesan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap Anda..."
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789..."
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                    />
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Poin reward otomatis masuk ke nomor ini!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Metode Pengambilan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                          deliveryMethod === 'pickup'
                            ? 'border-[#4E3875] bg-[#F2EEF8] text-[#4E3875]'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        Ambil di Booth Bazaar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                          deliveryMethod === 'delivery'
                            ? 'border-[#4E3875] bg-[#F2EEF8] text-[#4E3875]'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        Antar Kampus / Kurir
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Alamat Pengantaran / Lokasi Kampus *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Gedung, lantai, atau alamat rumah..."
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                          paymentMethod === 'qris'
                            ? 'border-[#4E3875] bg-[#F2EEF8] text-[#4E3875] font-bold'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4 mx-auto mb-1 text-[#4E3875]" />
                        <span>QRIS Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('gopay')}
                        className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                          paymentMethod === 'gopay'
                            ? 'border-[#4E3875] bg-[#F2EEF8] text-[#4E3875] font-bold'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Wallet className="w-4 h-4 mx-auto mb-1 text-[#2E6F40]" />
                        <span>E-Wallet</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                          paymentMethod === 'cash'
                            ? 'border-[#4E3875] bg-[#F2EEF8] text-[#4E3875] font-bold'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4 mx-auto mb-1 text-[#9B3354]" />
                        <span>Bayar Tunai</span>
                      </button>
                    </div>
                  </div>

                  {/* Voucher */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kode Voucher Promo (Opsional)
                    </label>
                    {discountVoucher ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="font-semibold text-emerald-900">
                          {discountVoucher.code} (-{formatRupiah(discountVoucher.amount)})
                        </span>
                        <button
                          type="button"
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
                          placeholder="BOTANICALCHILL"
                          value={voucherCode}
                          onChange={e => setVoucherCode(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-3 uppercase font-mono border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4E3875]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (applyVoucher(voucherCode)) setVoucherCode('');
                          }}
                          className="py-1.5 px-3 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg"
                        >
                          Gunakan
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </>
          ) : (
            /* Post Order Success */
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif-brand font-bold text-lg text-stone-900">
                  Pesanan Berhasil Dicatat!
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  ID Pesanan: <strong className="font-mono text-stone-800">{confirmedTx.orderNumber}</strong>
                </p>
                <p className="text-xs text-stone-600 mt-2">
                  Total Tagihan: <strong className="text-base text-[#4E3875] font-mono-num">{formatRupiah(confirmedTx.total)}</strong>
                </p>
              </div>

              {/* QRIS Scan if chosen */}
              {confirmedTx.paymentMethod === 'qris' && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 inline-block text-center max-w-xs mx-auto">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Scan QRIS Dinamis Florea
                  </p>
                  <div className="w-36 h-36 bg-stone-900 text-white p-2 rounded-lg mx-auto flex items-center justify-center relative">
                    <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" fill="white" />
                      <rect x="5" y="5" width="20" height="20" fill="black" />
                      <rect x="70" y="0" width="30" height="30" fill="white" />
                      <rect x="75" y="5" width="20" height="20" fill="black" />
                      <rect x="0" y="70" width="30" height="30" fill="white" />
                      <rect x="5" y="75" width="20" height="20" fill="black" />
                      <circle cx="50" cy="50" r="10" fill="white" />
                      <rect x="35" y="15" width="10" height="10" fill="white" />
                      <rect x="75" y="45" width="10" height="10" fill="white" />
                      <rect x="45" y="75" width="10" height="10" fill="white" />
                    </svg>
                    <span className="absolute bg-[#4E3875] text-white text-[9px] font-bold px-1 rounded">
                      FLOREA
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2">
                    Gunakan aplikasi BCA, Mandiri, GoPay, ShopeePay, atau DANA.
                  </p>
                </div>
              )}

              {/* WhatsApp direct order forward */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*PESANAN ONLINE FLOREA*\nNo: ${confirmedTx.orderNumber}\nNama: ${confirmedTx.customerName}\nTotal: ${formatRupiah(
                      confirmedTx.total
                    )}\nMetode: ${confirmedTx.paymentMethod.toUpperCase()}\nStatus: Siap diproses`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#255C35] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Konfirmasi ke WhatsApp Official</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Button */}
        {!confirmedTx && cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-[#FAF7F2] space-y-2">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono-num">{formatRupiah(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Diskon:</span>
                <span className="font-mono-num">-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-1 border-t border-dashed border-stone-300">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Total Belanja:
              </span>
              <span className="text-lg font-bold font-serif-brand text-[#4E3875] font-mono-num">
                {formatRupiah(finalTotal)}
              </span>
            </div>

            <button
              type="submit"
              form="public-checkout-form"
              className="w-full py-3 px-4 rounded-xl bg-[#4E3875] hover:bg-[#3C2A5C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Kirim Pesanan ({formatRupiah(finalTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
