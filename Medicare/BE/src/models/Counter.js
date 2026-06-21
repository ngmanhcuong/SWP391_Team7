const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

// Atomically increment and return the next value for a given key.
counterSchema.statics.next = async function next(key) {
  const doc = await this.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return doc.seq;
};

// Ensure the counter is at least `value` (used after seeding).
counterSchema.statics.ensureAtLeast = async function ensureAtLeast(key, value) {
  const doc = await this.findById(key);
  if (!doc || doc.seq < value) {
    await this.findByIdAndUpdate(key, { seq: value }, { upsert: true });
  }
};

module.exports = mongoose.model('Counter', counterSchema);
