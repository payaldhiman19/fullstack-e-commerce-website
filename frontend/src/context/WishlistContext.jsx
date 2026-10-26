import { createContext,  useCallback,useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children,user }) => {
  const [ids, setIds] = useState(load);
  const [toast, setToast] = useState(null); // NEW: the message to show

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(ids));
  }, [ids]);

  const isWished = (id) => ids.includes(id);

  const toggleWish = (id) =>{
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    setToast({
      key:Date.now(),
      loginRequired:true,
    });
    return;
  }
    const added = !ids.includes(id);

    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setToast({ key: Date.now(), added });
  };
     const hideToast = useCallback(() => setToast(null), []);

  return (
    <WishlistContext.Provider value={{ ids, isWished, toggleWish, count: ids.length, toast, hideToast }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);