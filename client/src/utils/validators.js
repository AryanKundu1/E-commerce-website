const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^[6-9]\d{9}$/;
const PIN_RX = /^\d{6}$/;

export const isEmail = (v) => EMAIL_RX.test(v.trim());

export const validateShipping = (f) => {
  const e = {};
  const t = (v) => (v || '').trim();
  if (!t(f.fullName)) e.fullName = 'Enter your full name';
  else if (t(f.fullName).length < 2 || t(f.fullName).length > 60) e.fullName = 'Name must be 2–60 characters';
  if (!t(f.email)) e.email = 'Enter your email address';
  else if (!EMAIL_RX.test(t(f.email))) e.email = 'Enter a valid email, like name@example.com';
  if (!t(f.phone)) e.phone = 'Enter your phone number';
  else if (!PHONE_RX.test(t(f.phone))) e.phone = 'Enter a 10-digit mobile number';
  if (!t(f.address)) e.address = 'Enter your address';
  else if (t(f.address).length < 5 || t(f.address).length > 150) e.address = 'Address must be 5–150 characters';
  if (!t(f.city)) e.city = 'Enter your city';
  if (!t(f.state)) e.state = 'Enter your state';
  if (!t(f.postalCode)) e.postalCode = 'Enter your postal code';
  else if (!PIN_RX.test(t(f.postalCode))) e.postalCode = 'Postal code must be 6 digits';
  return e;
};

export const validateCard = (c) => {
  const e = {};
  const digits = (c.number || '').replace(/\s/g, '');
  if (!/^\d{16}$/.test(digits)) e.cardNumber = 'Enter a 16-digit card number';
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(c.expiry || '');
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.cardExpiry = 'Use the format MM/YY';
  if (!/^\d{3}$/.test(c.cvv || '')) e.cardCvv = 'Enter a 3-digit CVV';
  return e;
};
