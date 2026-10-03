import { Product, RawMaterial, CustomerMember, UserAccount, Transaction } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-bp-teabag',
    name: 'FLOREA Butterfly Pea Brew',
    subtitle: 'Single-Serve Tea Bag Box (Isi 5 Kantong)',
    sku: 'FLP-BP01',
    category: 'online_tea_bag',
    flowerType: 'butterfly_pea',
    price: 15000,
    hpp: 8000,
    stock: 45,
    minStockAlert: 15,
    unit: 'Box (5 tea bags)',
    description: 'Seduhan murni bunga telang (Clitoria ternatea) pilihan kaya antioksidan antosianin alami. Warna biru royal memikat yang dapat berubah jadi ungu saat ditetesi lemon.',
    benefits: ['Tinggi Antioksidan', 'Pereda Stres Alami', 'Bebas Gula & Kalori'],
    image: '/src/assets/images/florea_butterfly_pea_tea_1790712539892.jpg',
    isPopular: true,
    channel: 'all',
    customizable: true,
    options: {
      packageTypes: ['Standard Box', 'Eco Gift Box']
    }
  },
  {
    id: 'prod-ros-teabag',
    name: 'FLOREA Roselle Brew',
    subtitle: 'Single-Serve Tea Bag Box (Isi 5 Kantong)',
    sku: 'FLP-RS01',
    category: 'online_tea_bag',
    flowerType: 'roselle',
    price: 17000,
    hpp: 9000,
    stock: 38,
    minStockAlert: 15,
    unit: 'Box (5 tea bags)',
    description: 'Kelopak bunga rosella (Hibiscus sabdariffa) merah merona dengan cita rasa asam segar alami. Kaya vitamin C dan bioaktif perawat daya tahan tubuh.',
    benefits: ['Kaya Vitamin C', 'Segar Alami Tanpa Gula', 'Detoks & Skin Glow'],
    image: '/src/assets/images/florea_roselle_tea_1790712550945.jpg',
    isPopular: true,
    channel: 'all',
    customizable: true,
    options: {
      packageTypes: ['Standard Pouch', 'Eco Gift Box']
    }
  },
  {
    id: 'prod-duo-gift',
    name: 'FLOREA Duo Botanical Collection',
    subtitle: 'Gift Box Spesial (5 Telang + 5 Rosella)',
    sku: 'FLP-DUO01',
    category: 'online_tea_bag',
    flowerType: 'duo_botanical',
    price: 32000,
    hpp: 18000,
    stock: 20,
    minStockAlert: 8,
    unit: 'Eco Box (10 tea bags)',
    description: 'Kombinasi komplit dua varian andalan FLOREA dalam gift box ramah lingkungan. Cocok untuk hadiah sahabat dan self-care weekend.',
    benefits: ['2 Rasa dalam 1 Box', 'Kemasan Hadiah Estetik', 'Free Tea Infuser Sticker'],
    image: '/src/assets/images/florea_hero_brand_1790712572770.jpg',
    isPopular: true,
    channel: 'all'
  },
  {
    id: 'prod-magic-lemonade',
    name: 'Magic Butterfly Pea Lemonade',
    subtitle: 'Chilled RTD 350ml (Color-Changing)',
    sku: 'RTD-BP-LEM',
    category: 'offline_rtd',
    flowerType: 'butterfly_pea',
    price: 18000,
    hpp: 8000,
    stock: 30,
    minStockAlert: 10,
    unit: 'Cup 350ml',
    description: 'Minuman dingin segar bunga telang dengan perasan fresh lemon dan madu murni. Warna berubah dari biru safir menjadi ungu magenta mempesona saat diaduk.',
    benefits: ['Sensasi Visual Unik', 'Kaya Vitamin C & Antioksidan', 'Super Refreshing'],
    image: '/src/assets/images/florea_ready_to_drink_cup_1790712562653.jpg',
    isPopular: true,
    channel: 'offline_only',
    customizable: true,
    options: {
      iceLevels: ['Normal Ice', 'Less Ice', 'No Ice'],
      sugarLevels: ['No Sugar (0 Cal)', 'Less Sweet (50%)', 'Normal Sweet', 'Pure Wild Honey'],
      toppings: [
        { id: 'top-chia', name: 'Organic Chia Seeds', price: 3000 },
        { id: 'top-lemon', name: 'Extra Fresh Lemon Slice', price: 2000 },
        { id: 'top-jelly', name: 'Aloe Vera Botanical Jelly', price: 4000 }
      ]
    }
  },
  {
    id: 'prod-sparkling-roselle',
    name: 'Sparkling Roselle Hibiscus Fizz',
    subtitle: 'Chilled RTD 350ml (Ruby Spritz)',
    sku: 'RTD-RS-FIZ',
    category: 'offline_rtd',
    flowerType: 'roselle',
    price: 18000,
    hpp: 8000,
    stock: 28,
    minStockAlert: 10,
    unit: 'Cup 350ml',
    description: 'Infusi kelopak rosella pekat dipadukan dengan sparkling soda dingin, mint segar, dan sentuhan madu alami. Rasa asam manis yang menyegarkan dahaga seketika.',
    benefits: ['Segar Sparkling', 'Booster Imunitas', 'Alami Tanpa Pengawet'],
    image: '/src/assets/images/florea_ready_to_drink_cup_1790712562653.jpg',
    isPopular: true,
    channel: 'offline_only',
    customizable: true,
    options: {
      iceLevels: ['Normal Ice', 'Less Ice', 'No Ice'],
      sugarLevels: ['No Sugar (0 Cal)', 'Less Sweet (50%)', 'Normal Sweet', 'Pure Wild Honey'],
      toppings: [
        { id: 'top-mint', name: 'Fresh Garden Mint', price: 2000 },
        { id: 'top-chia', name: 'Organic Chia Seeds', price: 3000 },
        { id: 'top-jelly', name: 'Aloe Vera Botanical Jelly', price: 4000 }
      ]
    }
  },
  {
    id: 'prod-honey-bluepea',
    name: 'Telang Pure Honey Cold Brew',
    subtitle: 'Chilled RTD 350ml (Sweet Zen)',
    sku: 'RTD-BP-HON',
    category: 'offline_rtd',
    flowerType: 'butterfly_pea',
    price: 17000,
    hpp: 7500,
    stock: 25,
    minStockAlert: 8,
    unit: 'Cup 350ml',
    description: 'Seduhan telang dingin metode slow-brew dengan madu randu asli dan aroma serai wangi lembut. Menenangkan pikiran dan menyegarkan tubuh lelah.',
    benefits: ['Menenangkan Pikiran', '100% Madu Murni', 'Aroma Serai Wangi'],
    image: '/src/assets/images/florea_butterfly_pea_tea_1790712539892.jpg',
    isPopular: false,
    channel: 'offline_only',
    customizable: true,
    options: {
      iceLevels: ['Normal Ice', 'Less Ice', 'No Ice'],
      sugarLevels: ['Normal Sweet', 'Less Sweet (50%)'],
      toppings: [
        { id: 'top-jelly', name: 'Aloe Vera Botanical Jelly', price: 4000 }
      ]
    }
  },
  {
    id: 'prod-roselle-berry-blend',
    name: 'Sunset Botanical Infusion Blend',
    subtitle: 'Signature Blend (Telang + Roselle + Citrus)',
    sku: 'SIG-BLN01',
    category: 'signature_blend',
    flowerType: 'blend',
    price: 20000,
    hpp: 9500,
    stock: 18,
    minStockAlert: 6,
    unit: 'Cup 350ml',
    description: 'Gradasi warna sunset magis dari layer rosella merah di dasar dan telang biru di bagian atas dengan garnish irisan jeruk kering.',
    benefits: ['Instagramable Sunset Visual', 'Double Antioxidant Power', 'Eksklusif Bazaar'],
    image: '/src/assets/images/florea_hero_brand_1790712572770.jpg',
    isPopular: true,
    channel: 'offline_only',
    customizable: true,
    options: {
      iceLevels: ['Normal Ice', 'Less Ice'],
      sugarLevels: ['Less Sweet (50%)', 'Normal Sweet']
    }
  },
  {
    id: 'prod-eco-tumbler',
    name: 'FLOREA Botanical Glass Tumbler',
    subtitle: 'Double Wall 450ml Reusable Eco Tumbler',
    sku: 'MCH-TMB01',
    category: 'merchandise',
    flowerType: 'blend',
    price: 45000,
    hpp: 26000,
    stock: 12,
    minStockAlert: 5,
    unit: 'Pcs',
    description: 'Tumbler kaca borosilikat tahan panas dingin dengan infuser filter stainless steel. Dicetak dengan ilustrasi floral Florea minimalis.',
    benefits: ['Eco-Friendly zero waste', 'Includes Tea Strainer', 'Diskon Rp 2.000 tiap refill'],
    image: '/src/assets/images/florea_hero_brand_1790712572770.jpg',
    isPopular: false,
    channel: 'all'
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'raw-telang',
    name: 'Bunga Telang Kering Super Grade',
    category: 'botanical',
    currentStock: 1850, // in grams
    unit: 'gram',
    minThreshold: 500,
    costPerUnit: 120, // Rp per gram (Rp 120.000/kg)
    supplier: 'Petani Telang Sukoharjo Berseri',
    lastRestocked: '2026-09-24'
  },
  {
    id: 'raw-rosella',
    name: 'Kelopak Rosella Kering Merah Unggul',
    category: 'botanical',
    currentStock: 2200,
    unit: 'gram',
    minThreshold: 500,
    costPerUnit: 160,
    supplier: 'Kelompok Tani Rosella Karanganyar',
    lastRestocked: '2026-09-25'
  },
  {
    id: 'raw-teabag-filter',
    name: 'Cornfiber Pyramid Tea Bag Filter + String',
    category: 'packaging',
    currentStock: 420,
    unit: 'pcs',
    minThreshold: 100,
    costPerUnit: 400,
    supplier: 'EcoPack Solusi Kemasan Jogja',
    lastRestocked: '2026-09-20'
  },
  {
    id: 'raw-box-pouch',
    name: 'Kemasan Luar Paper Pouch FLOREA',
    category: 'packaging',
    currentStock: 85,
    unit: 'pcs',
    minThreshold: 30,
    costPerUnit: 2000,
    supplier: 'Percetakan Duta Grafika Surakarta',
    lastRestocked: '2026-09-22'
  },
  {
    id: 'raw-cup-pla',
    name: 'Biodegradable PLA Cup 350ml + Lid',
    category: 'packaging',
    currentStock: 60,
    unit: 'set',
    minThreshold: 40, // Low stock indicator
    costPerUnit: 1200,
    supplier: 'EcoDrink Container ID',
    lastRestocked: '2026-09-26'
  },
  {
    id: 'raw-fresh-lemon',
    name: 'Lemon California Fresh Segar',
    category: 'ingredient',
    currentStock: 3500, // in grams
    unit: 'gram',
    minThreshold: 1000,
    costPerUnit: 35,
    supplier: 'Pasar Gede Fresh Mart',
    lastRestocked: '2026-09-28'
  },
  {
    id: 'raw-honey',
    name: 'Madu Hutan Randu Alami 100%',
    category: 'ingredient',
    currentStock: 2100, // in ml
    unit: 'ml',
    minThreshold: 800,
    costPerUnit: 90,
    supplier: 'Peternak Lebah Sragen Lestari',
    lastRestocked: '2026-09-27'
  }
];

