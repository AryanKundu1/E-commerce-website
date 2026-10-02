const mongoose = require('mongoose');
const Product = require('../models/Product');

const SORTS = {
  featured: { featured: -1, createdAt: -1 },
  'price-low': { price: 1 },
  'price-high': { price: -1 },
  'name-asc': { name: 1 },
  'name-desc': { name: -1 },
  rating: { rating: -1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toList = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : []);

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, type, minPrice, maxPrice, inStock, featured, sort = 'featured' } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 50);

    const query = {};

    if (search && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim().slice(0, 60)), 'i');
      query.$or = [{ name: rx }, { description: rx }, { category: rx }, { productType: rx }];
    }

    const categories = toList(category).map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i'));
    if (categories.length) query.category = { $in: categories };

    const types = toList(type).map((t) => new RegExp(`^${escapeRegex(t)}$`, 'i'));
    if (types.length) query.productType = { $in: types };

    const hasMin = minPrice !== undefined && minPrice !== '';
    const hasMax = maxPrice !== undefined && maxPrice !== '';
    if (hasMin || hasMax) {
      if ((hasMin && Number.isNaN(Number(minPrice))) || (hasMax && Number.isNaN(Number(maxPrice)))) {
        res.status(400);
        throw new Error('minPrice and maxPrice must be numbers');
      }
      query.price = {};
      if (hasMin) query.price.$gte = Number(minPrice);
      if (hasMax) query.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') query.stock = { $gt: 0 };
    if (featured === 'true') query.featured = true;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(SORTS[sort] || SORTS.featured)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        products,
        currentPage: page,
        totalPages: Math.max(Math.ceil(totalProducts / limit), 1),
        totalProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFilterOptions = async (req, res, next) => {
  try {
    const [categories, types] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('productType'),
    ]);
    res.json({ success: true, data: { categories: categories.sort(), types: types.sort() } });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = mongoose.isValidObjectId(id)
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
    res.json({ success: true, data: { product, related } });
  } catch (err) {
    next(err);
  }
};
