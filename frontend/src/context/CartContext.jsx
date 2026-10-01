import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsOpen(true);
  };

  const updateQty = (id, delta) =>
    setItems((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i._id !== id));

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ isOpen, openCart, closeCart, items, addToCart, updateQty, removeItem, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);