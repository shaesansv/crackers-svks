import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

import Category from './models/Category.js';
import Product from './models/Product.js';

const assetsDir = path.resolve(__dirname, '../src/assets/sarguru bg removed');
const localUploadsDir = path.resolve(__dirname, 'public/uploads/products');
const frontendPublicDir = path.resolve(__dirname, '../public/uploads/products');

// Ensure local directories exist
fs.mkdirSync(localUploadsDir, { recursive: true });
fs.mkdirSync(frontendPublicDir, { recursive: true });

const categoriesDefinition = [
  {
    name: 'Sparklers',
    categoryCode: '100',
    icon: 'sparkles',
    displayOrder: 1,
    description: 'Hand-held sparkling fireworks in dazzling gold, silver, green, and red.'
  },
  {
    name: 'Ground Chakkars & Spinners',
    categoryCode: '110',
    icon: 'rotate-cw',
    displayOrder: 2,
    description: 'High-speed spinning ground wheels with fiery circular patterns.'
  },
  {
    name: 'Flower Pots & Fountains',
    categoryCode: '120',
    icon: 'flower',
    displayOrder: 3,
    description: 'Grand erupting spark fountains with colorful towering flares.'
  },
  {
    name: 'Sound Crackers & Bombs',
    categoryCode: '130',
    icon: 'flame',
    displayOrder: 4,
    description: 'Traditional Sivakasi single and multi-sound loud explosion crackers.'
  },
  {
    name: 'Rockets & Aerial Bombs',
    categoryCode: '140',
    icon: 'rocket',
    displayOrder: 5,
    description: 'Sky-soaring high altitude rockets and aerial sound crackers.'
  },
  {
    name: 'Aerial Shots & Repeaters',
    categoryCode: '150',
    icon: 'zap',
    displayOrder: 6,
    description: 'Spectacular multi-shot aerial repeaters with multi-color sky bursts.'
  },
  {
    name: 'Fancy & Kids Novelty Crackers',
    categoryCode: '160',
    icon: 'sparkles',
    displayOrder: 7,
    description: 'Safe and fun novelty crackers, musical whistles, and cartoon favorites.'
  }
];

