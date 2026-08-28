import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'Cracker Hub'
    },
    siteDescription: String,
    logo: String,
    favicon: String,
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    enablePackingCharge: {
      type: Boolean,
      default: true
    },
    minimumPurchaseAmount: {
      type: Number,
      default: 500,
      min: 0
    },
    minPurchaseOutsideTN: {
      type: Number,
      default: 1000,
      min: 0
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 999
    },
    deliveryCharge: {
      type: Number,
      default: 99
    },
    currency: {
      type: String,
      default: 'INR'
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: String,
    contact: {
      email: String,
      phone: String,
      address: String,
      mapEmbedUrl: {
        type: String,
        default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.4302063343627!2d77.78349094883554!3d9.373263491338452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06c90068db81d5%3A0xabc08d4d2391eff0!2sSarguru%20Crackers!5e1!3m2!1sen!2sin!4v1787846763193!5m2!1sen!2sin'
      }
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String
    },
    features: {
      enableReviews: {
        type: Boolean,
        default: true
      },
      enableWishlist: {
        type: Boolean,
        default: true
      },
      enableCoupon: {
        type: Boolean,
        default: true
      }
    },
    news: {
      type: String,
      default: ''
    },
    billing: {
      companyName: String,
      phone: String,
      email: String,
      whatsapp: String,
      gstNumber: String,
      applyGst: {
        type: Boolean,
        default: false
      }
    },
    aboutUs: {
      story: { type: String, default: 'We are in the field of manufacturing & selling crackers since 1994.' },
      vision: { type: String, default: 'To be the best wholesale & retail dealer for all kinds of fancy crackers & gift boxes to our beloved customers.' },
      mission: { type: String, default: 'Our Mission is to provide Quality & Innovative Fireworks products to our valuable customers at reasonable prices and light up all their celebrations.' }
    },
    safetyTips: {
      intro: { type: String, default: 'There are certain Do\'s & Don\'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers.' },
      dos: { 
        type: [String], 
        default: [
          "Display fireworks as per the warnings and instructions mentioned on the pack.",
          "Buy fireworks directly from Manufacturer or from authorized dealer only.",
          "Always follow the Safety tips marked on the fireworks.",
          "Use an agarbatti to ignite the fireworks.",
          "Always wear eye protection when lightening fireworks.",
          "Keep a bucket of water or a garden hose handy in case of fire or other mishap."
        ] 
      },
      donts: { 
        type: [String], 
        default: [
          "Never try to re-light or pick up fireworks that have not ignited fully.",
          "Never shoot fireworks in a metal or glass containers.",
          "Never point or throw fireworks at another person.",
          "Do not wear loose clothing while using fireworks.",
          "Never carry fireworks in your pockets.",
          "After fireworks display never pick up fireworks that may be left over, they may still active."
        ] 
      }
    },
    termsAndConditions: {
      type: [String],
      default: [
        'Minimum order value is Rs. 3,000 only (after discount).',
        'All orders will be dispatched from Sivakasi warehouse.',
        '3% packing and handling charges will apply on all orders.',
        'Products will be dispatched only after full payment verification.',
        'Deliveries will be handled via third-party logistics on a To-Pay basis.',
        'Order submission is required to process and verify stock availability.',
        'Images of items in the price list are for visual representations only.',
        'The prices quoted are valid up to Diwali season or subject to manufacturer changes.'
      ]
    }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
