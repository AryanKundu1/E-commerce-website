require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

const img = (slug) => `https://picsum.photos/seed/elan-${slug}/800/1000`;

// [name, category, productType, price, size, description, ingredients, featured, stock]
const raw = [
  ['Cedar Veil Cleanser', 'Skin', 'Cleanser', 1450, '200 mL', 'A soft gel cleanser that lifts the day away without leaving skin tight. Scented with cedar and a hint of citrus peel.', ['Aloe leaf juice', 'Glycerin', 'Cedar extract'], true, 40],
  ['Quiet Bloom Serum', 'Skin', 'Serum', 2650, '30 mL', 'A lightweight daily serum with a calm, floral character. Absorbs quickly and layers well under moisturiser.', ['Hyaluronic acid', 'Rose water', 'Niacinamide'], true, 25],
  ['Mineral Drift Moisturiser', 'Skin', 'Moisturiser', 2200, '50 mL', 'A balanced cream with a satin finish, made for steady everyday hydration.', ['Squalane', 'Shea butter', 'Zinc oxide'], true, 30],
  ['Clay and Sage Mask', 'Skin', 'Mask', 1850, '75 mL', 'A weekly clay mask with a herbal aroma. Rinses clean and leaves skin feeling fresh.', ['Kaolin clay', 'Sage leaf', 'Aloe'], false, 18],
  ['Dew Thread Toner', 'Skin', 'Toner', 1250, '150 mL', 'An alcohol-free, mist-style toner to refresh skin between steps.', ['Witch hazel', 'Cucumber extract', 'Glycerin'], false, 50],
  ['Verdant Hand Balm', 'Body', 'Hand Balm', 1350, '75 mL', 'A rich, quick-absorbing balm with green herbal notes. Small enough for any bag.', ['Shea butter', 'Rosemary', 'Beeswax'], true, 60],
  ['Salt Lantern Body Wash', 'Body', 'Body Wash', 1650, '250 mL', 'A gentle body wash with a clean mineral scent and a creamy lather.', ['Coconut-derived cleansers', 'Sea salt', 'Bergamot'], false, 35],
  ['Amber Hush Body Oil', 'Body', 'Body Oil', 2400, '100 mL', 'A dry-touch oil with warm amber notes, best applied on damp skin.', ['Sweet almond oil', 'Jojoba oil', 'Amber resin'], false, 22],
  ['Oat Milk Body Lotion', 'Body', 'Body Lotion', 1550, '250 mL', 'A softly scented lotion for everyday comfort, with a light, non-greasy feel.', ['Colloidal oat', 'Shea butter', 'Glycerin'], false, 45],
  ['Fern Hollow Shampoo', 'Hair', 'Shampoo', 1500, '250 mL', 'A mild daily shampoo with a fresh, leafy scent.', ['Aloe vera', 'Fern extract', 'Panthenol'], false, 40],
  ['Fern Hollow Conditioner', 'Hair', 'Conditioner', 1500, '250 mL', 'A smoothing conditioner that detangles and leaves hair soft.', ['Argan oil', 'Panthenol', 'Fern extract'], false, 38],
  ['Linen Root Scalp Oil', 'Hair', 'Hair Oil', 1750, '60 mL', 'A light pre-wash oil for a slow scalp massage.', ['Coconut oil', 'Rosemary', 'Castor oil'], true, 20],
  ['Still Water Eau de Parfum', 'Fragrance', 'Fragrance', 4800, '50 mL', 'A quiet, clean scent of river stone, white tea and soft musk.', ['Alcohol denat.', 'Fragrance', 'White tea extract'], true, 15],
  ['Smoked Fig Eau de Parfum', 'Fragrance', 'Fragrance', 5200, '50 mL', 'Fig leaf, dry smoke and sandalwood in a deep, warm composition.', ['Alcohol denat.', 'Fragrance', 'Sandalwood'], false, 12],
  ['Night Orchard Roll-On', 'Fragrance', 'Fragrance', 1900, '10 mL', 'A pocket-sized roll-on perfume oil with pear and cedar notes.', ['Jojoba oil', 'Fragrance'], false, 28],
  ['Hearth Soy Candle', 'Home', 'Candle', 2300, '220 g', 'A hand-poured soy candle with notes of woodsmoke and vanilla bean. About 45 hours of burn time.', ['Soy wax', 'Cotton wick', 'Fragrance'], true, 30],
  ['Rain Garden Candle', 'Home', 'Candle', 2300, '220 g', 'A fresh, green-scented candle with notes of wet leaves and mint.', ['Soy wax', 'Cotton wick', 'Fragrance'], false, 26],
  ['Stone Mist Room Spray', 'Home', 'Room Spray', 1450, '100 mL', 'A light room and linen mist with a calm, mineral scent.', ['Water', 'Fragrance', 'Witch hazel'], false, 0],
  ['Morning Ritual Set', 'Skin', 'Gift Set', 4500, '3 pieces', 'Cleanser, serum and moisturiser in travel sizes, packed in a recycled card box.', ['See individual products'], true, 14],
  ['Evening Hands Set', 'Body', 'Gift Set', 2900, '2 pieces', 'A hand balm and body wash pairing for slow evenings.', ['See individual products'], false, 3],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const products = raw.map(([name, category, productType, price, size, description, ingredients, featured, stock], i) => ({
  name, category, productType, price, size, description, ingredients, featured, stock,
  slug: slugify(name),
  image: img(slugify(name)),
  rating: Math.round((4.2 + ((i * 7) % 8) / 10) * 10) / 10,
}));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Order.deleteMany();
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
