export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Signature Line" | "Core Classics" | "Smart Casuals" | "ZAQWAN";
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  image: string;
  hoverImage?: string;
  inStock: boolean;
  featured: boolean;
  sizes: string[];
  description: string;
  fabric: string;
  fit: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Premium Panjabi P-529",
    slug: "premium-panjabi-p-529",
    category: "Signature Line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Crafted with refined cotton blend jacquard weave, offering exceptional drape, subtle sheen, and bespoke metallic buttons.",
    fabric: "100% Premium Combed Cotton Jacquard",
    fit: "Semi-Slim Fit"
  },
  {
    id: "prod-2",
    name: "Premium Panjabi P-605",
    slug: "premium-panjabi-p-605",
    category: "Signature Line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-2-430x573.jpeg",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Intricately detailed minimalist band collar Panjabi tailored for festive evenings and traditional ceremonies.",
    fabric: "Luxury Silk-Cotton Blend",
    fit: "Regular Fit"
  },
  {
    id: "prod-3",
    name: "Premium Panjabi P-606",
    slug: "premium-panjabi-p-606",
    category: "Signature Line",
    regularPrice: 3599,
    salePrice: 1799,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-14-at-12.22.38-PM-1-430x573.jpeg",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Deep tone Panjabi with exquisite embroidery along the placket and collar, designed to make a stately impression.",
    fabric: "Premium Micro-fiber Tropical Suiting",
    fit: "Semi-Slim Fit"
  },
  {
    id: "prod-4",
    name: "Core Classic Panjabi CC-101",
    slug: "core-classic-panjabi-cc-101",
    category: "Core Classics",
    regularPrice: 2999,
    salePrice: 1499,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "A timeless, breathable everyday Panjabi engineered for comfort throughout the day in Bangladesh's climate.",
    fabric: "100% Breathable Egyptian Giza Cotton",
    fit: "Regular Comfort Fit"
  },
  {
    id: "prod-5",
    name: "Smart Casual Panjabi SC-204",
    slug: "smart-casual-panjabi-sc-204",
    category: "Smart Casuals",
    regularPrice: 2799,
    salePrice: 1399,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/780660.webp",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Modern minimalist styling with lightweight fabric for social gatherings, Friday prayers, and work wear.",
    fabric: "Soft Linen-Cotton Weave",
    fit: "Modern Slim Fit"
  },
  {
    id: "prod-6",
    name: "ZAQWAN Royal Edition Z-401",
    slug: "zaqwan-royal-edition-z-401",
    category: "ZAQWAN",
    regularPrice: 3999,
    salePrice: 1999,
    discountPercentage: 50,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
    inStock: true,
    featured: true,
    sizes: ["38", "40", "42", "44"],
    description: "Exclusive luxury Panjabi featuring regal accents, mother of pearl snap buttons, and rich texture.",
    fabric: "Fine Slub Poly-Viscose Cotton",
    fit: "Tailored Fit"
  },
  {
    id: "prod-7",
    name: "Heritage White Classic P-108",
    slug: "heritage-white-classic-p-108",
    category: "Core Classics",
    regularPrice: 2599,
    salePrice: 1299,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=80",
    inStock: true,
    featured: false,
    sizes: ["38", "40", "42", "44"],
    description: "Crisp white ethnic staple with delicate self-weave embroidery and unmatched comfort.",
    fabric: "Pure Cotton Voile",
    fit: "Regular Fit"
  },
  {
    id: "prod-8",
    name: "Urban Navy Panjabi UN-309",
    slug: "urban-navy-panjabi-un-309",
    category: "Smart Casuals",
    regularPrice: 2899,
    salePrice: 1449,
    discountPercentage: 50,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80",
    inStock: true,
    featured: false,
    sizes: ["38", "40", "42", "44"],
    description: "Deep midnight navy tone Panjabi tailored for contemporary fashion enthusiasts.",
    fabric: "Textured Cotton Slub",
    fit: "Slim Fit"
  }
];

export const CATEGORIES = [
  {
    id: "cat-1",
    name: "Signature Line",
    slug: "signature-line",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg",
    tagline: "Exclusive & Grand"
  },
  {
    id: "cat-2",
    name: "Core Classics",
    slug: "core-classics",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
    tagline: "Timeless Tradition"
  },
  {
    id: "cat-3",
    name: "Smart Casuals",
    slug: "smart-casuals",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/780660.webp",
    tagline: "Contemporary Comfort"
  }
];

export const HERO_SLIDES = [
  {
    id: "slide-1",
    title: "MENS PREMIUM",
    subtitle: "WEAR THE HERITAGE. OWN THE TREND.",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/Izhaan-web-Banner-1.webp",
    discount: "FLAT 50% OFF",
    buttonText: "SHOP NOW"
  },
  {
    id: "slide-2",
    title: "EID & FESTIVE SPECIALS",
    subtitle: "ELEGANT CRAFTSMANSHIP & FINEST FABRICS",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/IZhaan-web-banner-2.webp",
    discount: "EXCLUSIVE LINE",
    buttonText: "EXPLORE COLLECTION"
  }
];
