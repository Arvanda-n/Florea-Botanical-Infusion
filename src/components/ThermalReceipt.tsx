import React from 'react';
import { Transaction } from '../types';
import { usePOS } from '../context/POSContext';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { Printer, Download, X } from 'lucide-react';

interface ThermalReceiptProps {
  transaction: Transaction;
  onClose?: () => void;
  isModal?: boolean;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  transaction,
  onClose,
  isModal = false,
}) => {
  const { printerSettings } = usePOS();

  const handlePrint = () => {
    window.print();
  };

  const receiptWidthClass = printerSettings.paperWidth === '58mm' ? 'max-w-[320px]' : 'max-w-[400px]';

  return (
    <div className={isModal ? 'relative bg-white rounded-xl shadow-2xl p-6 border border-stone-200' : ''}>
      {isModal && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 no-print">
          <div className="flex items-center gap-2 text-stone-800">
            <Printer className="w-4 h-4 text-purple-800" />
            <span className="text-xs font-semibold">Preview Struk Kasir Thermal ({printerSettings.paperWidth})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* The Printable Area (Styled as authentic paper receipt) */}
      <div 
        id="thermal-receipt-area" 
        className={`mx-auto bg-white text-black p-4 font-mono text-xs leading-tight tracking-tight border border-dashed border-stone-300 shadow-xs ${receiptWidthClass}`}
        style={{ fontFamily: '"Courier New", Courier, monospace' }}
      >
        {/* Header */}
        <div className="text-center pb-2">
          <div className="font-bold text-sm tracking-widest uppercase">
            {printerSettings.storeName}
          </div>
          <div className="text-[10px] tracking-wide text-stone-600">
            {printerSettings.storeSubheader}
          </div>
          <div className="text-[9px] text-stone-500 mt-0.5">
            {printerSettings.storeAddress}
          </div>
          <div className="text-[9px] text-stone-500">
            IG / TikTok: {printerSettings.instagramTag}
          </div>
        </div>

        <div className="border-t border-dashed border-black my-1.5" />

        {/* Transaction Meta */}
        <div className="text-[10px] space-y-0.5">
          <div className="flex justify-between">
            <span>No:</span>
            <span className="font-bold">{transaction.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Waktu:</span>
            <span>{formatDateTime(transaction.timestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{transaction.cashierName}</span>
          </div>
          {transaction.customerName && (
            <div className="flex justify-between">
              <span>Member:</span>
              <span className="font-bold">{transaction.customerName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Saluran:</span>
            <span className="uppercase">{transaction.channel.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-1.5" />

        {/* Itemized list */}
        <div className="space-y-1.5 my-2">
          {transaction.items.map((item, idx) => (
            <div key={idx} className="text-[10px]">
              <div className="flex justify-between font-semibold">
                <span className="truncate pr-1">{item.product.name}</span>
                <span className="shrink-0">{formatRupiah(item.lineTotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[9px]">
                <span>
                  {item.quantity}x @ {formatRupiah(item.unitPrice)}
                </span>
                {item.selectedPackage && <span>({item.selectedPackage})</span>}
              </div>
              {/* Customizations */}
              {(item.selectedIce || item.selectedSugar || (item.selectedToppings && item.selectedToppings.length > 0)) && (
                <div className="text-[8.5px] text-stone-500 pl-1 italic">
                  {[
                    item.selectedIce,
                    item.selectedSugar,
                    item.selectedToppings?.map(t => t.name).join(', ')
                  ].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-1.5" />

        {/* Financial Summary */}
        <div className="text-[10px] space-y-0.5">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatRupiah(transaction.subtotal)}</span>
          </div>

          {transaction.discount > 0 && (
            <div className="flex justify-between text-stone-700">
              <span>Diskon Promo:</span>
              <span>-{formatRupiah(transaction.discount)}</span>
            </div>
          )}

          {transaction.pointsDiscount > 0 && (
            <div className="flex justify-between text-stone-700">
              <span>Tukar Poin ({transaction.pointsUsed} pts):</span>
              <span>-{formatRupiah(transaction.pointsDiscount)}</span>
            </div>
          )}

          <div className="border-t border-dotted border-black my-1" />

          <div className="flex justify-between font-bold text-xs">
            <span>TOTAL:</span>
            <span>{formatRupiah(transaction.total)}</span>
          </div>

          <div className="flex justify-between pt-0.5">
            <span>Pembayaran:</span>
            <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
          </div>

          {transaction.paymentMethod === 'cash' && transaction.cashReceived && (
            <>
              <div className="flex justify-between">
                <span>Tunai Diterima:</span>
                <span>{formatRupiah(transaction.cashReceived)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Kembalian:</span>
                <span>{formatRupiah(transaction.cashChange || 0)}</span>
              </div>
            </>
          )}

          {transaction.pointsEarned > 0 && (
            <div className="flex justify-between text-purple-900 pt-0.5 font-bold">
              <span>Poin Didapat:</span>
              <span>+{transaction.pointsEarned} Poin</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Footer */}
        <div className="text-center text-[9px] space-y-1">
          <p className="font-semibold">{printerSettings.footerNote}</p>
          <p className="text-stone-500">
            100% Bahan Alami Tanpa Gula & Pengawet
          </p>
          <div className="pt-1 text-[8px] text-stone-400">
            === SIMPAN STRUK INI ===
          </div>
          {/* Barcode visual representation */}
          <div className="pt-1 flex flex-col items-center">
            <div className="h-6 w-36 bg-repeating-linear-stripes flex items-center justify-center border-y border-stone-800">
              <span className="bg-white px-1 text-[8px] font-mono tracking-widest">
                *{transaction.orderNumber}*
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
