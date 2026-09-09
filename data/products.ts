export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Signature Line" | "Core Classics" | "Smart Casuals" | "ZAQWAN" | "Price 990 - 999" | string;
  categorySlug: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  image: string;
  galleryImages: string[];
  inStock: boolean;
  featured: boolean;
  sizes: string[];
  description: string;
  fabric: string;
  fit: string;
  sku: string;
  rating: number;
  reviewsCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Premium Panjabi P-529",
    slug: "premium-panjabi-p-529",
    category: "Signature Line",
    categorySlug: "signature-line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg",
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44", "46"],
    description: "Crafted with refined combed cotton blend jacquard weave, offering exceptional drape, subtle sheen, and bespoke metallic buttons with precise placket finishing.",
    fabric: "100% Premium Combed Cotton Jacquard",
    fit: "Semi-Slim Fit",
    sku: "IZH-P529",
    rating: 5,
    reviewsCount: 14
  },
  {
    id: "prod-2",
    name: "Premium Panjabi P-605",
    slug: "premium-panjabi-p-605",
    category: "Signature Line",
    categorySlug: "signature-line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg",
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Intricately detailed minimalist band collar Panjabi tailored for festive evenings, Jummah prayers, and grand traditional ceremonies.",
    fabric: "Luxury Silk-Cotton Blend",
    fit: "Regular Fit",
    sku: "IZH-P605",
    rating: 4.9,
    reviewsCount: 9
  },
  {
    id: "prod-3",
    name: "Premium Panjabi P-606",
    slug: "premium-panjabi-p-606",
    category: "Signature Line",
    categorySlug: "signature-line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg",
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.37-PM-1-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44", "46"],
    description: "Deep tone Panjabi with exquisite tonal embroidery along the placket and collar, designed to make a stately and unforgettable impression.",
    fabric: "Premium Micro-fiber Tropical Suiting",
    fit: "Semi-Slim Fit",
    sku: "IZH-P606",
    rating: 5,
    reviewsCount: 18
  },
  {
    id: "prod-4",
    name: "Premium Panjabi P-608",
    slug: "premium-panjabi-p-608",
    category: "Signature Line",
    categorySlug: "signature-line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.37-PM-1-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.37-PM-1-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["40", "42", "44"],
    description: "Luxurious texture with subtle matte-sheen highlights. Specially woven to ensure comfort in warmer seasons while maintaining royal elegance.",
    fabric: "100% Giza Cotton Blend",
    fit: "Tailored Slim Fit",
    sku: "IZH-P608",
    rating: 4.8,
    reviewsCount: 12
  },
  {
    id: "prod-5",
    name: "Core Classic Panjabi P-387",
    slug: "core-classic-panjabi-p-387",
    category: "Core Classics",
    categorySlug: "core-classics",
    regularPrice: 2999,
    salePrice: 1499,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-03-24-at-1.13.12-PM-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-03-24-at-1.13.12-PM-430x573.jpeg",
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "A timeless, breathable everyday Panjabi engineered for all-day comfort in Bangladesh's climate. Smooth texture and durable stitch quality.",
    fabric: "100% Breathable Egyptian Cotton",
    fit: "Regular Comfort Fit",
    sku: "IZH-P387",
    rating: 4.9,
    reviewsCount: 22
  },
  {
    id: "prod-6",
    name: "Core Classic Panjabi P-388",
    slug: "core-classic-panjabi-p-388",
    category: "Core Classics",
    categorySlug: "core-classics",
    regularPrice: 2999,
    salePrice: 1499,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-04-10-at-1.29.43-PM-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-04-10-at-1.29.43-PM-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44", "46"],
    description: "Traditional tailoring meets contemporary minimalism. Ideal for both daily prayer gatherings and family occasions.",
    fabric: "High-Count Cotton Weave",
    fit: "Regular Fit",
    sku: "IZH-P388",
    rating: 4.7,
    reviewsCount: 16
  },
  {
    id: "prod-7",
    name: "Smart Casual Panjabi SC-204",
    slug: "smart-casual-panjabi-sc-204",
    category: "Smart Casuals",
    categorySlug: "smart-casuals",
    regularPrice: 2799,
    salePrice: 1399,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/780660.webp",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/780660.webp"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Modern minimalist styling with lightweight fabric for informal gatherings, Friday prayers, office ethnic days, and outdoor celebrations.",
    fabric: "Soft Linen-Cotton Weave",
    fit: "Modern Slim Fit",
    sku: "IZH-SC204",
    rating: 4.8,
    reviewsCount: 19
  },
  {
    id: "prod-8",
    name: "ZAQWAN Royal Edition Z-401",
    slug: "zaqwan-royal-edition-z-401",
    category: "ZAQWAN",
    categorySlug: "zaqwan",
    regularPrice: 3999,
    salePrice: 1999,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44", "46"],
    description: "Exclusive luxury Panjabi featuring regal accents, mother of pearl snap buttons, and rich self-texture.",
    fabric: "Fine Slub Poly-Viscose Cotton",
    fit: "Tailored Fit",
    sku: "IZH-Z401",
    rating: 5,
    reviewsCount: 27
  },
  {
    id: "prod-9",
    name: "Special Deal Panjabi P-990",
    slug: "special-deal-panjabi-p-990",
    category: "Price 990 - 999",
    categorySlug: "price-990-999",
    regularPrice: 1999,
    salePrice: 990,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp"
    ],
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Special promotional edition Panjabi bringing Izhaan premium quality fabric and stitching at the best affordable price point in Bangladesh.",
    fabric: "100% Combed Cotton",
    fit: "Regular Fit",
    sku: "IZH-990",
    rating: 4.9,
    reviewsCount: 35
  },
  {
    id: "prod-10",
    name: "Urban Navy Panjabi UN-309",
    slug: "urban-navy-panjabi-un-309",
    category: "Smart Casuals",
    categorySlug: "smart-casuals",
    regularPrice: 2899,
    salePrice: 1449,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80"
    ],
    inStock: true,
    featured: false,
    sizes: ["38", "40", "42", "44"],
    description: "Deep midnight navy tone Panjabi tailored for contemporary fashion enthusiasts seeking understated refinement.",
    fabric: "Textured Cotton Slub",
    fit: "Slim Fit",
    sku: "IZH-UN309",
    rating: 4.8,
    reviewsCount: 11
  },
  {
    id: "prod-11",
    name: "Heritage White Classic P-108",
    slug: "heritage-white-classic-p-108",
    category: "Core Classics",
    categorySlug: "core-classics",
    regularPrice: 2599,
    salePrice: 1299,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=80"
    ],
    inStock: true,
    featured: false,
    sizes: ["38", "40", "42", "44"],
    description: "Crisp white ethnic staple with delicate self-weave embroidery along the collar and front button placket.",
    fabric: "Pure Cotton Voile",
    fit: "Regular Fit",
    sku: "IZH-P108",
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: "prod-12",
    name: "Festive Crimson Panjabi FC-502",
    slug: "festive-crimson-panjabi-fc-502",
    category: "Signature Line",
    categorySlug: "signature-line",
    regularPrice: 3799,
    salePrice: 1899,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg",
    galleryImages: [
      "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg"
    ],
    inStock: true,
    featured: true,
    sizes: ["40", "42", "44", "46"],
    description: "Vibrant festive shade with meticulous collar stitch detailing. Designed for weddings, Eid festivities, and special occasions.",
    fabric: "Blended Micro Poly-Cotton",
    fit: "Semi-Slim Fit",
    sku: "IZH-FC502",
    rating: 5,
    reviewsCount: 14
  }
];

