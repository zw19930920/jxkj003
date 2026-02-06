
export interface Product3DConfig {
  modelUrl?: string;
  initialScale?: number;
  autoRotate?: boolean;
  centerOffset?: [number, number, number];
  environmentIntensity?: number;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  series: 'S' | 'M' | 'L';
  price?: string;
  showPrice?: boolean; // New field to toggle price visibility
  desc: string;
  description?: string;
  features?: string[];
  specs: {
    label: string;
    text: string;
  }[];
  image: string;
  threeDConfig?: Product3DConfig;
  showOnHome?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  // Updated source types to include all pages with forms
  source: 'Footer' | 'ContactPage' | 'CustomPage' | 'AboutPage' | 'ProductPage';
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface SiteConfig {
  siteName: string;
  seoTitle: string;
  seoDescription: string;
  logoUrl: string;
  contactEmail: string;
  address?: string; // New
  phone?: string;   // New
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface LocationItem {
  city: string;
  name: string;
  address: string;
  phone?: string; // New field for store phone number
  image: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface AboutPageData {
  heroVideoUrl?: string; // New video field
  vision?: ValueItem;
  mission?: ValueItem;
  timeline: TimelineItem[];
  locations: LocationItem[];
}

export interface FAQItem {
  id: number;
  q: string;
  a: string;
  img: string;
}

export interface CustomColor {
  id: string;
  name: string;
  hex: string;
}

export interface CustomConfigImage {
  id: string;
  sizeId: 'S' | 'M' | 'L';
  colorId: string;
  imageUrl: string;
}

export interface WhyCustomItem {
    id: string;
    icon: string; // Icon name e.g. 'Ruler'
    title: string;
    desc: string;
}

export interface CustomPageData {
  faqs: FAQItem[];
  colors: CustomColor[];
  configImages: CustomConfigImage[];
  whyCustomItems: WhyCustomItem[]; // New
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'master' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export enum MenuCategory {
  PRODUCTS = 'products',
  CUSTOM = 'custom',
  CONTACT = 'contact',
  ABOUT = 'about',
  NONE = 'none'
}

export interface TechLayer {
  id: number;
  title: string;
  description: string;
  color: string;
}