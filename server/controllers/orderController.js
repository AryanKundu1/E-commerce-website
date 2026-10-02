const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

const FREE_SHIPPING_ABOVE = 2000;
const SHIPPING_FEE = 99;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^[6-9]\d{9}$/;
const PIN_RX = /^\d{6}$/;

const text = (v) => (typeof v === 'string' ? v.trim() : '');

const validateAddress = (a = {}) => {
  const errors = [];
  if (text(a.fullName).length < 2) errors.push('Full name is required');
  if (!EMAIL_RX.test(text(a.email))) errors.push('A valid email is required');
  if (!PHONE_RX.test(text(a.phone))) errors.push('Phone must be a valid 10-digit number');
  if (text(a.address).length < 5) errors.push('Address is required');
  if (text(a.city).length < 2) errors.push('City is required');
  if (text(a.state).length < 2) errors.push('State is required');
  if (!PIN_RX.test(text(a.postalCode))) errors.push('Postal code must be 6 digits');
  return errors;
};

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('Your bag is empty');
    }
    if (!['COD', 'DEMO_CARD'].includes(paymentMethod)) {
      res.status(400);
      throw new Error('Choose a valid payment method');
    }
    const addressErrors = validateAddress(shippingAddress);
    if (addressErrors.length) {
      res.status(400);
      throw new Error(addressErrors.join('. '));
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = parseInt(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400);
        throw new Error('Invalid quantity');
      }
      const product = mongoose.isValidObjectId(item.productId) ? await Product.findById(item.productId) : null;
      if (!product) {
        res.status(404);
        throw new Error('A product in your bag no longer exists');
      }
      if (product.stock < quantity) {
        res.status(409);
        throw new Error(
          product.stock === 0 ? `${product.name} is out of stock` : `Only ${product.stock} of ${product.name} left`
        );
      }
      subtotal += product.price * quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    const shippingFee = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;

    const reduced = [];
    for (const oi of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: oi.product, stock: { $gte: oi.quantity } },
        { $inc: { stock: -oi.quantity } }
      );
      if (!updated) {
        for (const r of reduced) await Product.findByIdAndUpdate(r.product, { $inc: { stock: r.quantity } });
        res.status(409);
        throw new Error(`${oi.name} just went out of stock`);
      }
      reduced.push(oi);
    }

    const order = await Order.create({
      items: orderItems,
      shippingAddress: {
        fullName: text(shippingAddress.fullName),
        email: text(shippingAddress.email),
        phone: text(shippingAddress.phone),
        address: text(shippingAddress.address),
        city: text(shippingAddress.city),
        state: text(shippingAddress.state),
        postalCode: text(shippingAddress.postalCode),
      },
      paymentMethod,
      subtotal,
      shippingFee,
      totalAmount,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = mongoose.isValidObjectId(req.params.id) ? await Order.findById(req.params.id) : null;
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
