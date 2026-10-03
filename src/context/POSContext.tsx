import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  CartItem,
  Transaction,
  CustomerMember,
  UserAccount,
  StockMovement,
  CloudBackup,
  PaymentMethod,
  SalesChannel
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_MEMBERS,
  INITIAL_USERS,
  INITIAL_TRANSACTIONS
} from '../data/initialData';
import { generateOrderNumber, calculateChecksum } from '../utils/formatters';

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

interface PrinterSettings {
  paperWidth: '58mm' | '80mm';
  autoPrintReceipt: boolean;
  storeName: string;
  storeSubheader: string;
  storeAddress: string;
  instagramTag: string;
  footerNote: string;
}

interface POSContextType {
  // Portal & Mode Navigation
  portalMode: 'public' | 'staff_pos';
  setPortalMode: (mode: 'public' | 'staff_pos') => void;
  publicTab: 'home' | 'shop' | 'experience' | 'locations' | 'member_check';
  setPublicTab: (tab: 'home' | 'shop' | 'experience' | 'locations' | 'member_check') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // POS Navigation
  activeTab: 'pos' | 'inventory' | 'reports' | 'loyalty' | 'catalog_lab' | 'security_backup';
  setActiveTab: (tab: 'pos' | 'inventory' | 'reports' | 'loyalty' | 'catalog_lab' | 'security_backup') => void;

  // Users & Auth
  currentUser: UserAccount;
  allUsers: UserAccount[];
  switchUser: (userId: string, pinInput?: string) => boolean;
  isOwnerAdmin: boolean;

  // Products & Raw Materials
  products: Product[];
  rawMaterials: RawMaterial[];
  stockMovements: StockMovement[];
  updateProductStock: (productId: string, newStock: number, reason: string) => void;
  updateRawMaterialStock: (materialId: string, addedStock: number, notes: string) => void;
  lowStockProducts: Product[];
  lowStockMaterials: RawMaterial[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, options?: {
    ice?: string;
    sugar?: string;
    toppings?: { id: string; name: string; price: number }[];
    package?: string;
    notes?: string;
  }) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;

  // Active Customer in POS
  activeCustomer: CustomerMember | null;
  setActiveCustomer: (customer: CustomerMember | null) => void;
  pointsToRedeem: number;
  setPointsToRedeem: (points: number) => void;
  discountVoucher: { code: string; amount: number } | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;

  // Checkout & Transactions
  transactions: Transaction[];
  currentOrderReceipt: Transaction | null;
  setCurrentOrderReceipt: (tx: Transaction | null) => void;
  processCheckout: (params: {
    paymentMethod: PaymentMethod;
    channel: SalesChannel;
    cashReceived?: number;
    notes?: string;
  }) => Transaction;
  processCustomerOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryMethod: 'pickup' | 'delivery';
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Transaction;

  // Members
  members: CustomerMember[];
  addMember: (memberData: Omit<CustomerMember, 'id' | 'points' | 'totalOrders' | 'totalSpent' | 'joinedDate' | 'tier'>) => CustomerMember;
  updateMemberPoints: (memberId: string, pointDelta: number, reason: string) => void;

  // Printer Settings
  printerSettings: PrinterSettings;
  updatePrinterSettings: (settings: Partial<PrinterSettings>) => void;
  printThermalReceipt: (transaction: Transaction) => void;

  // Cloud Backup & Security
  backups: CloudBackup[];
  lastBackupTime: string;
  isCloudSynced: boolean;
  triggerManualBackup: () => CloudBackup;
  restoreFromBackup: (backupData: unknown) => boolean;
  exportDatabaseJSON: () => string;
  resetToDemoData: () => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'florea_pos_products_v1',
  RAW_MATERIALS: 'florea_pos_materials_v1',
  TRANSACTIONS: 'florea_pos_transactions_v1',
  MEMBERS: 'florea_pos_members_v1',
  MOVEMENTS: 'florea_pos_stock_movements_v1',
  CURRENT_USER_ID: 'florea_pos_active_user_v1',
  PRINTER_SETTINGS: 'florea_pos_printer_v1',
  BACKUPS: 'florea_pos_backups_v1',
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public Website vs Staff POS portal mode
  const [portalMode, setPortalMode] = useState<'public' | 'staff_pos'>('public');
  const [publicTab, setPublicTab] = useState<'home' | 'shop' | 'experience' | 'locations' | 'member_check'>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'reports' | 'loyalty' | 'catalog_lab' | 'security_backup'>('pos');