const sarguruProductData = [
  // --- Category: Sparklers (Code: 100) ---
  {
    file: '7cm-electric-sparklers.png',
    name: '7cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1001',
    code: 'SPK-7E',
    price: 40,
    wholesalePrice: 28,
    netRate: 22,
    quantity: '1 Box (10 Pcs)',
    description: '7cm Electric Sparklers with bright silver sparks, perfect and safe for small kids.',
  },
  {
    file: '7cm-crackling-sparklers.png',
    name: '7cm Crackling Sparklers',
    categoryName: 'Sparklers',
    sku: '1002',
    code: 'SPK-7C',
    price: 45,
    wholesalePrice: 32,
    netRate: 25,
    quantity: '1 Box (10 Pcs)',
    description: '7cm Crackling Sparklers with exciting popping crackle sound and bright glow.',
  },
  {
    file: '10cm-electric-sparklers.png',
    name: '10cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1003',
    code: 'SPK-10E',
    price: 60,
    wholesalePrice: 42,
    netRate: 35,
    quantity: '1 Box (10 Pcs)',
    description: '10cm Electric Sparklers producing sparkling silver starlight glitter.',
  },
  {
    file: '10cm-crackling-sparklers.png',
    name: '10cm Crackling Sparklers',
    categoryName: 'Sparklers',
    sku: '1004',
    code: 'SPK-10C',
    price: 65,
    wholesalePrice: 46,
    netRate: 38,
    quantity: '1 Box (10 Pcs)',
    description: '10cm Crackling Sparklers with intense twinkling sparks and crackle effects.',
  },
  {
    file: '12cm-electric-sparklers.png',
    name: '12cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1005',
    code: 'SPK-12E',
    price: 75,
    wholesalePrice: 52,
    netRate: 42,
    quantity: '1 Box (10 Pcs)',
    description: '12cm Electric Sparklers with steady long-lasting silver brilliance.',
  },
  {
    file: '12cm-crackling-sparklers.png',
    name: '12cm Crackling Sparklers',
    categoryName: 'Sparklers',
    sku: '1006',
    code: 'SPK-12C',
    price: 80,
    wholesalePrice: 56,
    netRate: 46,
    quantity: '1 Box (10 Pcs)',
    description: '12cm Crackling Sparklers with popping sound effects and golden glitter.',
  },
  {
    file: '12cm-green-sparklers.png',
    name: '12cm Green Sparklers',
    categoryName: 'Sparklers',
    sku: '1007',
    code: 'SPK-12G',
    price: 85,
    wholesalePrice: 60,
    netRate: 48,
    quantity: '1 Box (10 Pcs)',
    description: '12cm Vivid Green Sparklers with emerald flame and glowing green sparks.',
  },
  {
    file: '12cm-red-sparklers.png',
    name: '12cm Red Sparklers',
    categoryName: 'Sparklers',
    sku: '1008',
    code: 'SPK-12R',
    price: 85,
    wholesalePrice: 60,
    netRate: 48,
    quantity: '1 Box (10 Pcs)',
    description: '12cm Crimson Red Sparklers with vibrant ruby glow and festive sparks.',
  },
  {
    file: '15cm-electric-sparklers.png',
    name: '15cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1009',
    code: 'SPK-15E',
    price: 110,
    wholesalePrice: 78,
    netRate: 62,
    quantity: '1 Box (10 Pcs)',
    description: '15cm Electric Sparklers for longer burning time and dazzling illumination.',
  },
  {
    file: '15cm-crackling-sparklers.png',
    name: '15cm Crackling Sparklers',
    categoryName: 'Sparklers',
    sku: '1010',
    code: 'SPK-15C',
    price: 120,
    wholesalePrice: 85,
    netRate: 68,
    quantity: '1 Box (10 Pcs)',
    description: '15cm Crackling Sparklers offering vibrant sound and shimmering burst effects.',
  },
  {
    file: '15cm-green-sparklers.png',
    name: '15cm Green Sparklers',
    categoryName: 'Sparklers',
    sku: '1011',
    code: 'SPK-15G',
    price: 130,
    wholesalePrice: 92,
    netRate: 74,
    quantity: '1 Box (10 Pcs)',
    description: '15cm Deluxe Green Sparklers with intense emerald green light.',
  },
  {
    file: '15cm-red-sparklers.png',
    name: '15cm Red Sparklers',
    categoryName: 'Sparklers',
    sku: '1012',
    code: 'SPK-15R',
    price: 130,
    wholesalePrice: 92,
    netRate: 74,
    quantity: '1 Box (10 Pcs)',
    description: '15cm Deluxe Red Sparklers with festive red light and sparks.',
  },
  {
    file: '30cm-electric-sparklers.png',
    name: '30cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1013',
    code: 'SPK-30E',
    price: 180,
    wholesalePrice: 130,
    netRate: 105,
    quantity: '1 Box (5 Pcs)',
    description: '30cm Mega Electric Sparklers with ultra-long duration and golden showers.',
  },
  {
    file: '30cm-crackling-sparklers.png',
    name: '30cm Crackling Sparklers',
    categoryName: 'Sparklers',
    sku: '1014',
    code: 'SPK-30C',
    price: 190,
    wholesalePrice: 138,
    netRate: 110,
    quantity: '1 Box (5 Pcs)',
    description: '30cm Mega Crackling Sparklers with loud crackle sounds and radiant sparkles.',
  },
  {
    file: '30cm-green-sparklers.png',
    name: '30cm Green Sparklers',
    categoryName: 'Sparklers',
    sku: '1015',
    code: 'SPK-30G',
    price: 200,
    wholesalePrice: 145,
    netRate: 115,
    quantity: '1 Box (5 Pcs)',
    description: '30cm Giant Green Sparklers featuring bright festive emerald glitter.',
  },
  {
    file: '30cm-red-sparklers.png',
    name: '30cm Red Sparklers',
    categoryName: 'Sparklers',
    sku: '1016',
    code: 'SPK-30R',
    price: 200,
    wholesalePrice: 145,
    netRate: 115,
    quantity: '1 Box (5 Pcs)',
    description: '30cm Giant Red Sparklers radiating ruby red festive sparks.',
  },
  {
    file: '50cm-electric-sparklers.png',
    name: '50cm Electric Sparklers',
    categoryName: 'Sparklers',
    sku: '1017',
    code: 'SPK-50E',
    price: 320,
    wholesalePrice: 230,
    netRate: 185,
    quantity: '1 Box (5 Pcs)',
    description: '50cm Monster Electric Sparklers with extended burn time and grand sparkle show.',
  },
  {
    file: '50cm-5in1-sparklers.png',
    name: '50cm 5 in 1 Sparklers',
    categoryName: 'Sparklers',
    sku: '1018',
    code: 'SPK-50-5IN1',
    price: 350,
    wholesalePrice: 250,
    netRate: 200,
    quantity: '1 Box (5 Pcs)',
    description: '50cm Multi-color 5-in-1 Sparklers with dynamic color transformations.',
  },
  {
    file: 'electric_sparklers.png',
    name: 'Electric Sparklers Standard',
    categoryName: 'Sparklers',
    sku: '1019',
    code: 'SPK-STD',
    price: 70,
    wholesalePrice: 50,
    netRate: 40,
    quantity: '1 Box (10 Pcs)',
    description: 'Classic Sarguru Electric Sparklers with bright silver glitter.',
  },

  // --- Category: Ground Chakkars & Spinners (Code: 110) ---
  {
    file: 'ground-chakkar-big.png',
    name: 'Ground Chakkar Big',
    categoryName: 'Ground Chakkars & Spinners',
    sku: '1101',
    code: 'GC-BIG',
    price: 90,
    wholesalePrice: 65,
    netRate: 52,
    quantity: '1 Box (10 Pcs)',
    description: 'High-speed spinning ground chakkar creating a brilliant wheel of golden fire.',
  },
  {
    file: 'ground-chakkar-deluxe.png',
    name: 'Ground Chakkar Deluxe',
    categoryName: 'Ground Chakkars & Spinners',
    sku: '1102',
    code: 'GC-DLX',
    price: 130,
    wholesalePrice: 92,
    netRate: 75,
    quantity: '1 Box (10 Pcs)',
    description: 'Deluxe large ground chakkar with prolonged rotation and vibrant sparks.',
  },
  {
    file: 'dancing-wheel.png',
    name: 'Dancing Wheel',
    categoryName: 'Ground Chakkars & Spinners',
    sku: '1103',
    code: 'GC-DW',
    price: 160,
    wholesalePrice: 115,
    netRate: 92,
    quantity: '1 Box (5 Pcs)',
    description: 'Special multi-color dancing wheel with acrobatic spin motion and color shifts.',
  },
  {
    file: 'spinner_special.png',
    name: 'Spinner Special',
    categoryName: 'Ground Chakkars & Spinners',
    sku: '1104',
    code: 'SPN-SPC',
    price: 150,
    wholesalePrice: 105,
    netRate: 85,
    quantity: '1 Box (10 Pcs)',
    description: 'Special high-velocity ground spinner with sharp sparkling rings.',
  },
  {
    file: 'spinner_super_deluxe.png',
    name: 'Spinner Super Deluxe',
    categoryName: 'Ground Chakkars & Spinners',
    sku: '1105',
    code: 'SPN-SDLX',
    price: 210,
    wholesalePrice: 150,
    netRate: 120,
    quantity: '1 Box (10 Pcs)',
    description: 'Super deluxe high-power spinning fireworks with glowing multi-color aura.',
  },

  // --- Category: Flower Pots & Fountains (Code: 120) ---
  {
    file: 'flower_pot_big.png',
    name: 'Flower Pot Big',
    categoryName: 'Flower Pots & Fountains',
    sku: '1201',
    code: 'FP-BIG',
    price: 120,
    wholesalePrice: 85,
    netRate: 68,
    quantity: '1 Box (10 Pcs)',
    description: 'Traditional flower pot erupting in a tall golden shower of sparks.',
  },
  {
    file: 'flower-pot-ashoka.png',
    name: 'Flower Pot Ashoka',
    categoryName: 'Flower Pots & Fountains',
    sku: '1202',
    code: 'FP-ASH',
    price: 140,
    wholesalePrice: 98,
    netRate: 78,
    quantity: '1 Box (10 Pcs)',
    description: 'Ashoka flower pot with majestic silver sparks and prolonged duration.',
  },
  {
    file: 'flower-pot-deluxe.png',
    name: 'Flower Pot Deluxe',
    categoryName: 'Flower Pots & Fountains',
    sku: '1203',
    code: 'FP-DLX',
    price: 180,
    wholesalePrice: 128,
    netRate: 102,
    quantity: '1 Box (5 Pcs)',
    description: 'Deluxe fountain with high-altitude dazzling golden and silver spray.',
  },
  {
    file: 'flower-pot-deluxe-naachar.png',
    name: 'Flower Pot Deluxe Naachiar',
    categoryName: 'Flower Pots & Fountains',
    sku: '1204',
    code: 'FP-NAA',
    price: 220,
    wholesalePrice: 155,
    netRate: 125,
    quantity: '1 Box (5 Pcs)',
    description: 'Naachiar special premium flower pot with grand color sparks.',
  },
  {
    file: 'flower-pot-nova-pots.png',
    name: 'Flower Pot Nova Pots',
    categoryName: 'Flower Pots & Fountains',
    sku: '1205',
    code: 'FP-NOV',
    price: 240,
    wholesalePrice: 170,
    netRate: 135,
    quantity: '1 Box (5 Pcs)',
    description: 'Nova pots with vibrant color-burst effects and massive spark coverage.',
  },
  {
    file: 'flower-pot-super-deluxe.png',
    name: 'Flower Pot Super Deluxe',
    categoryName: 'Flower Pots & Fountains',
    sku: '1206',
    code: 'FP-SDLX',
    price: 280,
    wholesalePrice: 198,
    netRate: 158,
    quantity: '1 Box (5 Pcs)',
    description: 'Extra tall fountain reaching up to 15 feet with glittering starlight colors.',
  },
  {
    file: 'bada-peacock.png',
    name: 'Bada Peacock Fountain',
    categoryName: 'Flower Pots & Fountains',
    sku: '1207',
    code: 'FNT-PCK',
    price: 320,
    wholesalePrice: 225,
    netRate: 180,
    quantity: '1 Box (1 Pc)',
    description: 'Majestic Peacock shape fountain unfurling brilliant peacock feather sparks.',
  },
  {
    file: 'pencil-deluxe.png',
    name: 'Pencil Deluxe Fountain',
    categoryName: 'Flower Pots & Fountains',
    sku: '1208',
    code: 'FNT-PNC',
    price: 150,
    wholesalePrice: 105,
    netRate: 85,
    quantity: '1 Box (10 Pcs)',
    description: 'Handheld fountain pencil with colorful flare and gentle sparkles.',
  },

  // --- Category: Sound Crackers & Bombs (Code: 130) ---
  {
    file: 'kuruvi.png',
    name: 'Kuruvi Sound Crackers',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1301',
    code: 'SND-KRV',
    price: 25,
    wholesalePrice: 18,
    netRate: 14,
    quantity: '1 Pkt',
    description: 'Single sound kuruvi crackers with crisp and sharp sound.',
  },
  {
    file: '4inch-lakshmi.png',
    name: '4 Inch Lakshmi Crackers',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1302',
    code: 'SND-4LAK',
    price: 45,
    wholesalePrice: 32,
    netRate: 25,
    quantity: '1 Pkt',
    description: '4 Inch classic Lakshmi crackers delivering traditional festive sound.',
  },
  {
    file: 'gold-lakshmi.png',
    name: 'Gold Lakshmi Crackers',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1303',
    code: 'SND-GLAK',
    price: 60,
    wholesalePrice: 42,
    netRate: 34,
    quantity: '1 Pkt',
    description: 'Gold edition Lakshmi crackers with extra loud festive bang.',
  },
  {
    file: '2-sound.png',
    name: '2 Sound Crackers',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1304',
    code: 'SND-2SND',
    price: 80,
    wholesalePrice: 56,
    netRate: 45,
    quantity: '1 Box (10 Pcs)',
    description: 'Double sound crackers bursting with two consecutive loud booms.',
  },
  {
    file: 'stripped-bijili.png',
    name: 'Stripped Bijili Crackers',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1305',
    code: 'SND-BJL',
    price: 50,
    wholesalePrice: 35,
    netRate: 28,
    quantity: '1 Pkt (100 Pcs)',
    description: 'Packet of 100 fast-bursting stripped bijili crackers.',
  },
  {
    file: 'classic-bomb.png',
    name: 'Classic Bomb',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1306',
    code: 'BMB-CLS',
    price: 110,
    wholesalePrice: 78,
    netRate: 62,
    quantity: '1 Box (10 Pcs)',
    description: 'Traditional jute hydro classic bomb with powerful boom.',
  },
  {
    file: 'king-bomb.png',
    name: 'King Bomb',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1307',
    code: 'BMB-KNG',
    price: 140,
    wholesalePrice: 98,
    netRate: 78,
    quantity: '1 Box (10 Pcs)',
    description: 'Heavy sound king bomb made with superior quality explosive mix.',
  },
  {
    file: 'hudrogen-bomb-deluxe.png',
    name: 'Hydrogen Bomb Deluxe',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1308',
    code: 'BMB-HYD',
    price: 170,
    wholesalePrice: 120,
    netRate: 95,
    quantity: '1 Box (10 Pcs)',
    description: 'High intensity deluxe hydrogen bomb delivering deafening sound.',
  },
  {
    file: 'rectangular-bomb.png',
    name: 'Rectangular Bomb',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1309',
    code: 'BMB-REC',
    price: 130,
    wholesalePrice: 92,
    netRate: 72,
    quantity: '1 Box (10 Pcs)',
    description: 'Special rectangular shape sound bomb with concentrated blast.',
  },
  {
    file: 'sena-double-ball.png',
    name: 'Sena Double Ball Bomb',
    categoryName: 'Sound Crackers & Bombs',
    sku: '1310',
    code: 'BMB-SNA',
    price: 160,
    wholesalePrice: 112,
    netRate: 90,
    quantity: '1 Box (10 Pcs)',
    description: 'Double ball sound bomb with 2 distinct booming explosions.',
  },

  // --- Category: Rockets & Aerial Bombs (Code: 140) ---
  {
    file: 'lunik-rocket.png',
    name: 'Lunik Rocket',
    categoryName: 'Rockets & Aerial Bombs',
    sku: '1401',
    code: 'RKT-LNK',
    price: 180,
    wholesalePrice: 128,
    netRate: 102,
    quantity: '1 Box (10 Pcs)',
    description: 'High flying sky rocket with whistling ascent and bright burst.',
  },
  {
    file: 'rocket-bomb.png',
    name: 'Rocket Bomb',
    categoryName: 'Rockets & Aerial Bombs',
    sku: '1402',
    code: 'RKT-BMB',
    price: 220,
    wholesalePrice: 155,
    netRate: 125,
    quantity: '1 Box (10 Pcs)',
    description: 'Sky-rocketing bomb with high-altitude powerful boom.',
  },

  // --- Category: Aerial Shots & Repeaters (Code: 150) ---
  {
    file: '7_shot.png',
    name: '7 Shot Multi-Color',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1501',
    code: 'SHT-7',
    price: 160,
    wholesalePrice: 115,
    netRate: 90,
    quantity: '1 Box (5 Pcs)',
    description: '7 consecutive colorful aerial shots illuminating the night sky.',
  },
  {
    file: '7 shot.png',
    name: '7 Shot Special Rider',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1502',
    code: 'SHT-7R',
    price: 170,
    wholesalePrice: 120,
    netRate: 95,
    quantity: '1 Box (5 Pcs)',
    description: 'Special edition 7 aerial shots with crackling palm burst.',
  },
  {
    file: '12_shot_colour_bomb.png',
    name: '12 Shot Colour Bomb',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1503',
    code: 'SHT-12CB',
    price: 280,
    wholesalePrice: 198,
    netRate: 158,
    quantity: '1 Box (1 Pc)',
    description: '12 high-altitude multi-color shell bursts with thunderous sound.',
  },
  {
    file: '12-star.png',
    name: '12 Star Sky Shot',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1504',
    code: 'SHT-12ST',
    price: 260,
    wholesalePrice: 185,
    netRate: 148,
    quantity: '1 Box (1 Pc)',
    description: '12 shining star bursts spreading across the sky in rich colors.',
  },
  {
    file: '30-shot.png',
    name: '30 Shot Aerial Repeater',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1505',
    code: 'SHT-30',
    price: 650,
    wholesalePrice: 460,
    netRate: 370,
    quantity: '1 Box (1 Pc)',
    description: 'Grand 30-shot cake repeater creating a non-stop aerial fireworks spectacle.',
  },
  {
    file: '60-shot.png',
    name: '60 Shot Mega Celebration',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1506',
    code: 'SHT-60',
    price: 1250,
    wholesalePrice: 890,
    netRate: 710,
    quantity: '1 Box (1 Pc)',
    description: 'Massive 60-shot display cake with glittering willows, chrysanthemums, and crackles.',
  },
  {
    file: 'penta_sky.png',
    name: 'Penta Sky Multi-Shot',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1507',
    code: 'SHT-PNT',
    price: 340,
    wholesalePrice: 240,
    netRate: 195,
    quantity: '1 Box (1 Pc)',
    description: '5-angle multi-directional sky shots firing in majestic fan formation.',
  },
  {
    file: 'penta-sky.png',
    name: 'Penta Sky Deluxe',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1508',
    code: 'SHT-PNTD',
    price: 360,
    wholesalePrice: 255,
    netRate: 205,
    quantity: '1 Box (1 Pc)',
    description: 'Deluxe edition Penta Sky with golden willow trails and brocade crown.',
  },
  {
    file: 'twinkling-star1.png',
    name: 'Twinkling Star 1',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1509',
    code: 'SHT-TWK1',
    price: 190,
    wholesalePrice: 135,
    netRate: 108,
    quantity: '1 Box (1 Pc)',
    description: 'High altitude shot with twinkling diamond stars and gold glitter.',
  },
  {
    file: 'twinkling-star4.png',
    name: 'Twinkling Star 4',
    categoryName: 'Aerial Shots & Repeaters',
    sku: '1510',
    code: 'SHT-TWK4',
    price: 240,
    wholesalePrice: 170,
    netRate: 136,
    quantity: '1 Box (1 Pc)',
    description: 'Quad twinkling star bursts spreading shimmering lights in four colors.',
  },

  // --- Category: Fancy & Kids Novelty Crackers (Code: 160) ---
  {
    file: 'canki_manki.png',
    name: 'Canki Manki',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1601',
    code: 'FNC-CKMK',
    price: 160,
    wholesalePrice: 115,
    netRate: 90,
    quantity: '1 Box',
    description: 'Fun novelty item with whimsical whistles, spinning sparks, and pops.',
  },
  {
    file: 'cartoons.png',
    name: 'Cartoons Special',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1602',
    code: 'FNC-CRT',
    price: 140,
    wholesalePrice: 100,
    netRate: 80,
    quantity: '1 Box',
    description: 'Kid-friendly colorful novelty fireworks with playful sounds.',
  },
  {
    file: 'elegant-couple.png',
    name: 'Elegant Couple',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1603',
    code: 'FNC-ELG',
    price: 180,
    wholesalePrice: 128,
    netRate: 102,
    quantity: '1 Box',
    description: 'Dual colored romantic sparkling fountain with glittering effects.',
  },
  {
    file: 'ganesh-mega-deluxe.png',
    name: 'Ganesh Mega Deluxe',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1604',
    code: 'FNC-GNS',
    price: 220,
    wholesalePrice: 155,
    netRate: 125,
    quantity: '1 Box',
    description: 'Auspicious celebratory novelty fireworks with golden sparkles and sound.',
  },
  {
    file: 'hike.png',
    name: 'Hike Novelty',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1605',
    code: 'FNC-HK',
    price: 170,
    wholesalePrice: 120,
    netRate: 96,
    quantity: '1 Box',
    description: 'High energy novelty spark fountain with color transformations.',
  },
  {
    file: 'kings_bounty.png',
    name: 'Kings Bounty',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1606',
    code: 'FNC-KB',
    price: 250,
    wholesalePrice: 178,
    netRate: 142,
    quantity: '1 Box',
    description: 'Royal assortment of vivid sparks, flashing stars, and crisp crackles.',
  },
  {
    file: 'lapake.png',
    name: 'Lapake Special',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1607',
    code: 'FNC-LPK',
    price: 150,
    wholesalePrice: 105,
    netRate: 85,
    quantity: '1 Box',
    description: 'Popular fast-crackling novelty ground spinner with loud pops.',
  },
  {
    file: 'lapake (2).png',
    name: 'Lapake Super Deluxe',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1608',
    code: 'FNC-LPK2',
    price: 170,
    wholesalePrice: 120,
    netRate: 96,
    quantity: '1 Box',
    description: 'Enhanced Lapake edition with multi-stage crackling bursts.',
  },
  {
    file: 'live_show.png',
    name: 'Live Show',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1609',
    code: 'FNC-LV',
    price: 190,
    wholesalePrice: 135,
    netRate: 108,
    quantity: '1 Box',
    description: 'Theatrical fireworks fountain with bright color-changing effects.',
  },
  {
    file: 'money_blast.png',
    name: 'Money Blast',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1610',
    code: 'FNC-MB',
    price: 210,
    wholesalePrice: 150,
    netRate: 120,
    quantity: '1 Box',
    description: 'Golden shower fountain with crackling golden coins effect.',
  },
  {
    file: 'money-blast.png',
    name: 'Money Blast Deluxe',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1611',
    code: 'FNC-MBD',
    price: 230,
    wholesalePrice: 165,
    netRate: 130,
    quantity: '1 Box',
    description: 'Deluxe golden shower fountain with extended sparkle time.',
  },
  {
    file: 'musically.png',
    name: 'Musically Whistle',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1612',
    code: 'FNC-MSC',
    price: 160,
    wholesalePrice: 115,
    netRate: 90,
    quantity: '1 Box',
    description: 'Musical whistling fireworks with melodious sound and bright sparks.',
  },
  {
    file: 'naachiar.png',
    name: 'Naachiar Special',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1613',
    code: 'FNC-NCH',
    price: 240,
    wholesalePrice: 170,
    netRate: 135,
    quantity: '1 Box',
    description: 'Traditional Sivakasi festive novelty item with rich multi-effects.',
  },
  {
    file: 'pubg.png',
    name: 'PUBG Blast',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1614',
    code: 'FNC-PBG',
    price: 190,
    wholesalePrice: 135,
    netRate: 108,
    quantity: '1 Box',
    description: 'Exciting action-themed novelty item with strobe lights and sound.',
  },
  {
    file: 'shining_stars.png',
    name: 'Shining Stars',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1615',
    code: 'FNC-SHN',
    price: 180,
    wholesalePrice: 128,
    netRate: 102,
    quantity: '1 Box',
    description: 'Glittering starlight effect with gentle crackling stars.',
  },
  {
    file: 'siren.png',
    name: 'Siren Whistle',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1616',
    code: 'FNC-SRN',
    price: 175,
    wholesalePrice: 125,
    netRate: 98,
    quantity: '1 Box',
    description: 'Ultra high pitch siren sound with bright green and red flares.',
  },
  {
    file: 'smack-down.png',
    name: 'Smack Down',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1617',
    code: 'FNC-SMK',
    price: 200,
    wholesalePrice: 142,
    netRate: 114,
    quantity: '1 Box',
    description: 'High impact energetic bursts with colorful flash and boom.',
  },
  {
    file: 'snapchat.png',
    name: 'Snapchat Snappers',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1618',
    code: 'FNC-SNP',
    price: 150,
    wholesalePrice: 105,
    netRate: 85,
    quantity: '1 Box',
    description: 'Quick snapping flash pops with bright yellow spark trail.',
  },
  {
    file: 'spike.png',
    name: 'Spike Flash',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1619',
    code: 'FNC-SPK',
    price: 165,
    wholesalePrice: 118,
    netRate: 94,
    quantity: '1 Box',
    description: 'Spiky spark bursts with rapid strobe effects.',
  },
  {
    file: 'sun_rise.png',
    name: 'Sun Rise Special',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1620',
    code: 'FNC-SNR',
    price: 185,
    wholesalePrice: 130,
    netRate: 105,
    quantity: '1 Box',
    description: 'Bright golden sunrise illumination with radiant orange sparkles.',
  },
  {
    file: 'sun-rise.png',
    name: 'Sun Rise Deluxe',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1621',
    code: 'FNC-SNRD',
    price: 195,
    wholesalePrice: 138,
    netRate: 110,
    quantity: '1 Box',
    description: 'Deluxe Sun Rise fountain with rising golden aura.',
  },
  {
    file: 'trixx.png',
    name: 'Trixx Magic Pops',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1622',
    code: 'FNC-TRX',
    price: 140,
    wholesalePrice: 98,
    netRate: 80,
    quantity: '1 Box',
    description: 'Magic pop effects with colorful twinkling flashes for kids.',
  },
  {
    file: 'youtube.png',
    name: 'Youtube Flash',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1623',
    code: 'FNC-YT',
    price: 170,
    wholesalePrice: 120,
    netRate: 96,
    quantity: '1 Box',
    description: 'Trending novelty cracker with dazzling red light and crackle pops.',
  },
  {
    file: 'zozo.png',
    name: 'Zozo Novelty',
    categoryName: 'Fancy & Kids Novelty Crackers',
    sku: '1624',
    code: 'FNC-ZOZ',
    price: 160,
    wholesalePrice: 115,
    netRate: 90,
    quantity: '1 Box',
    description: 'Exciting whistling spinner with fun zig-zag spark trail.',
  }
];

