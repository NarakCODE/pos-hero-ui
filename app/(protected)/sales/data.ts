import type { Locale } from "@/config/i18n";

export type ProductCategory =
  | "signature"
  | "icedCoffee"
  | "hotCoffee"
  | "tea"
  | "smoothie"
  | "juice"
  | "breakfast"
  | "sandwich"
  | "bakery"
  | "dessert"
  | "snack";

export type CategoryId =
  | "favourites"
  | "bestSellers"
  | "signature"
  | "icedCoffee"
  | "hotCoffee"
  | "tea"
  | "smoothie"
  | "juice"
  | "breakfast"
  | "sandwich"
  | "bakery"
  | "dessert"
  | "snack";

export type SizeId = "extraSmall" | "small" | "medium" | "large";
export type IceId = "regularIce" | "lessIce" | "noIce" | "warm" | "hot";
export type SweetnessId =
  | "noSugar"
  | "quarterSugar"
  | "lessSugar"
  | "regularSugar"
  | "extraSugar";
export type AddOnId =
  | "espressoShot"
  | "oatMilk"
  | "almondMilk"
  | "soyMilk"
  | "whippedCream"
  | "caramelDrizzle"
  | "vanillaSyrup"
  | "hazelnutSyrup"
  | "bobaPearls"
  | "cheeseFoam"
  | "grassJelly"
  | "coconutJelly";
export type PaymentMethodId = "cash" | "bankCard" | "khqr";

export type Product = {
  id: string;
  name: Record<Locale, string>;
  category: ProductCategory;
  price: number;
  status?: "active" | "inactive";
  favorite?: boolean;
  bestSeller?: boolean;
  image: string;
  sku?: string;
  description?: Record<Locale, string>;
  stock?: number;
  inStock?: boolean;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  size: SizeId;
  ice?: IceId;
  sweetness: SweetnessId;
  addOns: AddOnId[];
};

export const categoryIds: readonly CategoryId[] = [
  "favourites",
  "bestSellers",
  "signature",
  "icedCoffee",
  "hotCoffee",
  "tea",
  "smoothie",
  "juice",
  "breakfast",
  "sandwich",
  "bakery",
  "dessert",
  "snack",
] as const;

export const sizeIds: readonly SizeId[] = [
  "extraSmall",
  "small",
  "medium",
  "large",
] as const;

export const iceIds: readonly IceId[] = [
  "regularIce",
  "lessIce",
  "noIce",
  "warm",
  "hot",
] as const;

export const sweetnessIds: readonly SweetnessId[] = [
  "noSugar",
  "quarterSugar",
  "lessSugar",
  "regularSugar",
  "extraSugar",
] as const;

export const addOnIds: readonly AddOnId[] = [
  "espressoShot",
  "oatMilk",
  "almondMilk",
  "soyMilk",
  "whippedCream",
  "caramelDrizzle",
  "vanillaSyrup",
  "hazelnutSyrup",
  "bobaPearls",
  "cheeseFoam",
  "grassJelly",
  "coconutJelly",
] as const;

