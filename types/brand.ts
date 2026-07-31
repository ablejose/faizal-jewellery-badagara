export interface StoryVideo {
  quote: string;
  description: string;
  video: string;
  segments?: VideoSegments;
}

export interface VideoSegments {
  startAt: number;
  loopEnd: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
}

export interface BrandConfig {
  businessName: string;
  tagline: string;
  description: string;

  logo: string;
  favicon: string;

  heroVideo: string;

  storyVideos: StoryVideo[];

  storeImages: string[];

  address: string;
  city: string;
  state: string;
  pincode: string;

  phone: string;
  whatsapp: string;
  email: string;

  mapsLink: string;

  openingHours: string;

  instagram: string;
  facebook: string;
  youtube?: string;

  seo: SeoConfig;

  faq: FaqItem[];

  whatsappMessage: string;
}
