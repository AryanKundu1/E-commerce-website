import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { calcShipping } from '../utils/pricing';

const CartContext = createContext(null);
const STORAGE_KEY = 'elan_cart';

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const itemsRef = useRef(items); // always holds the latest cart for synchronous checks
  itemsRef.current = items;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }, [items]);

  useEffect(() => {
    const onStorage = (e) => e.key === STORAGE_KEY && setItems(loadCart());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((product, quantity = 1) => {
    if (product.stock < 1) {
      toast.error(`${product.name} is out of stock`);
      return false;
    }
    const existing = itemsRef.current.find((i) => i.productId === product._id);
    const newQty = (existing?.quantity || 0) + quantity;
    if (newQty > product.stock) {
      toast.error(`Only ${product.stock} of ${product.name} available`);
      return false;
    }
    const entry = {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      quantity: newQty,
    };
    setItems((prev) =>
      prev.some((i) => i.productId === product._id)
        ? prev.map((i) => (i.productId === product._id ? entry : i))
        : [...prev, entry]
    );
    toast.success(`${product.name} added to your bag`);
    return true;
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    toast('Removed from your bag');
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = calcShipping(subtotal);
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    };
  }, [items, addItem, setQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
