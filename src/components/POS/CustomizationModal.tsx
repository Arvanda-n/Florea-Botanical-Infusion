import React, { useState } from 'react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { X, Check } from 'lucide-react';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (options: {
    ice?: string;
    sugar?: string;
    toppings?: { id: string; name: string; price: number }[];
    package?: string;
    notes?: string;
  }) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const options = product.options;

  const [selectedIce, setSelectedIce] = useState<string>(
    options?.iceLevels ? options.iceLevels[0] : ''
  );
  const [selectedSugar, setSelectedSugar] = useState<string>(
    options?.sugarLevels ? options.sugarLevels[0] : ''
  );
  const [selectedToppings, setSelectedToppings] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [selectedPackage, setSelectedPackage] = useState<string>(
    options?.packageTypes ? options.packageTypes[0] : ''
  );
  const [notes, setNotes] = useState<string>('');

  const toggleTopping = (topping: { id: string; name: string; price: number }) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = product.price + toppingsPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      ice: selectedIce || undefined,
      sugar: selectedSugar || undefined,
      toppings: selectedToppings.length > 0 ? selectedToppings : undefined,
      package: selectedPackage || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <img 
              src={product.image} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-cover rounded-xl border border-stone-200"
            />
            <div>
              <h3 className="font-serif-brand font-bold text-base text-stone-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-stone-500 font-mono-num">
                Basis: {formatRupiah(product.price)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Packaging choice for tea bags */}
          {options?.packageTypes && options.packageTypes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Pilihan Kemasan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {options.packageTypes.map(pkg => (
                  <button
                    key={pkg}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-colors ${
                      selectedPackage === pkg
                        ? 'border-purple-800 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{pkg}</span>
                    {selectedPackage === pkg && <Check className="w-3.5 h-3.5 text-purple-800" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ice Level for RTD */}
          {options?.iceLevels && options.iceLevels.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Level Es (Ice)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {options.iceLevels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedIce(lvl)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-center transition-colors ${
                      selectedIce === lvl
                        ? 'border-purple-800 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar / Sweetener Level */}
          {options?.sugarLevels && options.sugarLevels.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Pemanis Alami / Sugar
              </label>
              <div className="grid grid-cols-2 gap-2">
                {options.sugarLevels.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setSelectedSugar(sug)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-colors ${
                      selectedSugar === sug
                        ? 'border-purple-800 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{sug}</span>
                    {selectedSugar === sug && <Check className="w-3.5 h-3.5 text-purple-800" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings / Add-ons */}
          {options?.toppings && options.toppings.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Topping & Tambahan Sehat (Opsional)
              </label>
              <div className="space-y-1.5">
                {options.toppings.map(t => {
                  const isChecked = selectedToppings.some(item => item.id === t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTopping(t)}
                      className={`w-full py-2 px-3 text-xs rounded-lg border flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-purple-800 bg-purple-50 text-purple-900 font-semibold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-purple-800 border-purple-800 text-white' : 'border-stone-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        {t.name}
                      </span>
                      <span className="font-mono-num text-stone-600">
                        +{formatRupiah(t.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Catatan Khusus Barista
            </label>
            <input
              type="text"
              placeholder="Contoh: lemon dipisah, wadah dingin..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-xs flex items-center justify-between px-4"
            >
              <span>Tambahkan ke Pesanan</span>
              <span className="font-mono-num">{formatRupiah(totalPrice)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
