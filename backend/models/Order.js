const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String, required: true },
  items: [{
    name: String,
    qty: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  packingCharge: { type: Number, default: 0 },
  overallTotal: { type: Number, required: true },
  approved: { type: String, enum: ['Pending', 'Approved', 'Packed', 'On Hold'], default: 'Pending' },
  holdStatus: { type: String, default: '' },
  date: { type: String, required: true }
}, { timestamps: true });

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Order', orderSchema);
