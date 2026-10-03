export type ProductCategory = 'online_tea_bag' | 'offline_rtd' | 'signature_blend' | 'merchandise';

export type FlowerType = 'butterfly_pea' | 'roselle' | 'duo_botanical' | 'blend';

export interface ProductOption {
  iceLevels?: ('Normal Ice' | 'Less Ice' | 'No Ice' | 'Extra Ice')[];
  sugarLevels?: ('No Sugar (0 Cal)' | 'Less Sweet (50%)' | 'Normal Sweet' | 'Pure Wild Honey' | 'Stevia Drop')[];
  toppings?: {
    id: string;
    name: string;
    price: number;
  }[];
  packageTypes?: ('Standard Pouch' | 'Standard Box' | 'Eco Box' | 'Eco Gift Box' | 'Single Sachet')[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  category: ProductCategory;
  flowerType: FlowerType;
  price: number;
  hpp: number; // Harga Pokok Penjualan
  stock: number;
  minStockAlert: number;
  unit: string; // e.g. "Pack (5 tea bags)", "Cup 350ml", "Pcs"
  description: string;
  benefits: string[];
  image: string;
  isPopular?: boolean;
  channel: 'all' | 'offline_only' | 'online_only';
  customizable?: boolean;
  options?: ProductOption;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'botanical' | 'packaging' | 'ingredient';
  currentStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface CartItem {
  id: string; // unique cart line id
  product: Product;
  quantity: number;
  selectedIce?: string;
  selectedSugar?: string;
  selectedToppings?: { id: string; name: string; price: number }[];
  selectedPackage?: string;
  customNotes?: string;
  unitPrice: number;
  lineTotal: number;
}

export type PaymentMethod = 
  | 'qris'
  | 'gopay'
  | 'shopeepay'
  | 'dana'
  | 'ovo'
  | 'cash'
  | 'bca_va';

export type SalesChannel = 'offline_store' | 'bazaar_event' | 'online_order';

export interface Transaction {
  id: string;
  orderNumber: string;
  timestamp: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  channel: SalesChannel;
  items: CartItem[];
  subtotal: number;
  discount: number;
  voucherCode?: string;
  pointsUsed: number;
  pointsDiscount: number;
  pointsEarned: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  cashReceived?: number;
  cashChange?: number;
  notes?: string;
}

export interface CustomerMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'Sprout' | 'Bloom' | 'Flora VIP';
  points: number;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  notes?: string;
}

export type UserRole = 'owner_admin' | 'cashier';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
  email: string;
  nim?: string;
  avatarBg: string;
  division: string;
}

export interface StockMovement {
  id: string;
  timestamp: string;
  itemId: string;
  itemName: string;
  itemType: 'product' | 'raw_material';
  type: 'in' | 'out_sales' | 'out_damage' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes: string;
  operator: string;
}

export interface CloudBackup {
  backupId: string;
  timestamp: string;
  sizeKb: number;
  checksum: string;
  recordsCount: {
    transactions: number;
    products: number;
    rawMaterials: number;
    members: number;
  };
  syncedWithCloud: boolean;
  operator: string;
}
