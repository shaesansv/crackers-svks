export interface Product {
  id: string;
  name: string;
  unit: string;
  actualPrice: number;
  discountPrice: number;
  imageType: 'sparkler' | 'pot' | 'chakkar' | 'bomb' | 'kids' | 'garland' | 'rocket';
}

export interface Category {
  id: string;
  name: string;
  discountText: string;
  products: Product[];
}

export const crackerCategories: Category[] = [
  {
    id: 'sparklers',
    name: 'SPARKLERS (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'sp1', name: '7 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 100, discountPrice: 20, imageType: 'sparkler' },
      { id: 'sp2', name: '10 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 150, discountPrice: 30, imageType: 'sparkler' },
      { id: 'sp3', name: '12 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 200, discountPrice: 40, imageType: 'sparkler' },
      { id: 'sp4', name: '15 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 300, discountPrice: 60, imageType: 'sparkler' },
      { id: 'sp5', name: '30 cm Sparklers (5 Pcs)', unit: 'Pkt', actualPrice: 450, discountPrice: 90, imageType: 'sparkler' },
      { id: 'sp6', name: '50 cm Sparklers (5 Pcs)', unit: 'Pkt', actualPrice: 600, discountPrice: 120, imageType: 'sparkler' },
    ]
  },
  {
    id: 'flowerpots',
    name: 'FLOWER POTS (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'fp1', name: 'Flower Pots Small (10 Pcs)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'pot' },
      { id: 'fp2', name: 'Flower Pots Medium (10 Pcs)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'pot' },
      { id: 'fp3', name: 'Flower Pots Large (10 Pcs)', unit: 'Box', actualPrice: 400, discountPrice: 80, imageType: 'pot' },
      { id: 'fp4', name: 'Flower Pots Giant (10 Pcs)', unit: 'Box', actualPrice: 500, discountPrice: 100, imageType: 'pot' },
      { id: 'fp5', name: 'Flower Pots Deluxe (10 Pcs)', unit: 'Box', actualPrice: 700, discountPrice: 140, imageType: 'pot' },
      { id: 'fp6', name: 'Flower Pots Super Deluxe (10 Pcs)', unit: 'Box', actualPrice: 900, discountPrice: 180, imageType: 'pot' },
    ]
  },
  {
    id: 'chakkars',
    name: 'GROUND CHAKKARS (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'gc1', name: 'Ground Chakkar Small (10 Pcs)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'chakkar' },
      { id: 'gc2', name: 'Ground Chakkar Medium (10 Pcs)', unit: 'Box', actualPrice: 250, discountPrice: 50, imageType: 'chakkar' },
      { id: 'gc3', name: 'Ground Chakkar Large (10 Pcs)', unit: 'Box', actualPrice: 350, discountPrice: 70, imageType: 'chakkar' },
      { id: 'gc4', name: 'Ground Chakkar Special (10 Pcs)', unit: 'Box', actualPrice: 450, discountPrice: 90, imageType: 'chakkar' },
      { id: 'gc5', name: 'Ground Chakkar Deluxe (10 Pcs)', unit: 'Box', actualPrice: 600, discountPrice: 120, imageType: 'chakkar' },
    ]
  },
  {
    id: 'bombs',
    name: 'BOMBS & SOUND CRACKERS (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'bm1', name: '2-3/4" Laxmi Brand (1 Box)', unit: 'Box', actualPrice: 100, discountPrice: 20, imageType: 'bomb' },
      { id: 'bm2', name: '3-1/2" Laxmi Brand (1 Box)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'bomb' },
      { id: 'bm3', name: '4" Laxmi Bomb (1 Box)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'bomb' },
      { id: 'bm4', name: '5" Laxmi Bomb (1 Box)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'bomb' },
      { id: 'bm5', name: '2 Sound Bomb (1 Box)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'bomb' },
      { id: 'bm6', name: '3 Sound Bomb (1 Box)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'bomb' },
    ]
  },
  {
    id: 'kids',
    name: 'KIDS SPECIAL (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'kd1', name: 'Magic Pops (50 Pcs)', unit: 'Pkt', actualPrice: 100, discountPrice: 20, imageType: 'kids' },
      { id: 'kd2', name: 'Snake Crackers (10 Pcs)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'kids' },
      { id: 'kd3', name: 'Pencil 7" (10 Pcs)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'kids' },
      { id: 'kd4', name: 'Pencil 10" (10 Pcs)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'kids' },
      { id: 'kd5', name: 'Color Smoke (1 Box)', unit: 'Box', actualPrice: 500, discountPrice: 100, imageType: 'kids' },
    ]
  },
  {
    id: 'garlands',
    name: 'SOUND GARLANDS (80% DISCOUNT)',
    discountText: '80% DISCOUNT',
    products: [
      { id: 'gl1', name: 'Garland 100 Shells (1 Box)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'garland' },
      { id: 'gl2', name: 'Garland 1000 Shells (1 Box)', unit: 'Box', actualPrice: 1500, discountPrice: 300, imageType: 'garland' },
      { id: 'gl3', name: 'Garland 2000 Shells (1 Box)', unit: 'Box', actualPrice: 2800, discountPrice: 560, imageType: 'garland' },
      { id: 'gl4', name: 'Garland 5000 Shells (1 Box)', unit: 'Box', actualPrice: 6000, discountPrice: 1200, imageType: 'garland' },
      { id: 'gl5', name: 'Garland 10000 Shells (1 Box)', unit: 'Box', actualPrice: 11000, discountPrice: 2200, imageType: 'garland' },
    ]
  }
];
