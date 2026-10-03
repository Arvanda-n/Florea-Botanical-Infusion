import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Transaction } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { ThermalReceipt } from '../ThermalReceipt';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  ShoppingBag, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Eye, 
  PieChart,
  ArrowUpRight,
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';

export const ReportsAnalyticsView: React.FC = () => {
  const { transactions, products, printThermalReceipt } = usePOS();
  
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | 'month' | 'all'>('all');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<Transaction | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Filter transactions based on date
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    const now = new Date();

    if (selectedChannel !== 'all' && tx.channel !== selectedChannel) {
      return false;
    }

    if (dateFilter === 'today') {
      return txDate.toDateString() === now.toDateString();
    } else if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    } else if (dateFilter === 'month') {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Financial Metrics Calculations
  const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalSubtotal = filteredTransactions.reduce((sum, tx) => sum + tx.subtotal, 0);
  const totalDiscounts = filteredTransactions.reduce((sum, tx) => sum + (tx.discount + tx.pointsDiscount), 0);
  const totalOrders = filteredTransactions.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Calculate COGS / HPP
  let totalHPP = 0;
  let offlineRevenue = 0;
  let onlineRevenue = 0;
  let totalItemsSold = 0;

  // Item counts map
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; hpp: number }> = {};

  filteredTransactions.forEach(tx => {
    if (tx.channel === 'online_order') {
      onlineRevenue += tx.total;
    } else {
      offlineRevenue += tx.total;
    }

    tx.items.forEach(item => {
      const itemHpp = (item.product.hpp || 8000) * item.quantity;
      totalHPP += itemHpp;
      totalItemsSold += item.quantity;

      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          name: item.product.name,
          qty: 0,
          revenue: 0,
          hpp: 0,
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.lineTotal;
      productSalesMap[item.product.id].hpp += itemHpp;
    });
  });

  const grossProfit = totalRevenue - totalHPP;
  const profitMarginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Proposal comparison reference:
  // Target: HPP 8.000-9.000, Jual 15.000 (Telang) / 17.000 (Rosella) -> Margin target ~46%
  const proposalTargetMargin = 46.2;

  // Top products list sorted by quantity
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

  // Payment method breakdown
  const paymentStats: Record<string, { count: number; total: number }> = {};
  filteredTransactions.forEach(tx => {
    const method = tx.paymentMethod;
    if (!paymentStats[method]) {
      paymentStats[method] = { count: 0, total: 0 };
    }
    paymentStats[method].count += 1;
    paymentStats[method].total += tx.total;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Timestamp', 'Cashier', 'Customer', 'Channel', 'Payment', 'Subtotal', 'Discount', 'Total'];
    const rows = filteredTransactions.map(tx => [
      tx.orderNumber,
      tx.timestamp,
      `"${tx.cashierName}"`,
      `"${tx.customerName || 'Umum'}"`,
      tx.channel,
      tx.paymentMethod,
      tx.subtotal,
      tx.discount + tx.pointsDiscount,
      tx.total
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FLOREA_Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-brand text-2xl font-bold text-stone-900">
              Laporan Penjualan & Analitik Keuangan
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Laba Rugi & HPP
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Data analitik performa kasir harian, margin laba kotor, dan evaluasi target kewirausahaan FLOREA.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'today' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === '7days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'month' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Omset */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Total Penjualan (Omset)
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif-brand text-stone-900 font-mono-num">
              {formatRupiah(totalRevenue)}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Dari {totalOrders} transaksi berhasil
            </p>
          </div>
        </div>

        {/* HPP (COGS) */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Total HPP (Beban Pokok)
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif-brand text-stone-900 font-mono-num">
              {formatRupiah(totalHPP)}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Biaya bahan baku telang, rosella & cup
            </p>
          </div>
        </div>

        {/* Laba Kotor & Margin */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Laba Kotor (Gross Profit)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif-brand text-emerald-900 font-mono-num">
              {formatRupiah(grossProfit)}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-mono-num">
                Margin {profitMarginPercent}%
              </span>
              <span className="text-[10px] text-stone-400">
                (Target PKM: {proposalTargetMargin}%)
              </span>
            </div>
          </div>
        </div>

        {/* Rata-Rata Order (AOV) & Item Terjual */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Rata-Rata Keranjang (AOV)
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif-brand text-stone-900 font-mono-num">
              {formatRupiah(averageOrderValue)}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Total {totalItemsSold} porsi/pack terjual
            </p>
          </div>
        </div>

      </div>

      {/* Proposal Target Alignment & Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Channel Breakdown: Offline RTD vs Online Tea Bag */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-semibold text-stone-900 text-sm">
              Distribusi Saluran Penjualan
            </h3>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Offline vs Online</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-stone-700">Offline (Bazaar & Toko):</span>
                <span className="font-bold text-stone-900 font-mono-num">{formatRupiah(offlineRevenue)}</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-800 rounded-full"
                  style={{ width: `${totalRevenue > 0 ? (offlineRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-stone-700">Online Tea Bag (Pemesanan Daring):</span>
                <span className="font-bold text-stone-900 font-mono-num">{formatRupiah(onlineRevenue)}</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            💡 <strong>Rekomendasi Operasional:</strong> Minuman RTD di bazaar menghasilkan perputaran kas cepat harian, sementara paket Tea Bag memiliki potensi margin berulang di toko e-commerce.
          </div>
        </div>

        {/* Top Best-Selling Products */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-semibold text-stone-900 text-sm">
              Produk Terlaris (Ranking Penjualan)
            </h3>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Berdasarkan Volume</span>
          </div>

          <div className="space-y-2.5">
            {topProducts.slice(0, 4).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 max-w-[200px]">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-[10px] font-bold font-mono">
                    #{idx + 1}
                  </span>
                  <span className="font-medium text-stone-800 truncate">
                    {p.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 font-mono-num">{p.qty} terjual</span>
                  <p className="text-[10px] text-stone-400 font-mono-num">{formatRupiah(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-semibold text-stone-900 text-sm">
              Metode Pembayaran Favorit
            </h3>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Digital vs Tunai</span>
          </div>

          <div className="space-y-2">
            {Object.entries(paymentStats).map(([method, data], idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 uppercase">
                    {method}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    ({data.count} transaksi)
                  </span>
                </div>
                <span className="font-mono-num font-bold text-stone-900">
                  {formatRupiah(data.total)}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-stone-500">
            Transaksi non-tunai (QRIS & E-Wallet) berkontribusi mayoritas terhadap kepraktisan operasional kasir.
          </p>
        </div>

      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-brand font-bold text-base text-stone-900">
              Riwayat Transaksi Penjualan Lengkap
            </h3>
            <p className="text-xs text-stone-500">
              Menampilkan {filteredTransactions.length} transaksi tercatat di sistem
            </p>
          </div>

          {/* Filter channel dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Saluran:</span>
            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-purple-700"
            >
              <option value="all">Semua Saluran</option>
              <option value="bazaar_event">Bazaar & Event Kampus</option>
              <option value="offline_store">Toko Ritel Fisik</option>
              <option value="online_order">Pesanan Online</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">No. Order</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Pelanggan / Member</th>
                <th className="py-3 px-3">Saluran</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Diskon/Poin</th>
                <th className="py-3 px-3 text-right font-bold text-stone-900">Total Akhir</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-purple-950">
                    {tx.orderNumber}
                  </td>
                  <td className="py-3 px-3 text-stone-600 font-mono-num whitespace-nowrap">
                    {formatDateTime(tx.timestamp)}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-stone-900">
                      {tx.customerName || 'Pelanggan Umum'}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Kasir: {tx.cashierName}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize text-stone-600">
                      {tx.channel.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="uppercase font-semibold text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono-num text-stone-600">
                    {formatRupiah(tx.subtotal)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-num text-rose-600">
                    {tx.discount + tx.pointsDiscount > 0 ? `-${formatRupiah(tx.discount + tx.pointsDiscount)}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-num font-bold text-stone-900 text-sm">
                    {formatRupiah(tx.total)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedTxForReceipt(tx)}
                        className="p-1.5 text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Lihat Struk"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printThermalReceipt(tx)}
                        className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Cetak Struk Thermal"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thermal Receipt Preview Modal */}
      {selectedTxForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ThermalReceipt
              transaction={selectedTxForReceipt}
              isModal={true}
              onClose={() => setSelectedTxForReceipt(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
