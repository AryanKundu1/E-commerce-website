const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // whole rupees
    category: { type: String, required: true, enum: ['Skin', 'Body', 'Hair', 'Fragrance', 'Home'] },
    productType: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, default: '100 mL' },
    ingredients: [String],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
