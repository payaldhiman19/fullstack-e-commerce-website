import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(loadCart);

  // keep the cart after refresh
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // each cart line is one product in one size
  const addToCart = (product, size) => {
    const stock = product.sizes?.find((s) => s.size === size)?.stock ?? 1;
    const lineId = `${product._id}-${size}`;

    setItems((prev) => {
      const found = prev.find((i) => i.lineId === lineId);
      if (found) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, qty: Math.min(i.qty + 1, stock) } : i
        );
      }
      return [
        ...prev,
        {
          lineId,
          _id: product._id,
          slug: product.slug,
          name: product.name,
          images: product.images,
          price: product.price,
          comparePrice: product.comparePrice,
          size,
          maxStock: stock,
          qty: 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const updateQty = (lineId, delta) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.lineId === lineId
            ? { ...i, qty: Math.min(i.qty + delta, i.maxStock) }
            : i
        )
        .filter((i) => i.qty > 0)
    );

  const removeItem = (lineId) =>
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        isOpen, openCart, closeCart, items,
        addToCart, updateQty, removeItem, clearCart,
        count, subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);