export const INITIAL_MEMBERS: CustomerMember[] = [
  {
    id: 'mem-001',
    name: 'Clarissa Maharani',
    phone: '081234567890',
    email: 'clarissa.m@student.udb.ac.id',
    tier: 'Bloom',
    points: 480,
    totalOrders: 6,
    totalSpent: 112000,
    joinedDate: '2026-09-02'
  },
  {
    id: 'mem-002',
    name: 'Rafi Pratama',
    phone: '085712344321',
    email: 'rafipratama@gmail.com',
    tier: 'Flora VIP',
    points: 820,
    totalOrders: 11,
    totalSpent: 215000,
    joinedDate: '2026-09-01'
  },
  {
    id: 'mem-003',
    name: 'Dinda Kirana',
    phone: '082199887766',
    email: 'dindak@gmail.com',
    tier: 'Sprout',
    points: 150,
    totalOrders: 2,
    totalSpent: 36000,
    joinedDate: '2026-09-20'
  },
  {
    id: 'mem-004',
    name: 'Kevin Jonathan',
    phone: '081377889900',
    email: 'kevin.j@gmail.com',
    tier: 'Bloom',
    points: 390,
    totalOrders: 5,
    totalSpent: 94000,
    joinedDate: '2026-09-12'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-01',
    name: 'Arvanda Nur Aini',
    role: 'owner_admin',
    pin: '1234',
    email: 'annisaayu877@gmail.com',
    nim: '240103249',
    avatarBg: 'bg-[#4E3875]',
    division: 'Ketua Pengusul & Sistem POS'
  },
  {
    id: 'usr-02',
    name: 'Rista Ayu Nur Aidah',
    role: 'owner_admin',
    pin: '2401',
    email: 'ristaayu220@gmail.com',
    nim: '240103201',
    avatarBg: 'bg-[#9B3354]',
    division: 'Pemasaran & Desain Visual'
  },
  {
    id: 'usr-03',
    name: 'Aminuddin Fadli',
    role: 'cashier',
    pin: '1111',
    email: 'dyahayuardita5@gmail.com',
    nim: '230414027',
    avatarBg: 'bg-[#3B5B82]',
    division: 'Kasir & Barista Bazaar Kampus'
  },
  {
    id: 'usr-04',
    name: 'Bintang Fajar Mustika Aji',
    role: 'cashier',
    pin: '2222',
    email: 'estinavitasari123@gmail.com',
    nim: '220416015',
    avatarBg: 'bg-[#2E6F40]',
    division: 'Kasir Operasional & Stok'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-101',
    orderNumber: 'FLR-260929-001',
    timestamp: '2026-09-29T10:15:00',
    cashierId: 'usr-03',
    cashierName: 'Aminuddin Fadli',
    customerId: 'mem-001',
    customerName: 'Clarissa Maharani',
    customerPhone: '081234567890',
    channel: 'bazaar_event',
    items: [
      {
        id: 'ci-1',
        product: INITIAL_PRODUCTS[3], // Magic Butterfly Pea Lemonade
        quantity: 2,
        selectedIce: 'Normal Ice',
        selectedSugar: 'Less Sweet (50%)',
        selectedToppings: [{ id: 'top-chia', name: 'Organic Chia Seeds', price: 3000 }],
        unitPrice: 21000,
        lineTotal: 42000
      },
      {
        id: 'ci-2',
        product: INITIAL_PRODUCTS[0], // FLOREA Butterfly Pea Brew Tea Bag
        quantity: 1,
        unitPrice: 15000,
        lineTotal: 15000
      }
    ],
    subtotal: 57000,
    discount: 5000,
    voucherCode: 'BOTANICALCHILL',
    pointsUsed: 0,
    pointsDiscount: 0,
    pointsEarned: 52,
    tax: 0,
    total: 52000,
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    notes: 'Less sweet for both drinks'
  },
  {
    id: 'trx-102',
    orderNumber: 'FLR-260929-002',
    timestamp: '2026-09-29T11:42:00',
    cashierId: 'usr-03',
    cashierName: 'Aminuddin Fadli',
    customerId: 'mem-002',
    customerName: 'Rafi Pratama',
    customerPhone: '085712344321',
    channel: 'bazaar_event',
    items: [
      {
        id: 'ci-3',
        product: INITIAL_PRODUCTS[4], // Sparkling Roselle Hibiscus Fizz
        quantity: 1,
        selectedIce: 'Normal Ice',
        selectedSugar: 'Normal Sweet',
        unitPrice: 18000,
        lineTotal: 18000
      },
      {
        id: 'ci-4',
        product: INITIAL_PRODUCTS[2], // Duo Gift Box
        quantity: 1,
        unitPrice: 32000,
        lineTotal: 32000
      }
    ],
    subtotal: 50000,
    discount: 0,
    pointsUsed: 100,
    pointsDiscount: 10000,
    pointsEarned: 40,
    tax: 0,
    total: 40000,
    paymentMethod: 'gopay',
    paymentStatus: 'paid'
  },
  {
    id: 'trx-103',
    orderNumber: 'FLR-260929-003',
    timestamp: '2026-09-29T12:20:00',
    cashierId: 'usr-04',
    cashierName: 'Bintang Fajar',
    channel: 'offline_store',
    items: [
      {
        id: 'ci-5',
        product: INITIAL_PRODUCTS[1], // Roselle Brew Tea Bag
        quantity: 2,
        unitPrice: 17000,
        lineTotal: 34000
      }
    ],
    subtotal: 34000,
    discount: 0,
    pointsUsed: 0,
    pointsDiscount: 0,
    pointsEarned: 0,
    tax: 0,
    total: 34000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    cashReceived: 50000,
    cashChange: 16000
  },
  {
    id: 'trx-104',
    orderNumber: 'FLR-260929-004',
    timestamp: '2026-09-29T13:05:00',
    cashierId: 'usr-04',
    cashierName: 'Bintang Fajar',
    customerId: 'mem-004',
    customerName: 'Kevin Jonathan',
    customerPhone: '081377889900',
    channel: 'bazaar_event',
    items: [
      {
        id: 'ci-6',
        product: INITIAL_PRODUCTS[6], // Sunset Botanical Infusion
        quantity: 2,
        selectedIce: 'Less Ice',
        selectedSugar: 'Less Sweet (50%)',
        unitPrice: 20000,
        lineTotal: 40000
      }
    ],
    subtotal: 40000,
    discount: 0,
    pointsUsed: 0,
    pointsDiscount: 0,
    pointsEarned: 40,
    tax: 0,
    total: 40000,
    paymentMethod: 'shopeepay',
    paymentStatus: 'paid'
  }
];
