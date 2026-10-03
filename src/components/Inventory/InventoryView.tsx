import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, RawMaterial } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { 
  Package, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ArrowUpDown, 
  History, 
  Search, 
  Sliders, 
  TrendingDown,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    rawMaterials,
    stockMovements,
    updateProductStock,
    updateRawMaterialStock,
    lowStockProducts,
    lowStockMaterials,
    currentUser,
    isOwnerAdmin
  } = usePOS();

  const [activeSubTab, setActiveSubTab] = useState<'finished_goods' | 'raw_materials' | 'movements'>('finished_goods');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low_only'>('all');

  // Restock Modals
  const [selectedProductForOpname, setSelectedProductForOpname] = useState<Product | null>(null);
  const [newOpnameStock, setNewOpnameStock] = useState<number>(0);
  const [opnameReason, setOpnameReason] = useState<string>('Stock opname berkala');

  const [selectedMaterialForRestock, setSelectedMaterialForRestock] = useState<RawMaterial | null>(null);
  const [addedMaterialStock, setAddedMaterialStock] = useState<number>(100);
  const [restockNotes, setRestockNotes] = useState<string>('Pengadaan pasokan mitra tani');

  const totalLowStock = lowStockProducts.length + lowStockMaterials.length;

  const handleOpenOpname = (prod: Product) => {
    setSelectedProductForOpname(prod);
    setNewOpnameStock(prod.stock);
    setOpnameReason('Stock opname fisik harian');
  };

  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForOpname) return;
    updateProductStock(selectedProductForOpname.id, Number(newOpnameStock), opnameReason);
    setSelectedProductForOpname(null);
  };

  const handleOpenRestock = (mat: RawMaterial) => {
    setSelectedMaterialForRestock(mat);
    setAddedMaterialStock(mat.category === 'botanical' ? 500 : 50);
    setRestockNotes(`Pasokan baru dari ${mat.supplier}`);
  };

  const handleSaveRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialForRestock) return;
    updateRawMaterialStock(selectedMaterialForRestock.id, Number(addedMaterialStock), restockNotes);
    setSelectedMaterialForRestock(null);
  };

  // Filtered Finished Goods
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const isLow = p.stock <= p.minStockAlert;
    if (filterStatus === 'low_only') return matchesSearch && isLow;
    return matchesSearch;
  });

  // Filtered Raw Materials
  const filteredMaterials = rawMaterials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const isLow = m.currentStock <= m.minThreshold;
    if (filterStatus === 'low_only') return matchesSearch && isLow;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-brand text-2xl font-bold text-stone-900">
              Manajemen Inventaris & Pasokan Botani
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Real-Time Sync
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pantau stok barang jadi, bahan baku bunga telang & rosella, serta sistem peringatan dini otomatis.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-white rounded-xl border border-stone-200 shadow-xs text-right">
            <span className="text-[10px] uppercase font-semibold text-stone-400 block">Total SKU Produk</span>
            <span className="text-base font-bold font-mono-num text-stone-900">{products.length} Item</span>
          </div>
          <div className={`px-3 py-2 rounded-xl border shadow-xs text-right ${
            totalLowStock > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200'
          }`}>
            <span className="text-[10px] uppercase font-semibold text-amber-800 block">Perlu Restock</span>
            <span className="text-base font-bold font-mono-num text-amber-900">{totalLowStock} Komponen</span>
          </div>
        </div>
      </div>

      {/* Real-Time Low Stock Alert Notice Banner */}
      {totalLowStock > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Perhatian: Terdapat {totalLowStock} Item Mendekati Batas Minimum!
              </h3>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Segera hubungi kelompok mitra tani di Sukoharjo & Karanganyar atau lakukan restock kemasan untuk mencegah gangguan penjualan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus(filterStatus === 'low_only' ? 'all' : 'low_only')}
            className="py-1.5 px-3 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            {filterStatus === 'low_only' ? 'Tampilkan Semua Stok' : 'Filter Yang Menipis Saja'}
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('finished_goods')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'finished_goods'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produk Siap Jual ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('raw_materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'raw_materials'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bahan Baku & Kemasan ({rawMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('movements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'movements'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Log Mutasi ({stockMovements.length})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari SKU atau nama..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 1. Finished Goods View */}
      {activeSubTab === 'finished_goods' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Produk & Varian</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-right">Harga Jual</th>
                  <th className="py-3 px-3 text-right">HPP</th>
                  <th className="py-3 px-3 text-right">Stok Fisik</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map(product => {
                  const isOutOfStock = product.stock <= 0;
                  const isLow = product.stock <= product.minStockAlert && !isOutOfStock;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-stone-900 leading-tight">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {product.subtitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-stone-600">
                        {product.sku}
                      </td>

                      <td className="py-3 px-3 text-stone-600">
                        <span className="capitalize">
                          {product.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono-num font-semibold text-stone-900">
                        {formatRupiah(product.price)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-num text-stone-500">
                        {formatRupiah(product.hpp)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono-num font-bold text-sm ${
                          isOutOfStock ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-stone-900'
                        }`}>
                          {product.stock}
                        </span>
                        <span className="text-[10px] text-stone-400 ml-1">
                          {product.unit.split(' ')[0]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Menipis (Min: {product.minStockAlert})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Aman
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenOpname(product)}
                          className="py-1 px-2.5 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                        >
                          Sesuaikan Stok
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Raw Materials View */}
      {activeSubTab === 'raw_materials' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 text-xs font-medium">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span>
                Pengurangan bahan baku otomatis terpaut dengan pesanan kasir POS (Bill of Materials).
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Nama Bahan Baku / Kemasan</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Mitra Pemasok</th>
                  <th className="py-3 px-3 text-right">Biaya Satuan</th>
                  <th className="py-3 px-3 text-right">Sisa Stok</th>
                  <th className="py-3 px-3 text-center">Batas Minimum</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMaterials.map(mat => {
                  const isLow = mat.currentStock <= mat.minThreshold;

                  return (
                    <tr key={mat.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-stone-900">{mat.name}</p>
                        <p className="text-[10px] text-stone-400">Update terakhir: {mat.lastRestocked}</p>
                      </td>

                      <td className="py-3 px-3 text-stone-600 capitalize">
                        {mat.category}
                      </td>

                      <td className="py-3 px-3 text-stone-700">
                        {mat.supplier}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-num text-stone-600">
                        {formatRupiah(mat.costPerUnit)} / {mat.unit}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono-num font-bold text-sm ${
                          isLow ? 'text-rose-600' : 'text-stone-900'
                        }`}>
                          {mat.currentStock.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-stone-400 ml-1">
                          {mat.unit}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono-num text-stone-500">
                        {mat.minThreshold.toLocaleString('id-ID')} {mat.unit}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Perlu Restock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Stok Aman
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenRestock(mat)}
                          className="py-1 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                        >
                          + Tambah Stok
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Movements History View */}
      {activeSubTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 text-xs">Jejak Audit Keluar/Masuk Barang</h3>
              <p className="text-[11px] text-stone-500">Dicatat otomatis oleh sistem kasir dan admin</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-3">Item</th>
                  <th className="py-3 px-3">Jenis Mutasi</th>
                  <th className="py-3 px-3 text-right">Perubahan Qty</th>
                  <th className="py-3 px-3 text-right">Stok Akhir</th>
                  <th className="py-3 px-3">Keterangan</th>
                  <th className="py-3 px-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stockMovements.length > 0 ? (
                  stockMovements.map(m => (
                    <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-2.5 px-4 text-stone-500 font-mono-num">
                        {formatDateTime(m.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">
                        {m.itemName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          m.type === 'in'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.type === 'out_sales'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.type === 'in' ? 'Stok Masuk' : m.type === 'out_sales' ? 'Kasir Terjual' : 'Penyesuaian'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-num font-bold">
                        {m.type === 'in' ? `+${m.quantity}` : `-${m.quantity}`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-num text-stone-600">
                        {m.newStock}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">
                        {m.notes}
                      </td>
                      <td className="py-2.5 px-4 text-stone-700 font-medium">
                        {m.operator}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-stone-400">
                      Belum ada log mutasi stok yang dicatat. Lakukan transaksi kasir atau update stok untuk melihat jejak audit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Opname Modal for Products */}
      {selectedProductForOpname && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Penyesuaian Stok Produk</h3>
                <p className="text-xs text-stone-500">{selectedProductForOpname.name}</p>
              </div>
              <button 
                onClick={() => setSelectedProductForOpname(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOpname} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Stok Fisik Sebenarnya Saat Ini
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newOpnameStock}
                  onChange={e => setNewOpnameStock(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono-num py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Stok tercatat sebelumnya: {selectedProductForOpname.stock} {selectedProductForOpname.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alasan / Keterangan Penyesuaian
                </label>
                <input
                  type="text"
                  required
                  value={opnameReason}
                  onChange={e => setOpnameReason(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForOpname(null)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal for Raw Materials */}
      {selectedMaterialForRestock && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Penerimaan Bahan Baku Baru</h3>
                <p className="text-xs text-stone-500">{selectedMaterialForRestock.name}</p>
              </div>
              <button 
                onClick={() => setSelectedMaterialForRestock(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Jumlah Tambahan ({selectedMaterialForRestock.unit})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={addedMaterialStock}
                  onChange={e => setAddedMaterialStock(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono-num py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Stok saat ini: {selectedMaterialForRestock.currentStock} {selectedMaterialForRestock.unit} → Menjadi {selectedMaterialForRestock.currentStock + Number(addedMaterialStock)} {selectedMaterialForRestock.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Keterangan Penerimaan / No. Nota Supplier
                </label>
                <input
                  type="text"
                  required
                  value={restockNotes}
                  onChange={e => setRestockNotes(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMaterialForRestock(null)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  Tambah ke Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
