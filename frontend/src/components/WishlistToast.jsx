import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const WishlistToast=()=>{
      const { toast, hideToast, count } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onWishlistPage = pathname === "/wishlist";
  // hide by itself after 4 seconds; a new click starts the timer again
useEffect(()=>{
    if(!toast)return;
    const timer=setTimeout(hideToast,4000);
    return ()=>clearTimeout(timer);
},[toast,hideToast]);
if(!toast)return null;
const goToWishlist = () => {
    hideToast();
    navigate("/wishlist");
  };
    const message = toast.added ? "Added to wishlist" : "Removed from wishlist";
const content=(
    <>
    <span
  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
    toast.added
      ? "bg-[#fdecee] text-[#e0626a]"
      : "bg-gray-100 text-gray-500"
  }`}
>
  <Heart
    size={18}
    fill={toast.added ? "currentColor" : "none"}
  />
</span>

<span className="min-w-0">
        <span className="block text-sm text-gray-900">{message}</span>
        {!onWishlistPage && (     //if not on wishlistpage then shows the voew wishlist button
          <span className="block text-xs uppercase tracking-wider text-[#e0626a]">
            View wishlist ({count}) →
          </span>
        )}
      </span>  
    </>
  );
  
  return(
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-20 left-4 right-4 z-[300] md:bottom-auto md:left-auto md:right-6 md:top-40 md:w-80"
      >
       <div
        key={toast.key}
        className="toast-in flex items-center gap-3 border border-gray-200 bg-white p-3 shadow-lg"
      >
       {onWishlistPage ? (
          <div className="flex flex-1 items-center gap-3">{content}</div>
        ) : (
          <button
            type="button"
            onClick={goToWishlist}
            aria-label="Open wishlist"
            className="flex flex-1 items-center gap-3 text-left"
          >
            {content}
          </button>
        )}
         <button
          type="button"
          onClick={hideToast}
          aria-label="Dismiss message"
          className="shrink-0 p-1 text-gray-400 hover:text-black"
        >
        <X size={16} />  
        </button>
        </div>
    </div>

    
  );
};
export default WishlistToast;