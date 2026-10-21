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
//Whenever items changes, the effect saves the latest cart to localStorage.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // each cart line is one product in one size
  const addToCart = (product, size) => {
    const stock = product.sizes?.find((s) => s.size === size)?.stock ?? 1;//check stock
    const lineId = `${product._id}-${size}`;

    setItems((prev) => {//if already in cart
      const found = prev.find((i) => i.lineId === lineId);
      if (found) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, qty: Math.min(i.qty + 1, stock) } : i  //increases the count
        );
      }
      //if not add new item in cart
      return [
        ...prev,   //copies the existing items and new item with quantity of 1
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
    setIsOpen(true);   // after adding cartdrawerr open automatically
  };
//adding and removing from cart   ---delta is quantity change    min prevents exceeing the maxstock
  const updateQty = (lineId, delta) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.lineId === lineId
            ? { ...i, qty: Math.min(i.qty + delta, i.maxStock) }
            : i
        )
        .filter((i) => i.qty > 0)   //removes any quantity whose quantity reached zero.
    );

  const removeItem = (lineId) =>
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));  //keeps only the items whose IDs don't match the selected item.

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