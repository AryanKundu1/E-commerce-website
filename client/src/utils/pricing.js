
export const FREE_SHIPPING_ABOVE = 2000;
export const SHIPPING_FEE = 99;

export const calcShipping = (subtotal) => (subtotal === 0 || subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE);

export const formatPrice = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
