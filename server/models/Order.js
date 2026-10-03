import mongoose from 'mongoose';
import Counter from './Counter.js';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String
    },
    alternatePhoneNumber: {
      type: String
    },
    deliveryAddress: {
      fullAddress: String,
      street: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
      country: String
    },
    approved: {
      type: Boolean,
      default: false
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: {
        type: String
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      originalPrice: {
        type: Number
      },
      hasDiscount: {
        type: Boolean
      },
      netRate: {
        type: Number
      },
      displayNetRate: {
        type: Boolean
      }
    }],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    delivery: {
      type: Number,
      default: 0
    },
    packingCharge: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    packingStatus: {
      type: String,
      enum: ['packed', 'unpacked']
    },
    holdDays: {
      type: Number,
      default: 0
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi', 'netbanking'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'paid', 'unpaid'],
      default: 'pending'
    },
    notes: String,
    trackingNumber: String
  },
  { timestamps: true }
);

orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before validation — uses an atomic counter to avoid
// duplicate key errors under concurrent requests.
// NOTE: Must be pre('validate'), NOT pre('save'), because Mongoose runs
// required-field validation BEFORE pre('save') hooks execute.
orderSchema.pre('validate', async function() {
  if (!this.orderNumber) {
    const seq = await Counter.nextSequence('orderNumber');
    this.orderNumber = seq.toString().padStart(5, '0');
  }
});

export default mongoose.model('Order', orderSchema);