  // State loaded from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RAW_MATERIALS);
      return saved ? JSON.parse(saved) : INITIAL_RAW_MATERIALS;
    } catch {
      return INITIAL_RAW_MATERIALS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [members, setMembers] = useState<CustomerMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-01';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];
  const isOwnerAdmin = currentUser.role === 'owner_admin';

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<CustomerMember | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [discountVoucher, setDiscountVoucher] = useState<{ code: string; amount: number } | null>(null);
  const [currentOrderReceipt, setCurrentOrderReceipt] = useState<Transaction | null>(null);

  // Printer Settings
  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRINTER_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      paperWidth: '58mm',
      autoPrintReceipt: true,
      storeName: 'FLOREA BOTANICAL INFUSION',
      storeSubheader: 'Teh Telang & Rosella Alami',
      storeAddress: 'Booth Bazaar Kampus UDB Surakarta & Online Store',
      instagramTag: '@florea.botanical',
      footerNote: 'Terima kasih telah menikmati seduhan alami kami! ✨',
    };
  });

  // Cloud Backups
  const [backups, setBackups] = useState<CloudBackup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BACKUPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        backupId: 'FLR-BCK-0929-1',
        timestamp: '2026-09-29T10:00:00',
        sizeKb: 34.2,
        checksum: 'FLR-SHA256-4A9B1C',
        recordsCount: {
          transactions: INITIAL_TRANSACTIONS.length,
          products: INITIAL_PRODUCTS.length,
          rawMaterials: INITIAL_RAW_MATERIALS.length,
          members: INITIAL_MEMBERS.length,
        },
        syncedWithCloud: true,
        operator: 'Sistem Cloud Auto-Sync',
      },
    ];
  });
  const [lastBackupTime, setLastBackupTime] = useState<string>('2026-09-29 10:00');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    setIsCloudSynced(false);
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RAW_MATERIALS, JSON.stringify(rawMaterials));
    setIsCloudSynced(false);
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    setIsCloudSynced(false);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRINTER_SETTINGS, JSON.stringify(printerSettings));
  }, [printerSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(backups));
  }, [backups]);

  // Periodic simulated cloud background sync (every 60s)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsCloudSynced(true);
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastBackupTime(`Hari ini, ${nowStr}`);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { ...toast, id, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch User
  const switchUser = (userId: string, pinInput?: string): boolean => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return false;
    if (pinInput && pinInput !== target.pin) {
      addToast({
        type: 'error',
        title: 'PIN Tidak Sesuai',
        message: `PIN otentikasi untuk ${target.name} salah.`,
      });
      return false;
    }
    setCurrentUserId(userId);
    addToast({
      type: 'info',
      title: 'Berganti Pengguna',
      message: `Sekarang login sebagai ${target.name} (${target.role === 'owner_admin' ? 'Owner / Admin' : 'Kasir'})`,
    });
    return true;
  };

  // Cart operations
  const addToCart = (
    product: Product,
    options?: {
      ice?: string;
      sugar?: string;
      toppings?: { id: string; name: string; price: number }[];
      package?: string;
      notes?: string;
    }
  ) => {
    // Check stock
    if (product.stock <= 0) {
      addToast({
        type: 'error',
        title: 'Stok Habis!',
        message: `${product.name} saat ini stok 0. Segera lakukan restock di tab inventaris.`,
      });
      return;
    }

    const toppingsTotal = options?.toppings?.reduce((sum, t) => sum + t.price, 0) || 0;
    const unitPrice = product.price + toppingsTotal;
    
    // Check if duplicate item exists with exact same options
    const optionKey = `${product.id}-${options?.ice || ''}-${options?.sugar || ''}-${options?.package || ''}-${options?.toppings?.map(t => t.id).sort().join(',') || ''}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => {
        const itemKey = `${item.product.id}-${item.selectedIce || ''}-${item.selectedSugar || ''}-${item.selectedPackage || ''}-${item.selectedToppings?.map(t => t.id).sort().join(',') || ''}`;
        return itemKey === optionKey;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        if (currentQty + 1 > product.stock) {
          addToast({
            type: 'warning',
            title: 'Stok Terbatas',
            message: `Hanya tersisa ${product.stock} ${product.unit} di stok.`,
          });
          return prev;
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + 1,
          lineTotal: (currentQty + 1) * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: 'cart-' + Math.random().toString(36).slice(2, 9),
          product,
          quantity: 1,
          selectedIce: options?.ice,
          selectedSugar: options?.sugar,
          selectedToppings: options?.toppings,
          selectedPackage: options?.package,
          customNotes: options?.notes,
          unitPrice,
          lineTotal: unitPrice,
        };
        return [...prev, newItem];
      }
    });

    addToast({
      type: 'success',
      title: 'Ditambahkan ke Kasir',
      message: `${product.name} telah masuk ke daftar pesanan.`,
    });
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            addToast({
              type: 'warning',
              title: 'Mencapai Batas Stok',
              message: `Stok tersedia hanya ${item.product.stock} unit.`,
            });
            return item;
          }
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.unitPrice,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCustomer(null);
    setPointsToRedeem(0);
    setDiscountVoucher(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  // Voucher validation
  const applyVoucher = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BOTANICALCHILL') {
      setDiscountVoucher({ code: clean, amount: 5000 });
      addToast({
        type: 'success',
        title: 'Voucher Aktif!',
        message: 'Potongan diskon Rp 5.000 berhasil diaplikasikan.',
      });
      return true;
    } else if (clean === 'GENZFLOREA') {
      setDiscountVoucher({ code: clean, amount: 10000 });
      addToast({
        type: 'success',
        title: 'Voucher Spesial Gen Z!',
        message: 'Potongan diskon Rp 10.000 berhasil diaplikasikan.',
      });
      return true;
    } else {
      addToast({
        type: 'error',
        title: 'Voucher Tidak Valid',
        message: 'Kode voucher tidak ditemukan atau masa promo telah berakhir.',
      });
      return false;
    }
  };

  const removeVoucher = () => {
    setDiscountVoucher(null);
  };

  // Stock deduction & recipes logic
  const deductInventoryForSale = (cartItems: CartItem[]) => {
    // 1. Decrement Finished Goods
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      cartItems.forEach(cartItem => {
        const prodIndex = updated.findIndex(p => p.id === cartItem.product.id);
        if (prodIndex > -1) {
          const prevStock = updated[prodIndex].stock;
          const nextStock = Math.max(0, prevStock - cartItem.quantity);
          updated[prodIndex] = {
            ...updated[prodIndex],
            stock: nextStock,
          };

          // Record movement
          const newMovement: StockMovement = {
            id: 'mov-' + Math.random().toString(36).slice(2, 9),
            timestamp: new Date().toISOString(),
            itemId: updated[prodIndex].id,
            itemName: updated[prodIndex].name,
            itemType: 'product',
            type: 'out_sales',
            quantity: cartItem.quantity,
            previousStock: prevStock,
            newStock: nextStock,
            notes: `Penjualan Kasir POS: order qty ${cartItem.quantity}`,
            operator: currentUser.name,
          };
          setStockMovements(prev => [newMovement, ...prev]);

          if (nextStock <= updated[prodIndex].minStockAlert) {
            addToast({
              type: 'warning',
              title: 'Stok Menipis!',
              message: `Stok ${updated[prodIndex].name} tinggal ${nextStock} unit! Segera jadwalkan produksi.`,
            });
          }
        }
      });
      return updated;
    });

    // 2. Decrement Raw Materials based on Bill of Materials (BOM)
    setRawMaterials(prevMaterials => {
      const updated = [...prevMaterials];
      cartItems.forEach(cartItem => {
        const p = cartItem.product;
        const qty = cartItem.quantity;

        // Raw materials deduction per item:
        if (p.category === 'offline_rtd') {
          // RTD uses 1 PLA cup
          const cup = updated.find(m => m.id === 'raw-cup-pla');
          if (cup) cup.currentStock = Math.max(0, cup.currentStock - qty);

          if (p.flowerType === 'butterfly_pea') {
            const rawTelang = updated.find(m => m.id === 'raw-telang');
            if (rawTelang) rawTelang.currentStock = Math.max(0, rawTelang.currentStock - qty * 3); // 3g per cup
            const lemon = updated.find(m => m.id === 'raw-fresh-lemon');
            if (lemon) lemon.currentStock = Math.max(0, lemon.currentStock - qty * 15); // 15g lemon
          } else if (p.flowerType === 'roselle') {
            const rawRosella = updated.find(m => m.id === 'raw-rosella');
            if (rawRosella) rawRosella.currentStock = Math.max(0, rawRosella.currentStock - qty * 5); // 5g per cup
          }

          if (cartItem.selectedSugar?.includes('Honey')) {
            const honey = updated.find(m => m.id === 'raw-honey');
            if (honey) honey.currentStock = Math.max(0, honey.currentStock - qty * 15); // 15ml
          }
        } else if (p.category === 'online_tea_bag') {
          // Tea Bag Pack uses 5 tea bags + 1 paper pouch
          const bags = updated.find(m => m.id === 'raw-teabag-filter');
          if (bags) bags.currentStock = Math.max(0, bags.currentStock - qty * 5);

          const pouch = updated.find(m => m.id === 'raw-box-pouch');
          if (pouch) pouch.currentStock = Math.max(0, pouch.currentStock - qty);

          if (p.flowerType === 'butterfly_pea') {
            const rawTelang = updated.find(m => m.id === 'raw-telang');
            if (rawTelang) rawTelang.currentStock = Math.max(0, rawTelang.currentStock - qty * 10); // 10g per pack
          } else if (p.flowerType === 'roselle') {
            const rawRosella = updated.find(m => m.id === 'raw-rosella');
            if (rawRosella) rawRosella.currentStock = Math.max(0, rawRosella.currentStock - qty * 15); // 15g per pack
          }
        }
      });
      return updated;
    });
  };

  // Checkout Execution
  const processCheckout = (params: {
    paymentMethod: PaymentMethod;
    channel: SalesChannel;
    cashReceived?: number;
    notes?: string;
  }): Transaction => {
    const discountAmount = discountVoucher ? discountVoucher.amount : 0;
    const pointsDiscountAmount = pointsToRedeem * 10; // 100 points = Rp 1.000
    const finalTotal = Math.max(0, cartSubtotal - discountAmount - pointsDiscountAmount);
    
    // Member Points Calculation: 1 point per Rp 1.000 spent
    const pointsEarned = Math.floor(finalTotal / 1000);

    const newTx: Transaction = {
      id: 'trx-' + Date.now(),
      orderNumber: generateOrderNumber(),
      timestamp: new Date().toISOString(),
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerId: activeCustomer?.id,
      customerName: activeCustomer?.name,
      customerPhone: activeCustomer?.phone,
      channel: params.channel,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      voucherCode: discountVoucher?.code,
      pointsUsed: pointsToRedeem,
      pointsDiscount: pointsDiscountAmount,
      pointsEarned,
      tax: 0,
      total: finalTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'paid',
      cashReceived: params.cashReceived,
      cashChange: params.cashReceived ? Math.max(0, params.cashReceived - finalTotal) : 0,
      notes: params.notes,
    };

    // Update state
    setTransactions(prev => [newTx, ...prev]);
    deductInventoryForSale(cart);

    // Update Customer Member if present
    if (activeCustomer) {
      setMembers(prev => prev.map(m => {
        if (m.id === activeCustomer.id) {
          const nextPoints = Math.max(0, m.points - pointsToRedeem) + pointsEarned;
          const nextSpent = m.totalSpent + finalTotal;
          const nextOrders = m.totalOrders + 1;
          
          let nextTier = m.tier;
          if (nextSpent > 200000) nextTier = 'Flora VIP';
          else if (nextSpent > 75000) nextTier = 'Bloom';

          return {
            ...m,
            points: nextPoints,
            totalSpent: nextSpent,
            totalOrders: nextOrders,
            tier: nextTier,
          };
        }
        return m;
      }));
    }

    setCurrentOrderReceipt(newTx);
    clearCart();

    addToast({
      type: 'success',
      title: 'Transaksi Sukses!',
      message: `Pesanan ${newTx.orderNumber} berhasil dicatat via ${params.paymentMethod.toUpperCase()}`,
    });

    return newTx;
  };

  // Customer online order from website
  const processCustomerOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryMethod: 'pickup' | 'delivery';
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Transaction => {
    const discountAmount = discountVoucher ? discountVoucher.amount : 0;
    const pointsDiscountAmount = pointsToRedeem * 10;
    const finalTotal = Math.max(0, cartSubtotal - discountAmount - pointsDiscountAmount);
    const pointsEarned = Math.floor(finalTotal / 1000);

    // Find if member exists with this phone
    let matchedMember = members.find(m => m.phone === orderData.customerPhone);
    if (!matchedMember && orderData.customerPhone) {
      // Auto-register member so customer gets points
      matchedMember = {
        id: 'mem-' + Math.random().toString(36).slice(2, 9),
        name: orderData.customerName,
        phone: orderData.customerPhone,
        tier: 'Sprout',
        points: 50 + pointsEarned,
        totalOrders: 1,
        totalSpent: finalTotal,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setMembers(prev => [matchedMember!, ...prev]);
    } else if (matchedMember) {
      setMembers(prev => prev.map(m => {
        if (m.id === matchedMember!.id) {
          const nextSpent = m.totalSpent + finalTotal;
          return {
            ...m,
            points: m.points + pointsEarned,
            totalSpent: nextSpent,
            totalOrders: m.totalOrders + 1,
            tier: nextSpent > 200000 ? 'Flora VIP' : nextSpent > 75000 ? 'Bloom' : 'Sprout'
          };
        }
        return m;
      }));
    }

    const newTx: Transaction = {
      id: 'trx-' + Date.now(),
      orderNumber: generateOrderNumber(),
      timestamp: new Date().toISOString(),
      cashierId: 'online-web',
      cashierName: 'Web Store Online',
      customerId: matchedMember?.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      channel: 'online_order',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      voucherCode: discountVoucher?.code,
      pointsUsed: pointsToRedeem,
      pointsDiscount: pointsDiscountAmount,
      pointsEarned,
      tax: 0,
      total: finalTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'paid',
      notes: `${orderData.deliveryMethod === 'delivery' ? `[Antar ke: ${orderData.deliveryAddress}] ` : '[Ambil di Booth] '}${orderData.notes || ''}`.trim(),
    };

    setTransactions(prev => [newTx, ...prev]);
    deductInventoryForSale(cart);
    setCurrentOrderReceipt(newTx);
    clearCart();

    addToast({
      type: 'success',
      title: 'Pesanan Berhasil Masuk!',
      message: `Terima kasih Kak ${orderData.customerName}, pesanan ${newTx.orderNumber} sedang disiapkan!`,
    });

    return newTx;
  };

  // Stock Management Actions
  const updateProductStock = (productId: string, newStock: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prevStock = p.stock;
        const movement: StockMovement = {
          id: 'mov-' + Math.random().toString(36).slice(2, 9),
          timestamp: new Date().toISOString(),
          itemId: p.id,
          itemName: p.name,
          itemType: 'product',
          type: newStock >= prevStock ? 'in' : 'adjustment',
          quantity: Math.abs(newStock - prevStock),
          previousStock: prevStock,
          newStock,
          notes: reason || 'Penyesuaian stok manual',
          operator: currentUser.name,
        };
        setStockMovements(m => [movement, ...m]);
        return { ...p, stock: newStock };
      }
      return p;
    }));

    addToast({
      type: 'info',
      title: 'Stok Diperbarui',
      message: `Stok produk telah disesuaikan menjadi ${newStock}.`,
    });
  };

  const updateRawMaterialStock = (materialId: string, addedStock: number, notes: string) => {
    setRawMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        const prevStock = m.currentStock;
        const nextStock = prevStock + addedStock;
        const movement: StockMovement = {
          id: 'mov-' + Math.random().toString(36).slice(2, 9),
          timestamp: new Date().toISOString(),
          itemId: m.id,
          itemName: m.name,
          itemType: 'raw_material',
          type: addedStock > 0 ? 'in' : 'adjustment',
          quantity: Math.abs(addedStock),
          previousStock: prevStock,
          newStock: nextStock,
          notes: notes || 'Penerimaan pasokan bahan baku baru',
          operator: currentUser.name,
        };
        setStockMovements(mv => [movement, ...mv]);
        return {
          ...m,
          currentStock: nextStock,
          lastRestocked: new Date().toISOString().split('T')[0],
        };
      }
      return m;
    }));

    addToast({
      type: 'success',
      title: 'Bahan Baku Masuk',
      message: `Pasokan bahan baku berhasil ditambahkan (+${addedStock}).`,
    });
  };

  // Member Management Actions
  const addMember = (data: Omit<CustomerMember, 'id' | 'points' | 'totalOrders' | 'totalSpent' | 'joinedDate' | 'tier'>): CustomerMember => {
    const newMember: CustomerMember = {
      id: 'mem-' + Math.random().toString(36).slice(2, 9),
      name: data.name,
      phone: data.phone,
      email: data.email,
      tier: 'Sprout',
      points: 50, // Welcome bonus points!
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      notes: data.notes,
    };
    setMembers(prev => [newMember, ...prev]);
    setActiveCustomer(newMember);

    addToast({
      type: 'success',
      title: 'Member Baru Terdaftar',
      message: `${newMember.name} terdaftar dengan bonus 50 poin selamat datang!`,
    });

    return newMember;
  };

  const updateMemberPoints = (memberId: string, pointDelta: number, reason: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextPoints = Math.max(0, m.points + pointDelta);
        return { ...m, points: nextPoints };
      }
      return m;
    }));
    addToast({
      type: 'info',
      title: 'Poin Diperbarui',
      message: `Poin disesuaikan (${pointDelta > 0 ? '+' : ''}${pointDelta}): ${reason}`,
    });
  };

  // Printer Settings
  const updatePrinterSettings = (settings: Partial<PrinterSettings>) => {
    setPrinterSettings(prev => ({ ...prev, ...settings }));
    addToast({
      type: 'success',
      title: 'Pengaturan Printer Disimpan',
      message: 'Format struk kasir thermal berhasil diupdate.',
    });
  };

  const printThermalReceipt = (transaction: Transaction) => {
    setCurrentOrderReceipt(transaction);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Cloud Backup and Security
  const triggerManualBackup = (): CloudBackup => {
    const stateSnapshot = {
      timestamp: new Date().toISOString(),
      products,
      rawMaterials,
      transactions,
      members,
      stockMovements,
    };

    const checksum = calculateChecksum(stateSnapshot);
    const sizeKb = parseFloat((JSON.stringify(stateSnapshot).length / 1024).toFixed(1));

    const newBackup: CloudBackup = {
      backupId: `FLR-SNAP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      sizeKb,
      checksum,
      recordsCount: {
        transactions: transactions.length,
        products: products.length,
        rawMaterials: rawMaterials.length,
        members: members.length,
      },
      syncedWithCloud: true,
      operator: currentUser.name,
    };

    setBackups(prev => [newBackup, ...prev]);
    setIsCloudSynced(true);
    setLastBackupTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

    addToast({
      type: 'success',
      title: 'Cadangan Cloud Tersimpan',
      message: `Data berhasil di-backup ke Cloud dengan enkripsi integritas (${checksum}).`,
    });

    return newBackup;
  };

  const exportDatabaseJSON = (): string => {
    const fullPayload = {
      app: 'FLOREA Botanical POS System',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.name,
      checksum: calculateChecksum({ products, rawMaterials, transactions }),
      data: {
        products,
        rawMaterials,
        transactions,
        members,
        stockMovements,
      },
    };
    return JSON.stringify(fullPayload, null, 2);
  };

  const restoreFromBackup = (backupData: any): boolean => {
    try {
      if (!backupData || !backupData.data) {
        throw new Error('Format file cadangan tidak valid');
      }
      const { data } = backupData;
      if (data.products) setProducts(data.products);
      if (data.rawMaterials) setRawMaterials(data.rawMaterials);
      if (data.transactions) setTransactions(data.transactions);
      if (data.members) setMembers(data.members);
      if (data.stockMovements) setStockMovements(data.stockMovements);

      addToast({
        type: 'success',
        title: 'Pemulihan Sukses!',
        message: 'Seluruh database transaksi & stok berhasil dipulihkan dari arsip cloud.',
      });
      return true;
    } catch (e: any) {
      addToast({
        type: 'error',
        title: 'Gagal Memulihkan',
        message: e?.message || 'File cadangan rusak atau korup.',
      });
      return false;
    }
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMembers(INITIAL_MEMBERS);
    setStockMovements([]);
    clearCart();
    addToast({
      type: 'info',
      title: 'Data Demo Direset',
      message: 'Sistem POS telah dikembalikan ke data awal default proposal Florea.',
    });
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const lowStockMaterials = rawMaterials.filter(m => m.currentStock <= m.minThreshold);

  return (
    <POSContext.Provider
      value={{
        portalMode,
        setPortalMode,
        publicTab,
        setPublicTab,
        isCartOpen,
        setIsCartOpen,
        activeTab,
        setActiveTab,
        currentUser,
        allUsers,
        switchUser,
        isOwnerAdmin,
        products,
        rawMaterials,
        stockMovements,
        updateProductStock,
        updateRawMaterialStock,
        lowStockProducts,
        lowStockMaterials,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        cartSubtotal,
        activeCustomer,
        setActiveCustomer,
        pointsToRedeem,
        setPointsToRedeem,
        discountVoucher,
        applyVoucher,
        removeVoucher,
        transactions,
        currentOrderReceipt,
        setCurrentOrderReceipt,
        processCheckout,
        processCustomerOrder,
        members,
        addMember,
        updateMemberPoints,
        printerSettings,
        updatePrinterSettings,
        printThermalReceipt,
        backups,
        lastBackupTime,
        isCloudSynced,
        triggerManualBackup,
        restoreFromBackup,
        exportDatabaseJSON,
        resetToDemoData,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
