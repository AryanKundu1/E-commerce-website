const express = require('express');
const { getProducts, getProduct, getFilterOptions } = require('../controllers/productController');

const router = express.Router();
router.get('/', getProducts);
router.get('/filters', getFilterOptions);
router.get('/:id', getProduct);

module.exports = router;
