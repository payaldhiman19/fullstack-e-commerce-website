import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(ids));
  }, [ids]);

  const isWished = (id) => ids.includes(id);

  const toggleWish = (id) =>
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <WishlistContext.Provider value={{ ids, isWished, toggleWish, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);