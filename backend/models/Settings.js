const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  minOrderValue: { type: Number, default: 3000 },
  merchantPhone: { type: String, default: '917868077818' },
  storeAddress: { type: String, default: '3/1321 Paraipatti, Sivakasi, Tamil Nadu' }
}, { timestamps: true });

settingsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