// Helper to upload a buffer to Cloudinary
async function uploadBufferToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const cleanPublicId = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        public_id: `sarguru_${cleanPublicId}`,
        overwrite: true,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // 1. Upsert Categories
    console.log('\n--- Syncing Categories ---');
    const categoryMap = {};

    for (const cat of categoriesDefinition) {
      let doc = await Category.findOne({
        $or: [{ name: cat.name }, { categoryCode: cat.categoryCode }]
      });

      if (!doc) {
        doc = new Category({
          name: cat.name,
          categoryCode: cat.categoryCode,
          icon: cat.icon,
          displayOrder: cat.displayOrder,
          description: cat.description,
          isActive: true
        });
      } else {
        doc.name = cat.name;
        doc.categoryCode = cat.categoryCode;
        doc.icon = cat.icon;
        doc.displayOrder = cat.displayOrder;
        doc.description = cat.description;
        doc.isActive = true;
      }
      await doc.save();
      categoryMap[cat.name] = doc;
      console.log(`✓ Category ready: "${doc.name}" [Code: ${doc.categoryCode}]`);
    }

    // Clean up any old unused categories if necessary (or keep them active)
    const existingOldCats = await Category.find();
    for (const oldCat of existingOldCats) {
      if (!categoryMap[oldCat.name]) {
        // Map old category to one of the new ones if needed, or deactivate
        console.log(`Note: Keeping existing category: ${oldCat.name}`);
      }
    }

    // 2. Upload images and Upsert Products
    console.log('\n--- Processing Sarguru Products & Images ---');
    let processedCount = 0;
    const SERVER_BASE = process.env.SERVER_URL || 'http://localhost:5000';

    for (const item of sarguruProductData) {
      const imagePath = path.join(assetsDir, item.file);

      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️ Warning: Image file not found: ${imagePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(imagePath);

      // Save local copies in both backend and frontend static folders
      const cleanFileName = item.file.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      fs.writeFileSync(path.join(localUploadsDir, cleanFileName), fileBuffer);
      fs.writeFileSync(path.join(frontendPublicDir, cleanFileName), fileBuffer);

      const finalImageUrl = `/uploads/products/${cleanFileName}`;

      const categoryDoc = categoryMap[item.categoryName];
      if (!categoryDoc) {
        console.error(`❌ Missing category doc for "${item.categoryName}"`);
        continue;
      }

      // Upsert Product by SKU or Name
      let productDoc = await Product.findOne({
        $or: [{ sku: item.sku }, { name: item.name }]
      });

      if (!productDoc) {
        productDoc = new Product({
          sku: item.sku,
          code: item.code,
          name: item.name,
          category: categoryDoc._id,
          brand: 'Sarguru',
          price: item.price,
          wholesalePrice: item.wholesalePrice,
          netRate: item.netRate,
          stock: 200,
          storeStockPieces: 200,
          godownStockCases: 10,
          piecesPerCase: 20,
          minimumStock: 15,
          image: finalImageUrl,
          quantity: item.quantity,
          description: item.description,
          hasDiscount: true,
          displayNetRate: false,
          isActive: true
        });
      } else {
        productDoc.sku = item.sku;
        productDoc.code = item.code;
        productDoc.name = item.name;
        productDoc.category = categoryDoc._id;
        productDoc.brand = 'Sarguru';
        productDoc.price = item.price;
        productDoc.wholesalePrice = item.wholesalePrice;
        productDoc.netRate = item.netRate;
        productDoc.stock = (!productDoc.stock || productDoc.stock < 10) ? 200 : productDoc.stock;
        productDoc.storeStockPieces = (!productDoc.storeStockPieces || productDoc.storeStockPieces < 0) ? 200 : productDoc.storeStockPieces;
        productDoc.godownStockCases = (!productDoc.godownStockCases || productDoc.godownStockCases < 0) ? 10 : productDoc.godownStockCases;
        productDoc.piecesPerCase = (!productDoc.piecesPerCase || productDoc.piecesPerCase < 1) ? 20 : productDoc.piecesPerCase;
        productDoc.image = finalImageUrl;
        productDoc.quantity = item.quantity;
        productDoc.description = item.description;
        productDoc.hasDiscount = true;
        productDoc.displayNetRate = false;
        productDoc.isActive = true;
      }

      await productDoc.save();
      processedCount++;
      console.log(`✓ [${processedCount}/${sarguruProductData.length}] Saved Product: "${item.name}" (SKU: ${item.sku})`);
    }

    // 3. Update Category product counts and category images
    console.log('\n--- Updating Category Product Counts & Banner Images ---');
    for (const [catName, catDoc] of Object.entries(categoryMap)) {
      const count = await Product.countDocuments({ category: catDoc._id, isActive: true });
      const firstProduct = await Product.findOne({ category: catDoc._id, isActive: true });
      catDoc.productCount = count;
      if (firstProduct && firstProduct.image) {
        catDoc.image = firstProduct.image;
      }
      await catDoc.save();
      console.log(`✓ Category "${catName}": ${count} products`);
    }

    console.log(`\n🎉 Successfully processed and seeded all ${processedCount} Sarguru products!`);
    process.exit(0);
  } catch (err) {
    console.error('Fatal Error during execution:', err);
    process.exit(1);
  }
}

main();
