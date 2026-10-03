import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'orderNumber'
  seq: { type: Number, default: 0 }
});

/**
 * Atomically increment and return the next sequence value for a given counter id.
 * Uses findOneAndUpdate with upsert so it works even if the counter doc doesn't exist yet.
 */
counterSchema.statics.nextSequence = async function (counterId) {
  const counter = await this.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

export default mongoose.model('Counter', counterSchema);
