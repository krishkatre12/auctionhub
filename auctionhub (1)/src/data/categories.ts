import { Category } from '../types/auction';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    icon: 'Car',
    description: 'Classic cars, modern supercars, motorcycles, and luxury automobiles.'
  },
  {
    id: 'cat-art',
    name: 'Art & Paintings',
    slug: 'art',
    icon: 'Palette',
    description: 'Original canvas paintings, contemporary sculptures, and limited prints.'
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Cpu',
    description: 'Rare retro computing, high-fidelity audio equipment, and cameras.'
  },
  {
    id: 'cat-antiques',
    name: 'Antiques & Vintage',
    slug: 'antiques',
    icon: 'Hourglass',
    description: 'Historical artifacts, mid-century furniture, and heirloom curios.'
  },
  {
    id: 'cat-jewelry',
    name: 'Jewelry & Watches',
    slug: 'jewelry',
    icon: 'Gem',
    description: 'Swiss horology, diamond rings, rare gemstones, and fine necklaces.'
  },
  {
    id: 'cat-real-estate',
    name: 'Real Estate',
    slug: 'real-estate',
    icon: 'Building2',
    description: 'Architectural estates, private coastal villas, and prime plots.'
  },
  {
    id: 'cat-collectibles',
    name: 'Collectibles',
    slug: 'collectibles',
    icon: 'Trophy',
    description: 'Graded sports trading cards, rare comic books, and historical memorabilia.'
  }
];
