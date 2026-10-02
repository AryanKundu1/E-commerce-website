const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
    },
    paymentMethod: { type: String, enum: ['COD', 'DEMO_CARD'], required: true },
    subtotal: Number,
    shippingFee: Number,
    totalAmount: Number,
    status: { type: String, default: 'Processing' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
