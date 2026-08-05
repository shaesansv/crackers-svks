const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  actualPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  imageType: { type: String, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Product', productSchema);