export const products: Product[] = [
  // ==================== SIGNATURE SPECIALS ====================
  {
    id: "biscoff-cookie-latte",
    name: { en: "Lotus Biscoff Latte", km: "ប៊ីស្កូហ្វ ឡាតេ" },
    category: "signature",
    price: 4.75,
    favorite: true,
    bestSeller: true,
    sku: "SIG-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Rich espresso blended with creamy Lotus Biscoff butter spread and crumbled biscuit.",
      km: "កាហ្វេអេសប្រេសូជាមួយប៊័រប៊ីស្កូហ្វ និងនំស្រួយកិនម៉ត់។",
    },
  },
  {
    id: "pandan-coconut-coffee",
    name: { en: "Pandan Coconut Cloud", km: "កាហ្វេដូងស្លឹកតយ" },
    category: "signature",
    price: 4.5,
    favorite: true,
    sku: "SIG-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Cold brew layered over fragrant pandan sweet cream and coconut water.",
      km: "កាហ្វេប៊្រូត្រជាក់ស្រទាប់ក្រែមស្លឹកតយ និងទឹកដូងស្រស់។",
    },
  },
  {
    id: "rose-pistachio-latte",
    name: { en: "Rose Pistachio Latte", km: "ឡាតេផ្កាកុលាបពីស្តាស៊ីអូ" },
    category: "signature",
    price: 4.75,
    bestSeller: true,
    sku: "SIG-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Delicate organic rose water, crushed Sicilian pistachios, and steamed milk.",
      km: "ទឹកផ្កាកុលាបសរីរាង្គ គ្រាប់ពីស្តាស៊ីអូ និងទឹកដោះគោក្តៅ។",
    },
  },
  {
    id: "honeycomb-affogato",
    name: { en: "Honeycomb Crunch Affogato", km: "អាហ្វូកាតូទឹកឃ្មុំស្រួយ" },
    category: "signature",
    price: 4.25,
    sku: "SIG-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Artisan vanilla bean gelato drowned in a shot of hot espresso with honeycomb candy.",
      km: "ការ៉េមវ៉ានីឡាស្រោចស្រពដោយកាហ្វេអេសប្រេសូក្តៅ និងស្ករទឹកឃ្មុំស្រួយ។",
    },
  },

  // ==================== ICED COFFEE ====================
  {
    id: "iced-latte",
    name: { en: "Iced Latte", km: "ឡាតេត្រជាក់" },
    category: "icedCoffee",
    price: 3.5,
    favorite: true,
    bestSeller: true,
    sku: "ICOF-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Rich espresso combined with fresh chilled milk over crystal ice.",
      km: "កាហ្វេអេសប្រេសូឈ្ងុយឆ្ងាញ់ លាយជាមួយទឹកដោះគោត្រជាក់ស្រស់។",
    },
  },
  {
    id: "caramel-macchiato",
    name: { en: "Caramel Macchiato", km: "កាម៉េល ម៉ាក់គីអាតូ" },
    category: "icedCoffee",
    price: 4.25,
    favorite: true,
    bestSeller: true,
    sku: "ICOF-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Fresh steamed milk with vanilla syrup, marked with espresso and caramel drizzle.",
      km: "ទឹកដោះគោផ្អែមស្រទន់ ជាមួយរសជាតិកាម៉េលនិងអេសប្រេសូ។",
    },
  },
  {
    id: "cold-brew",
    name: { en: "Classic Cold Brew", km: "កាហ្វេប៊្រូត្រជាក់" },
    category: "icedCoffee",
    price: 3.25,
    favorite: true,
    sku: "ICOF-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Slow-steeped for 20 hours for an exceptionally smooth, bold taste.",
      km: "ត្រាំកាហ្វេស្រស់រយៈពេល ២០ ម៉ោង ដើម្បីទទួលបានរសជាតិទន់រលោង។",
    },
  },
  {
    id: "iced-americano",
    name: { en: "Iced Americano", km: "អាមេរិកាណូត្រជាក់" },
    category: "icedCoffee",
    price: 2.75,
    bestSeller: true,
    sku: "ICOF-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Espresso shots topped with cold filtered water over ice.",
      km: "អេសប្រេសូស្រស់ ជាមួយទឹកត្រជាក់ និងទឹកកក។",
    },
  },
  {
    id: "spanish-latte",
    name: { en: "Iced Spanish Latte", km: "ស្ប៉ានីសឡាតេត្រជាក់" },
    category: "icedCoffee",
    price: 4.5,
    favorite: true,
    sku: "ICOF-005",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Sweetened condensed milk balanced with double-shot espresso and fresh milk.",
      km: "ទឹកដោះគោខាប់ផ្អែមឆ្ងាញ់ លាយជាមួយអេសប្រេសូឌុប។",
    },
  },
  {
    id: "iced-mocha",
    name: { en: "Iced Caffe Mocha", km: "ម៉ូកាត្រជាក់" },
    category: "icedCoffee",
    price: 4.0,
    sku: "ICOF-006",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Rich Dutch cocoa sauce mixed with bold espresso and chilled milk.",
      km: "កាកាវហូឡង់ ជាមួយអេសប្រេសូនិងទឹកដោះគោត្រជាក់។",
    },
  },
  {
    id: "vanilla-cold-brew",
    name: { en: "Vanilla Sweet Cream Cold Brew", km: "វ៉ានីឡា ស្វីតក្រីម កាហ្វេប៊្រូ" },
    category: "icedCoffee",
    price: 4.75,
    bestSeller: true,
    sku: "ICOF-007",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Slow-steeped cold brew accented with vanilla and topped with house sweet cream.",
      km: "កាហ្វេប៊្រូត្រជាក់ ស្រោបដោយក្រែមវ៉ានីឡាផ្អែមស្រទន់។",
    },
  },

  // ==================== HOT COFFEE ====================
  {
    id: "espresso-doppio",
    name: { en: "Espresso Doppio", km: "អេសប្រេសូ ដុបភីយ៉ូ" },
    category: "hotCoffee",
    price: 2.25,
    favorite: true,
    sku: "HCOF-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Double shot of rich espresso with a golden, velvety crema.",
      km: "អេសប្រេសូពីរតំណក់ ក្លិនឈ្ងុយ និងក្រែមមាស។",
    },
  },
  {
    id: "cappuccino",
    name: { en: "Cappuccino", km: "កាពូជីណូ" },
    category: "hotCoffee",
    price: 3.75,
    bestSeller: true,
    sku: "HCOF-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Equal parts bold espresso, steamed milk, and thick foam dusted with cocoa.",
      km: "កាហ្វេអេសប្រេសូ ទឹកដោះគោក្តៅ និងពពុះទឹកដោះគោក្រាស់។",
    },
  },
  {
    id: "hot-latte",
    name: { en: "Caffe Latte", km: "កាហ្វេឡាតេក្តៅ" },
    category: "hotCoffee",
    price: 3.5,
    favorite: true,
    sku: "HCOF-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Silky steamed milk poured over a shot of signature espresso with latte art.",
      km: "កាហ្វេឡាតេក្តៅ ទឹកដោះគោទន់រលោងនិងសិល្បៈឡាតេ។",
    },
  },
  {
    id: "flat-white",
    name: { en: "Flat White", km: "ហ្វ្លេតវ៉ាយ" },
    category: "hotCoffee",
    price: 3.75,
    favorite: true,
    sku: "HCOF-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Ristretto espresso shots fused with velvety micro-foam for intense coffee flavor.",
      km: "អេសប្រេសូរីស្ត្រេតតូ ជាមួយពពុះទឹកដោះគោស្តើងទន់។",
    },
  },
  {
    id: "hot-americano",
    name: { en: "Hot Americano", km: "អាមេរិកាណូក្តៅ" },
    category: "hotCoffee",
    price: 2.5,
    sku: "HCOF-005",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Freshly pulled espresso poured over hot filtered mineral water.",
      km: "អេសប្រេសូស្រស់ ជាមួយទឹកក្តៅបរិសុទ្ធ។",
    },
  },
  {
    id: "hot-mocha",
    name: { en: "Hot Caffe Mocha", km: "ម៉ូកាក្តៅ" },
    category: "hotCoffee",
    price: 4.0,
    sku: "HCOF-006",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1607681034540-2c46cc71896d?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Rich dark chocolate with steamed milk, espresso, and cocoa dusting.",
      km: "សូកូឡាខ្មៅ ជាមួយទឹកដោះគោក្តៅ និងអេសប្រេសូ។",
    },
  },
  {
    id: "cortado",
    name: { en: "Spanish Cortado", km: "កូតាដូ" },
    category: "hotCoffee",
    price: 3.25,
    sku: "HCOF-007",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1585494156145-1c60a4fe9d2b?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "A 1:1 balance of strong espresso and warm textured milk.",
      km: "អេសប្រេសូ និងទឹកដោះគោក្តៅក្នុងសមាមាត្រស្មើគ្នា។",
    },
  },

  // ==================== TEA ====================
  {
    id: "matcha-latte",
    name: { en: "Uji Matcha Latte", km: "អ៊ូជី ម៉ាត់ឆាឡាតេ" },
    category: "tea",
    price: 4.0,
    favorite: true,
    bestSeller: true,
    sku: "TEA-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1536013561539-6adbb0ddae67?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Ceremonial Japanese Uji green tea whisked with creamy steamed milk.",
      km: "តែបៃតងអ៊ូជីជប៉ុន វាយជាមួយទឹកដោះគោទន់រលោង។",
    },
  },
  {
    id: "chamomile-tea",
    name: { en: "Chamomile Blossom Tea", km: "តែផ្កាខាម៉ូម៉ាយល៍" },
    category: "tea",
    price: 2.75,
    favorite: true,
    sku: "TEA-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Naturally caffeine-free herbal tea with floral notes of Egyptian chamomile.",
      km: "តែរុក្ខជាតិធម្មជាតិ គ្មានជាតិកាហ្វេអ៊ីន ក្លិនផ្កាឈ្ងុយ។",
    },
  },
  {
    id: "peach-green-tea",
    name: { en: "Peach Blossom Green Tea", km: "តែបៃតងផ្លែប៉េស" },
    category: "tea",
    price: 3.5,
    bestSeller: true,
    sku: "TEA-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Jasmine green tea infused with sweet white peach syrup and crystal jelly.",
      km: "តែបៃតងផ្កាម្លិះ ជាមួយរសជាតិផ្លែប៉េសផ្អែមស្រស់។",
    },
  },
  {
    id: "jasmine-milk-tea",
    name: { en: "Jasmine Milk Tea", km: "តែទឹកដោះគោផ្កាម្លិះ" },
    category: "tea",
    price: 3.75,
    favorite: true,
    sku: "TEA-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Fragrant jasmine tea brewed fresh with creamy New Zealand milk.",
      km: "តែផ្កាម្លិះឈ្ងុយ ជាមួយទឹកដោះគោញូវហ្សេឡែន។",
    },
  },
  {
    id: "thai-iced-tea",
    name: { en: "Original Thai Iced Tea", km: "តែទឹកដោះគោថៃ" },
    category: "tea",
    price: 3.25,
    bestSeller: true,
    sku: "TEA-005",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Spiced Ceylon black tea poured over sweet condensed milk and ice.",
      km: "តែខ្មៅសីឡូនបែបថៃ ជាមួយទឹកដោះគោខាប់ និងទឹកកក។",
    },
  },
  {
    id: "lemon-iced-tea",
    name: { en: "Honey Lemon Iced Tea", km: "តែក្រូចឆ្មាទឹកឃ្មុំ" },
    category: "tea",
    price: 3.0,
    sku: "TEA-006",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Refreshing black tea sweetened with wild honey and fresh lemon slices.",
      km: "តែខ្មៅស្រស់ ជាមួយទឹកឃ្មុំព្រៃ និងចំណិតក្រូចឆ្មា។",
    },
  },

  // ==================== SMOOTHIE & FRAPPE ====================
  {
    id: "mango-passion-smoothie",
    name: { en: "Mango Passion Smoothie", km: "ស្វាយផាសិនក្រឡុក" },
    category: "smoothie",
    price: 4.25,
    favorite: true,
    bestSeller: true,
    sku: "SMO-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Tropical ripe mango blended with tart passionfruit and Greek yogurt.",
      km: "ស្វាយទុំត្រូពិច ក្រឡុកជាមួយផ្លែផាសិន និងយ៉ាអួរក្រិក។",
    },
  },
  {
    id: "strawberry-banana-smoothie",
    name: { en: "Strawberry Banana Smoothie", km: "ស្ត្របឺរីចេកក្រឡុក" },
    category: "smoothie",
    price: 4.5,
    bestSeller: true,
    sku: "SMO-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Fresh organic strawberries and ripe bananas blended with whole milk.",
      km: "ស្ត្របឺរីស្រស់ និងចេកទុំ ក្រឡុកជាមួយទឹកដោះគោសុទ្ធ។",
    },
  },
  {
    id: "avocado-coffee-frappe",
    name: { en: "Avocado Coffee Frappe", km: "បឺកាហ្វេក្រឡុក" },
    category: "smoothie",
    price: 4.75,
    favorite: true,
    sku: "SMO-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Creamy fresh avocado blended with espresso and chocolate drizzle.",
      km: "ផ្លែបឺស្រស់ក្រឡុក ជាមួយកាហ្វេអេសប្រេសូ និងសូកូឡា។",
    },
  },
  {
    id: "chocolate-chip-frappe",
    name: { en: "Java Chip Mocha Frappe", km: "ឈូកូឡាតឈីបក្រឡុក" },
    category: "smoothie",
    price: 4.5,
    sku: "SMO-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Rich coffee frappe with crunchy chocolate chips and whipped cream.",
      km: "កាហ្វេក្រឡុកជាមួយគ្រាប់សូកូឡាស្រួយ និងក្រែមវីប។",
    },
  },

  // ==================== FRESH JUICE & SODA ====================
  {
    id: "fresh-orange-juice",
    name: { en: "100% Squeezed Orange Juice", km: "ទឹកក្រូចច្របាច់ស្រស់" },
    category: "juice",
    price: 3.5,
    bestSeller: true,
    sku: "JUI-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Pure cold-pressed Valencia oranges without added sugar or water.",
      km: "ទឹកក្រូចវ៉ាឡេនស៊ីយ៉ាច្របាច់ស្រស់ ១០០% គ្មានលាយស្ករ។",
    },
  },
  {
    id: "watermelon-cooler",
    name: { en: "Watermelon Mint Cooler", km: "ទឹកឪឡឹកស្លឹកជីរអង្កាម" },
    category: "juice",
    price: 3.25,
    favorite: true,
    sku: "JUI-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Fresh sweet watermelon juice with a hint of fresh mint and lime.",
      km: "ទឹកឪឡឹកផ្អែមស្រស់ លាយជាមួយជីរអង្កាម និងក្រូចឆ្មា។",
    },
  },
  {
    id: "green-detox-juice",
    name: { en: "Green Goddess Detox", km: "ទឹកបន្លែផ្លែឈើបៃតង" },
    category: "juice",
    price: 4.0,
    sku: "JUI-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Cold-pressed green apple, crisp cucumber, celery, kale, and ginger.",
      km: "ផ្លែប៉ោមបៃតង ត្រសក់ ស្ពៃខៀវ និងខ្ញី ច្របាច់ស្រស់។",
    },
  },
  {
    id: "sparkling-yuzu-lemonade",
    name: { en: "Sparkling Yuzu Soda", km: "សូដាក្រូចយូហ្ស៊ូ" },
    category: "juice",
    price: 3.75,
    favorite: true,
    sku: "JUI-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Japanese yuzu puree topped with effervescent sparkling mineral water.",
      km: "ផ្លែក្រូចយូហ្ស៊ូជប៉ុន ជាមួយទឹកសូដាផ្កាយរំលេចស្រស់ស្រាយ។",
    },
  },

  // ==================== BREAKFAST & BRUNCH ====================
  {
    id: "avocado-sourdough-toast",
    name: { en: "Avocado Sourdough Toast", km: "នំប៉័ងសួរដូផ្លែបឺ" },
    category: "breakfast",
    price: 5.5,
    favorite: true,
    bestSeller: true,
    sku: "BRK-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Smashed Hass avocado on toasted sourdough with poached egg and chili flakes.",
      km: "ផ្លែបឺកិនលើនំប៉័ងសួរដូដុតស្រួយ ជាមួយពងមាន់ទឹក និងម្ទេសគ្រើម។",
    },
  },
  {
    id: "classic-eggs-benedict",
    name: { en: "Eggs Benedict", km: "អ៊ិចបេណេឌិក" },
    category: "breakfast",
    price: 6.25,
    bestSeller: true,
    sku: "BRK-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "English muffins topped with smoked ham, poached eggs, and silky Hollandaise.",
      km: "នំប៉័ងអង់គ្លេសជាមួយសាច់ហាំ ពងមាន់ទឹក និងទឹកជ្រលក់ហូឡង់ដែស។",
    },
  },
  {
    id: "croissant-egg-bacon",
    name: { en: "Bacon & Egg Croissant", km: "ក្រូសង់ពងមាន់សាច់បែកខន" },
    category: "breakfast",
    price: 4.75,
    favorite: true,
    sku: "BRK-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Warm butter croissant packed with crispy smoked bacon, scrambled eggs, and cheddar.",
      km: "នំក្រូសង់ប៊ឺក្តៅៗ ជាមួយសាច់បែកខន ពងមាន់ក្រឡុក និងឈីសឆេដា។",
    },
  },
  {
    id: "granola-berry-parfait",
    name: { en: "Greek Yogurt Berry Parfait", km: "យ៉ាអួរក្រិកគ្រាប់ធញ្ញជាតិ" },
    category: "breakfast",
    price: 4.25,
    sku: "BRK-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Layers of creamy Greek yogurt, organic roasted honey granola, and mixed berries.",
      km: "យ៉ាអួរក្រិក លាយជាមួយគ្រាប់ធញ្ញជាតិដុតទឹកឃ្មុំ និងផ្លែបឺរីចម្រុះ។",
    },
  },

  // ==================== SANDWICHES & WRAPS ====================
  {
    id: "smoked-salmon-bagel",
    name: { en: "Smoked Salmon Bagel", km: "បេហ្គលត្រីសាល់ម៉ុងផ្សែង" },
    category: "sandwich",
    price: 5.75,
    favorite: true,
    bestSeller: true,
    sku: "SND-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Toasted everything bagel, cream cheese, Norwegian smoked salmon, capers, and dill.",
      km: "នំប៉័ងបេហ្គលដុត ជាមួយត្រីសាល់ម៉ុងន័រវែស ក្រែមឈីស និងស្លឹកជីរ។",
    },
  },
  {
    id: "truffle-beef-panini",
    name: { en: "Truffle Beef Panini", km: "ផានីនីសាច់គោត្រាហ្វល" },
    category: "sandwich",
    price: 6.5,
    bestSeller: true,
    sku: "SND-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Thinly sliced roast beef, melted provolone, caramelized onions, and black truffle mayo.",
      km: "សាច់គោអាំងស្តើងៗ ឈីសប្រូវ៉ូឡូន ខ្ទឹមបារាំងកាម៉េល និងម៉ាយ៉ូណេសត្រាហ្វល។",
    },
  },
  {
    id: "grilled-chicken-pesto-panini",
    name: { en: "Chicken Pesto Panini", km: "ផានីនីសាច់មាន់ប៉េស្តូ" },
    category: "sandwich",
    price: 5.25,
    favorite: true,
    sku: "SND-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Herb grilled chicken breast, fresh mozzarella, sun-dried tomatoes, and basil pesto.",
      km: "សាច់មាន់អាំងគ្រឿងទេស ឈីសម៉ូហ្សារ៉េឡា ប៉េងប៉ោះក្រៀម និងទឹកជ្រលក់ប៉េស្តូ។",
    },
  },
  {
    id: "classic-club-sandwich",
    name: { en: "Triple Decker Club Sandwich", km: "ក្លឹបសាំងវិចបីជាន់" },
    category: "sandwich",
    price: 5.0,
    sku: "SND-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Turkey breast, crispy bacon, crisp iceberg lettuce, tomato, and dijonnaise.",
      km: "សាច់ទួរគី សាច់បែកខនស្រួយ សាឡាត់ ប៉េងប៉ោះ និងទឹកជ្រលក់ឌីហ្សុន។",
    },
  },

  // ==================== BAKERY ====================
  {
    id: "croissant",
    name: { en: "French Butter Croissant", km: "នំក្រូសង់ប៊ឺបារាំង" },
    category: "bakery",
    price: 2.5,
    favorite: true,
    bestSeller: true,
    sku: "BAK-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Authentic laminated pastry baked golden brown with French butter.",
      km: "នំក្រូសង់ប៊ឺបារាំងពិតៗ ស្រួយក្រៅទន់ក្នុង ក្លិនឈ្ងុយប៊ឺ។",
    },
  },
  {
    id: "pain-au-chocolat",
    name: { en: "Pain au Chocolat", km: "ក្រូសង់សូកូឡា" },
    category: "bakery",
    price: 3.25,
    favorite: true,
    sku: "BAK-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Flaky pastry folded around two bars of rich dark Belgian chocolate.",
      km: "នំស្រួយបត់ជាមួយសូកូឡាបែលហ្ស៊ិកខ្មៅរសជាតិដើម។",
    },
  },
  {
    id: "almond-croissant",
    name: { en: "Toasted Almond Croissant", km: "ក្រូសង់គ្រាប់អាល់ម៉ុន" },
    category: "bakery",
    price: 3.75,
    bestSeller: true,
    sku: "BAK-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Filled with almond frangipane cream and topped with sliced toasted almonds.",
      km: "ស្នូលក្រែមគ្រាប់អាល់ម៉ុន និងរោយបន្ទះអាល់ម៉ុនអាំងឈ្ងុយ។",
    },
  },
  {
    id: "cinnamon-roll",
    name: { en: "Glazed Cinnamon Roll", km: "នំស៊ីណាម៉ុនរមៀល" },
    category: "bakery",
    price: 3.5,
    favorite: true,
    sku: "BAK-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Warm spiral dough swirled with Korintje cinnamon and cream cheese glaze.",
      km: "ម្សៅរមៀលជាមួយម្សៅក្រវាញស៊ីណាម៉ុន និងស្រោបដោយក្រែមឈីស។",
    },
  },
  {
    id: "blueberry-muffin",
    name: { en: "Wild Blueberry Muffin", km: "នំម៉ាហ្វិនប្លូបឺរី" },
    category: "bakery",
    price: 3.0,
    sku: "BAK-005",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Moist bakery muffin bursting with fresh blueberries and sugar crust.",
      km: "នំម៉ាហ្វិនទន់ល្មើយ បង្កប់ដោយផ្លែប្លូបឺរីស្រស់។",
    },
  },

  // ==================== DESSERT ====================
  {
    id: "strawberry-cake",
    name: { en: "Strawberry Shortcake", km: "នំខេកស្ត្របឺរី" },
    category: "dessert",
    price: 4.5,
    bestSeller: true,
    sku: "DES-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Light sponge cake layered with fresh whipped cream and ripe strawberries.",
      km: "នំខេកទន់ស្រាល លាយជាមួយក្រែមស្រស់ និងផ្លែស្ត្របឺរីទុំ។",
    },
  },
  {
    id: "basque-cheesecake",
    name: { en: "Basque Burnt Cheesecake", km: "នំឈីសខេកបាសក៍" },
    category: "dessert",
    price: 5.0,
    favorite: true,
    bestSeller: true,
    sku: "DES-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Caramelized exterior with an ultra-creamy, molten cheese interior.",
      km: "ស្បែកខាងក្រៅឆេះកាម៉េលឈ្ងុយ ខាងក្នុងទន់រលាយ។",
    },
  },
  {
    id: "tiramisu",
    name: { en: "Classic Italian Tiramisu", km: "ទីរ៉ាមីស៊ូអ៊ីតាលី" },
    category: "dessert",
    price: 4.75,
    favorite: true,
    sku: "DES-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.",
      km: "នំឡាឌីហ្វីងហ្គឺត្រាំកាហ្វេអេសប្រេសូ ជាមួយក្រែមម៉ាស្កាផូន។",
    },
  },
  {
    id: "fudgy-brownie",
    name: { en: "Double Dark Chocolate Brownie", km: "នំប៊្រោននីសូកូឡាខ្មៅ" },
    category: "dessert",
    price: 3.25,
    sku: "DES-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Dense fudgy chocolate brownie baked with 70% dark chocolate chunks.",
      km: "នំប៊្រោននីសូកូឡាខ្មៅ ៧០% រសជាតិដិតជាប់មាត់។",
    },
  },

  // ==================== SNACKS & BITES ====================
  {
    id: "truffle-parmesan-fries",
    name: { en: "Truffle Parmesan Fries", km: "ដំឡូងបារាំងបំពងត្រាហ្វល" },
    category: "snack",
    price: 3.75,
    favorite: true,
    bestSeller: true,
    sku: "SNK-001",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Crispy shoestring fries tossed in white truffle oil, rosemary, and aged parmesan.",
      km: "ដំឡូងបារាំងបំពងស្រួយ លាយប្រេងត្រាហ្វលស ស្លឹកស្រល់ និងឈីសផាម៉េសាន។",
    },
  },
  {
    id: "crispy-chicken-tenders",
    name: { en: "Crispy Chicken Tenders", km: "សាច់មាន់បំពងស្រួយ" },
    category: "snack",
    price: 4.5,
    bestSeller: true,
    sku: "SNK-002",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Golden hand-breaded chicken breast tenderloins served with honey mustard dip.",
      km: "សាច់ទ្រូងមាន់បំពងពណ៌មាសស្រួយ ជាមួយទឹកជ្រលក់ម៉ាស្តាតទឹកឃ្មុំ។",
    },
  },
  {
    id: "cheesy-nachos",
    name: { en: "Loaded Cheddar Nachos", km: "ណាឆូសស្រោបឈីស" },
    category: "snack",
    price: 4.25,
    sku: "SNK-003",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Warm corn tortilla chips smothered in melted cheddar, jalapeños, and salsa.",
      km: "បន្ទះពោតបំពងស្រួយ ស្រោបដោយឈីសឆេដារលាយ ម្ទេសហាឡាភីណូ និងសាល់សា។",
    },
  },
  {
    id: "garlic-butter-edamame",
    name: { en: "Garlic Butter Edamame", km: "សណ្តែកសណ្តែកអេដាម៉ាម៉េ" },
    category: "snack",
    price: 3.25,
    sku: "SNK-004",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    description: {
      en: "Steamed Japanese green soybeans wok-tossed with roasted garlic and sea salt.",
      km: "សណ្តែកសៀងបៃតងជប៉ុន ចំហុយឆាជាមួយខ្ទឹមសឈ្ងុយ និងអំបិលសមុទ្រ។",
    },
  },
];

export const initialOrderItems: OrderItem[] = [
  {
    id: "iced-latte-medium-regularIce-lessSugar",
    productId: "iced-latte",
    quantity: 1,
    size: "medium",
    ice: "regularIce",
    sweetness: "lessSugar",
    addOns: [],
  },
  {
    id: "croissant-medium-regularSugar",
    productId: "croissant",
    quantity: 2,
    size: "medium",
    sweetness: "regularSugar",
    addOns: [],
  },
  {
    id: "biscoff-cookie-latte-large-regularIce-lessSugar-whippedCream",
    productId: "biscoff-cookie-latte",
    quantity: 1,
    size: "large",
    ice: "regularIce",
    sweetness: "lessSugar",
    addOns: ["whippedCream"],
  },
];

// Helper functions for catalog queries
export const getProduct = (productId: string): Product | undefined =>
  products.find((product) => product.id === productId);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  products.filter((product) => product.category === category);

export const getFavoriteProducts = (): Product[] =>
  products.filter((product) => product.favorite);

export const getBestSellerProducts = (): Product[] =>
  products.filter((product) => product.bestSeller);