export interface CategoryInfo {
  id: string;
  name: "Signature Line" | "Core Classics" | "Smart Casuals" | "ZAQWAN" | "Price 990 - 999";
  slug: string;
  image: string;
  tagline: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "cat-1",
    name: "Signature Line",
    slug: "signature-line",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
    tagline: "Exclusive & Grand",
    description: "Our crowning collection of bespoke Panjabis woven with premium jacquards, metallic accents, and handcrafted plackets."
  },
  {
    id: "cat-2",
    name: "Core Classics",
    slug: "core-classics",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
    tagline: "Timeless Tradition",
    description: "Essential ethnic wear made with 100% pure combed breathable cotton for everyday comfort and prayer wear."
  },
  {
    id: "cat-3",
    name: "Smart Casuals",
    slug: "smart-casuals",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/780660.webp",
    tagline: "Contemporary Comfort",
    description: "Modern minimalist Panjabis designed for the youth and modern gentlemen for informal gatherings and workwear."
  },
  {
    id: "cat-4",
    name: "ZAQWAN",
    slug: "zaqwan",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
    tagline: "Regal Heritage",
    description: "An elite limited-run series engineered for grand weddings and festival evenings."
  },
  {
    id: "cat-5",
    name: "Price 990 - 999",
    slug: "price-990-999",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
    tagline: "Flat Best Value Deal",
    description: "High quality Panjabis at unbeatable value across Bangladesh."
  }
];

export const HERO_SLIDES = [
  {
    id: "slide-1",
    title: "MENS PREMIUM",
    subtitle: "WEAR THE HERITAGE. OWN THE TREND.",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/Izhaan-web-Banner-1.webp",
    discount: "FLAT 50% OFF",
    buttonText: "SHOP NOW",
    link: "/shop"
  },
  {
    id: "slide-2",
    title: "EID & FESTIVE SPECIALS",
    subtitle: "ELEGANT CRAFTSMANSHIP & FINEST FABRICS",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/IZhaan-web-banner-2.webp",
    discount: "EXCLUSIVE LINE",
    buttonText: "EXPLORE COLLECTION",
    link: "/shop?category=Signature+Line"
  }
];

export const PANJABI_SIZE_CHART = [
  { size: "38", chest: '39"', length: '40"', sleeve: '24.5"', collar: '15.5"' },
  { size: "40", chest: '41"', length: '42"', sleeve: '25.0"', collar: '16.0"' },
  { size: "42", chest: '43"', length: '44"', sleeve: '25.5"', collar: '16.5"' },
  { size: "44", chest: '45"', length: '45"', sleeve: '26.0"', collar: '17.0"' },
  { size: "46", chest: '47"', length: '46"', sleeve: '26.5"', collar: '17.5"' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryOrSlug: string): Product[] {
  if (!categoryOrSlug || categoryOrSlug === "All") return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.category.toLowerCase() === categoryOrSlug.toLowerCase() ||
      p.categorySlug.toLowerCase() === categoryOrSlug.toLowerCase()
  );
}

export function getRelatedProducts(currentProductId: string, category: string, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== currentProductId && p.category === category
  ).slice(0, limit);
}
