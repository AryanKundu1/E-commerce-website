# ÉLAN      ARYAN KUNDU 25BCE11217

ÉLAN is an online store for skincare, body care, hair care, fragrance and home products. I built it as my assignment for iOS CLUB using the MERN stack (MongoDB, Express, React, Node). The brand, product names and text are all made up. 

**Live site:** https://e-commerce-website-jki2.onrender.com
**API:** https://e-commerce-website-u5sh.onrender.com/api/health

The API runs on a free hosting plan that goes to sleep when idle, so the first load can take up to a minute.



## What you can do on the site

- Browse 20 products and open any of them for details, ingredients and related items
- Search as you type, filter by category, product type, price and availability, and sort six different ways
- Move between pages of results (9 products per page)
- Add items to a bag, change quantities, remove items, and see subtotal, shipping and total
- Check out with a delivery form and either Cash on Delivery or a demo card payment (no real payment is taken)
- See an order confirmation page for every order placed
- Read the About and Journal pages

I left out login, an admin panel, reviews and a wishlist on purpose. The assignment didn't ask for them, and I wanted the core features done properly. Orders are placed as a guest.

## How it meets the assignment requirements

| Requirement | How I did it |
|---|---|
| JavaScript logic and async state | A custom `useAsync` hook handles loading, error and data states and cancels outdated requests. The bag lives in `CartContext`. |
| Form validation | Checkout fields (email, 10-digit phone, 6-digit postal code, lengths), card fields, newsletter and price range are all validated. The server checks the order again. |
| Graceful error handling | If the API is down or slow, users see a clear message and a "Try again" button instead of a blank page. There are also empty states for no search results and an empty bag, and a 404 page. |
| Client-side storage | `localStorage` keeps the bag between visits. `sessionStorage` keeps a half-filled checkout form if the page is refreshed. |
| Loading feedback | Skeleton cards while products load, and a spinner on the Place order button. |
| Toast notifications | Shown when items are added or removed, when an order is placed, and when something fails. |
| Responsive design | CSS Modules throughout, a hamburger menu and a filter drawer on mobile, and layouts checked down to small phone widths. |
| Backend and database | Express REST API with MongoDB through Mongoose. |

## Tech stack

- **Frontend:** React 18, CSS Modules
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (local, or Atlas in the cloud)

## Folder structure

```
elan/
├── package.json          root scripts
├── client/               React app
│   └── src/
│       ├── components/   Navbar, Footer, ProductCard, FilterPanel, Skeleton...
│       ├── pages/        Home, Shop, ProductDetails, Cart, Checkout, OrderDetails, About, Journal, NotFound
│       ├── context/      CartContext
│       ├── services/     api.js, productService.js, orderService.js
│       ├── hooks/        useAsync, useDebounce
│       └── utils/        pricing, validators, journal content
└── server/               Express API
    ├── config/           database connection
    ├── models/           Product, Order
    ├── controllers/      product and order logic
    ├── routes/
    ├── middleware/       error handling
    ├── seed/             sample data script
    └── server.js
```


## How a few things work

**Filtering and search.** The shop page keeps every filter in the URL, so a filtered view can be bookmarked or shared. When the URL changes, the page asks the API for matching products and the server builds the MongoDB query. Search waits 350 ms after the last keystroke before sending a request, so it doesn't fire on every letter.

**The bag.** Bag items are stored in React context and saved to `localStorage` whenever they change, so they survive a refresh. Quantity can never go above the stock count.

**Orders.** The browser sends only product ids and quantities. The server looks up the real prices, checks stock, works out the subtotal, shipping and total, reduces the stock, and then saves the order. This way nobody can change a price from the browser. Shipping is free above ₹2,000 and ₹99 otherwise.

## Deployment

The app is deployed on Render with the database on MongoDB Atlas.

- **Database:** Atlas free cluster, with a database user and `0.0.0.0/0` allowed under Network Access. The seed script was run once against it.
- **Backend:** Render Web Service with root directory `server`, build command `npm install` and start command `npm start`. Environment variables are `MONGO_URI` and `CLIENT_URL` (the exact frontend address).
- **Frontend:** Render Static Site with root directory `client`, build command `npm install && npm run build` and publish directory `dist`. The environment variable `VITE_API_URL` is the backend address ending in `/api`. A rewrite rule from `/*` to `/index.html` makes page refreshes work.

## Testing checklist

- [ ] Shop loads with skeletons, then products, and pagination works
- [ ] Search filters as you type and the URL updates
- [ ] Category, type, price, in-stock filters and all sort options work together
- [ ] Searching for nonsense shows the empty state and the clear button resets it
- [ ] With the server stopped, the shop shows an error with a Try again button
- [ ] Items can be added from cards and the product page, and quantity stops at stock
- [ ] Out-of-stock products cannot be added
- [ ] The bag is still there after a refresh
- [ ] Empty or invalid checkout fields show clear error messages
- [ ] Cash on Delivery and demo card orders both work, the bag clears and stock goes down
- [ ] The layout works on phone, tablet and desktop widths with no sideways scrolling
- [ ] An unknown URL shows the 404 page



## Possible improvements

User accounts with order history, an admin dashboard for managing products and orders, product reviews, a wishlist, and a real payment gateway.

