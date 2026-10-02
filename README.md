# ÉLAN

A minimalist e-commerce site (skincare, body, hair, fragrance, home) built with the MERN stack for a college assignment. The look is inspired by premium editorial brands; the brand, copy and products are original and fictional.

## Features (mapped to the assignment)

| Requirement | Where it is |
|---|---|
| Robust JS and async state handling | `hooks/useAsync.js` (loading / error / data, request cancellation), `CartContext.jsx` |
| Form validation | Checkout (`utils/validators.js` + server-side re-validation), newsletter, price filter |
| Graceful error handling | Axios interceptor (`services/api.js`) turns API downtime and timeouts into friendly messages; `ErrorState` with a Try again button; empty states for search, bag, 404 |
| Client-side storage | `localStorage`: bag (`elan_cart`), newsletter; `sessionStorage`: checkout form draft |
| Skeleton loaders / spinners | `Skeleton.jsx` on shop, home, product page; spinner on Place order |
| Toast notifications | `react-hot-toast` for bag actions, order success, errors |
| Mobile responsive | CSS Modules, hamburger menu, filter drawer, 2-column grids, tested down to 320px layouts |
| Backend + DB | Express REST API, MongoDB via Mongoose |

Also included: live debounced search, multi-category and product-type filters, price range, in-stock filter, 6 sort options, pagination, and URL query parameters (shareable, e.g. `/shop?category=Skin,Body&minPrice=1000&sort=price-low`).

Deliberately left out to keep the project simple: login/accounts, admin panel, reviews, wishlist. Orders are guest orders.

## Tech stack
React 18 + Vite, React Router, Context API, Axios, react-hot-toast, CSS Modules · Node.js, Express, MongoDB, Mongoose.

## Folder structure
```
elan/
├── package.json            (root scripts)
├── client/                 React app
│   └── src/ components/ pages/ context/ services/ hooks/ utils/
└── server/                 Express API
    ├── config/db.js  models/  controllers/  routes/  middleware/  seed/seed.js  server.js
```

## Setup

**Prerequisites:** Node.js 18+, and MongoDB (local install, or a free MongoDB Atlas cluster).

1. Install everything (from the `elan` folder):
   ```bash
   npm run install-all
   ```
2. Create the env files by copying the examples:
   - `server/.env.example` → **`server/.env`**
   - `client/.env.example` → **`client/.env`**

   `server/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/elan
   CLIENT_URL=http://localhost:5173
   ```
   (For Atlas, paste your connection string into `MONGO_URI`.)

   `client/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Load the 20 sample products:
   ```bash
   npm run seed
   ```
4. Start both apps:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 (API health check: http://localhost:5000/api/health).

## API

All responses: `{ "success": true, "data": ... }` or `{ "success": false, "message": "..." }`.

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | API + DB status |
| GET | `/api/products` | Query: `search, category (comma list), type (comma list), minPrice, maxPrice, inStock, featured, sort, page, limit`. Returns `products, currentPage, totalPages, totalProducts` |
| GET | `/api/products/filters` | Available categories and types |
| GET | `/api/products/:idOrSlug` | Product + related products |
| POST | `/api/orders` | Body: `{ items:[{productId, quantity}], shippingAddress, paymentMethod: "COD" or "DEMO_CARD" }` |
| GET | `/api/orders/:id` | Order details |

`sort` values: `featured, price-low, price-high, name-asc, name-desc, rating`.

## Testing checklist
- [ ] Shop loads with skeletons, then 9 products per page; pagination works
- [ ] Typing in search filters live after a short pause; URL updates
- [ ] Multiple categories / types, price range (try min > max), in-stock only, each sort option
- [ ] Search `zzzz` shows the empty state; "Clear search and filters" resets
- [ ] Stop the server, refresh: error state appears; start it and press Try again
- [ ] Add to bag from card and product page; quantity cannot exceed stock (try *Evening Hands Set*, stock 3)
- [ ] *Stone Mist Room Spray* is out of stock and cannot be added
- [ ] Refresh the page: bag is still there (localStorage)
- [ ] Checkout: submit empty form shows errors; bad email/phone/postal code are rejected
- [ ] Place a COD order and a demo-card order: redirect to order page, bag cleared, stock reduced
- [ ] Resize to 320px, 375px, 768px, 1024px: no horizontal scroll; hamburger menu and filter drawer work
- [ ] Unknown URL shows the 404 page

## Common errors
- **`MongoDB connection failed`**: MongoDB is not running, or `MONGO_URI` is wrong. For Atlas, whitelist your IP.
- **Shop shows "Unable to reach the server"**: start the backend; check `VITE_API_URL` and restart Vite after editing `.env`.
- **CORS error**: `CLIENT_URL` in `server/.env` must match the address in your browser exactly.
- **Empty shop**: run `npm run seed`.
- **Product images are blank/grey**: the demo images come from picsum.photos and need internet; a placeholder is shown if they fail.

## Viva notes
- **Why React?** Component reuse and state-driven UI. **Why Context API?** The bag is needed by the navbar, product cards, cart and checkout; Context avoids prop drilling without extra libraries.
- **Why Express/Node/MongoDB/Mongoose?** One language across the stack; Express is a thin REST layer; MongoDB's documents suit products and orders; Mongoose adds schemas and validation.
- **How filtering works:** the URL holds the filters. When it changes, React calls `GET /api/products` with those params, and the controller builds a MongoDB query (regex search, `$in` for categories, `$gte/$lte` for price), sorts, and paginates with `skip/limit`.
- **Live search:** `useDebounce` waits 350 ms after typing stops, so one request is sent instead of one per keystroke. Old in-flight requests are cancelled with `AbortController`.
- **How the bag works:** state in `CartContext`, saved to `localStorage` on every change and read back on load. Quantity is capped at stock.
- **How orders are safe:** the client sends only product ids and quantities. The server loads real prices, checks stock, computes subtotal/shipping/total (free shipping at ₹2000+, else ₹99), decrements stock atomically, then saves the order.
- **Error handling:** the Axios interceptor and Express error middleware both produce clear messages; the UI shows them with `ErrorState` or a toast.
- **Why localStorage / sessionStorage?** localStorage keeps the bag across visits; sessionStorage keeps the half-filled checkout form only for the current tab.

## Future improvements
User accounts, order history, wishlist, reviews, admin dashboard, real payment gateway.
