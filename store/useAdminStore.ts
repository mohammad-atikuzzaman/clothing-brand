import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS, HERO_SLIDES, Product } from "@/data/products";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "cod" | "bkash";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  discount: string;
  buttonText: string;
  link: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  hotline: string;
  whatsapp: string;
  email: string;
  address: string;
  operatingHours: string;
  shippingDhaka: number;
  shippingOutside: number;
  bkashNumber: string;
  facebookUrl: string;
  instagramUrl: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  message: string;
  createdAt: string;
  status: "Unread" | "Replied" | "Archived";
}

interface AdminState {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  toggleFeatured: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (orderData: Omit<Order, "id" | "createdAt" | "status"> & { id?: string }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Banners & Content
  banners: BannerSlide[];
  addBanner: (banner: Omit<BannerSlide, "id">) => void;
  updateBanner: (id: string, updated: Partial<BannerSlide>) => void;
  deleteBanner: (id: string) => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Contact Inquiries
  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, "id" | "createdAt" | "status">) => void;
  updateMessageStatus: (id: string, status: ContactMessage["status"]) => void;
  deleteMessage: (id: string) => void;

  // Quick reset to defaults if needed
  resetToDefaults: () => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "IZH-829104",
    customerName: "Tanvir Ahmed",
    phone: "01712345678",
    address: "House 24, Road 7, Sector 3, Uttara",
    district: "Dhaka",
    notes: "Please call before delivery",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Premium Panjabi P-529",
        slug: "premium-panjabi-p-529",
        image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
        price: 1799,
        selectedSize: "42",
        quantity: 1,
      },
    ],
    subtotal: 1799,
    shippingCost: 70,
    total: 1869,
    paymentMethod: "cod",
    status: "Processing",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "IZH-749201",
    customerName: "Mahbubur Rahman",
    phone: "01823456789",
    address: "GEC Circle, Nasirabad Housing",
    district: "Chittagong",
    items: [
      {
        id: "item-2",
        productId: "prod-2",
        name: "Premium Panjabi P-605",
        slug: "premium-panjabi-p-605",
        image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg",
        price: 1799,
        selectedSize: "40",
        quantity: 2,
      },
    ],
    subtotal: 3598,
    shippingCost: 130,
    total: 3728,
    paymentMethod: "bkash",
    status: "Shipped",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "IZH-938211",
    customerName: "Kazi Farhan",
    phone: "01934567890",
    address: "Zindabazar, Ambarkhana Point",
    district: "Sylhet",
    items: [
      {
        id: "item-3",
        productId: "prod-3",
        name: "Smart Casual Panjabi P-582",
        slug: "smart-casual-panjabi-p-582",
        image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg",
        price: 1499,
        selectedSize: "44",
        quantity: 1,
      },
    ],
    subtotal: 1499,
    shippingCost: 130,
    total: 1629,
    paymentMethod: "cod",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "IZH-618492",
    customerName: "Sabbir Hossain",
    phone: "01645678901",
    address: "Dhanmondi 27, Rapa Plaza area",
    district: "Dhaka",
    items: [
      {
        id: "item-4",
        productId: "prod-5",
        name: "Festive Embroidered Panjabi P-612",
        slug: "festive-embroidered-panjabi-p-612",
        image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
        price: 2199,
        selectedSize: "42",
        quantity: 1,
      },
    ],
    subtotal: 2199,
    shippingCost: 70,
    total: 2269,
    paymentMethod: "cod",
    status: "Delivered",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: "Izhaan Lifestyle",
  tagline: "Wear the heritage. Own the trend.",
  hotline: "01811-496175",
  whatsapp: "+8801811496175",
  email: "izhaanlifestyle@gmail.com",
  address: "Uttara / Dakshinkhan, Dhaka, Bangladesh",
  operatingHours: "10:00 AM – 10:00 PM (Everyday)",
  shippingDhaka: 70,
  shippingOutside: 130,
  bkashNumber: "01811-496175 (Merchant)",
  facebookUrl: "https://facebook.com/izhaanlifestyle",
  instagramUrl: "https://instagram.com/izhaanlifestyle",
};

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Rahim Uddin",
    email: "rahim.bd@gmail.com",
    phone: "01755123456",
    company: "Individual",
    message: "Do you offer custom tailoring for size 48 in the Signature Line P-529?",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "Unread",
  },
  {
    id: "msg-2",
    name: "Tasnim Chowdhury",
    email: "tasnim.chy@gmail.com",
    phone: "01819988776",
    message: "I want to purchase 15 pieces for corporate Eid gifting. Do you provide wholesale corporate discounts?",
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    status: "Replied",
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      orders: INITIAL_ORDERS,
      banners: HERO_SLIDES,
      settings: INITIAL_SETTINGS,
      messages: INITIAL_MESSAGES,

      // Products CRUD
      addProduct: (newProd) => {
        const id = `prod-${Date.now()}`;
        const product: Product = { ...newProd, id };
        set((state) => ({ products: [product, ...state.products] }));
      },

      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleStock: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, inStock: !p.inStock } : p
          ),
        }));
      },

      toggleFeatured: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          ),
        }));
      },

      // Orders CRUD
      addOrder: (orderData) => {
        const generatedId = orderData.id || `IZH-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: Order = {
          ...orderData,
          id: generatedId,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
        }));
      },

      // Banners
      addBanner: (bannerData) => {
        const id = `slide-${Date.now()}`;
        set((state) => ({ banners: [...state.banners, { ...bannerData, id }] }));
      },

      updateBanner: (id, updated) => {
        set((state) => ({
          banners: state.banners.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        }));
      },

      deleteBanner: (id) => {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
      },

      // Settings
      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
      },

      // Inquiries
      addMessage: (msgData) => {
        const id = `msg-${Date.now()}`;
        const newMsg: ContactMessage = {
          ...msgData,
          id,
          createdAt: new Date().toISOString(),
          status: "Unread",
        };
        set((state) => ({ messages: [newMsg, ...state.messages] }));
      },

      updateMessageStatus: (id, status) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, status } : m)),
        }));
      },

      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },

      // Reset
      resetToDefaults: () => {
        set({
          products: PRODUCTS,
          orders: INITIAL_ORDERS,
          banners: HERO_SLIDES,
          settings: INITIAL_SETTINGS,
          messages: INITIAL_MESSAGES,
        });
      },
    }),
    {
      name: "izhaan-admin-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
