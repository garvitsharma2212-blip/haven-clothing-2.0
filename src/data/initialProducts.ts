import { Product } from '../types';

// All mock/dummy products removed as requested
export const INITIAL_PRODUCTS: Product[] = [];

export const CATEGORIES_DATA = [
  {
    id: 'all',
    slug: 'all',
    name: 'Shop All',
    subtitle: 'The Complete HAVEN Collection',
    description: 'Everyday elevated essentials engineered for comfort, simplicity and presence.',
    image: '/card-oversized.jpg'
  },
  {
    id: 'oversized-t-shirts',
    slug: 'oversized-t-shirts',
    name: 'Oversized T-Shirts',
    subtitle: 'Heavyweight Drop-Shoulder Silhouettes',
    description: '240–260 GSM combed cotton tees with tailored drop-shoulders and resilient collars.',
    image: '/card-oversized.jpg'
  },
  {
    id: 'waffle-t-shirts',
    slug: 'waffle-t-shirts',
    name: 'Waffle Collection',
    subtitle: 'Tactile Honeycomb Knit Essentials',
    description: 'Textured micro-honeycomb waffle tees engineered for year-round breathability and depth.',
    image: '/card-waffle.jpg'
  },
  {
    id: 'sweatshirts',
    slug: 'sweatshirts',
    name: 'Sweatshirts',
    subtitle: '380–400 GSM Heavy French Terry',
    description: 'Substantial loopback and brushed fleece sweaters crafted for warmth, durability, and quiet luxury.',
    image: '/card-sweatshirts.jpg'
  }
];
