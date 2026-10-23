// import { useCart } from "../context/CartContext";

// const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

// const PaymentIcons = () => (
//   <div className="flex items-center justify-center gap-2 border-t border-gray-200 px-4 py-4">
//     <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-bold italic text-gray-600">
//       UPI
//     </div>
//     <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-sm font-extrabold italic text-blue-900">
//       VISA
//     </div>
//     <div className="flex h-10 w-16 items-center justify-center border border-gray-200">
//       <span className="h-5 w-5 rounded-full bg-red-600" />
//       <span className="-ml-2 h-5 w-5 rounded-full bg-orange-400 opacity-90" />
//     </div>
//     <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-semibold text-black">
//        Pay
//     </div>
//     <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-semibold text-gray-700">
//       G Pay
//     </div>
//     <div className="flex h-10 w-16 items-center justify-center bg-blue-600 text-[10px] font-extrabold tracking-tight text-white">
//       AMEX
//     </div>
//   </div>
// );

// const BagIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-8 w-8 fill-gray-700">
//     <path d="M6 7V6a6 6 0 0 1 12 0v1h2a1 1 0 0 1 1 1l1 13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2L3 8a1 1 0 0 1 1-1h2Zm2 0h8V6a4 4 0 0 0-8 0v1Zm0 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" />
//   </svg>
// );

// const CartDrawer = () => {
//   const { isOpen, closeCart, items, updateQty, removeItem, subtotal } = useCart();

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         onClick={closeCart}
//         className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${
//   isOpen ? "opacity-100" : "pointer-events-none opacity-0"
// }`}
//       />

//       {/* Drawer */}
//       <aside
//         className={`fixed right-0 top-0 z-[110] flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
//   isOpen ? "translate-x-0" : "translate-x-full"
// }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
//           <h2 className="text-lg text-gray-700">Cart</h2>
//           <button
//             onClick={closeCart}
//             aria-label="Close cart"
//             className="flex h-10 w-10 items-center justify-center border-2 border-black text-xl text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         {items.length === 0 ? (
//           <div className="flex flex-1 flex-col items-center pt-24 text-gray-500">
//             <BagIcon />
//             <p className="mt-3 text-lg">Your bag is empty</p>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 space-y-4 overflow-y-auto p-4">
//              {items.map((item) => (
//   <div key={item.lineId} className="flex gap-3">
//     <img
//       src={item.images?.[0]}
//       alt={item.name}
//       className="h-24 w-20 bg-pink-100 object-cover"
//     />
//     <div className="flex flex-1 flex-col">
//       <p className="line-clamp-2 text-sm text-gray-800">{item.name}</p>
//       <p className="text-xs text-gray-500">Size: {item.size}</p>
//       <div className="mt-1 flex items-center gap-2 text-sm">
//         <span className="font-semibold text-[#e0626a]">{fmt(item.price)}</span>
//         {item.comparePrice > item.price && (
//           <span className="text-gray-400 line-through">{fmt(item.comparePrice)}</span>
//         )}
//       </div>
//       <div className="mt-auto flex items-center justify-between">
//         <div className="flex items-center border border-gray-300">
//           <button onClick={() => updateQty(item.lineId, -1)} className="px-3 py-1">−</button>
//           <span className="px-3 text-sm">{item.qty}</span>
//           <button
//             onClick={() => updateQty(item.lineId, 1)}
//             disabled={item.qty >= item.maxStock}
//             className="px-3 py-1 disabled:text-gray-300"
//           >
//             +
//           </button>
//         </div>
//         <button
//           onClick={() => removeItem(item.lineId)}
//           className="text-xs text-gray-500 underline"
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   </div>
// ))}
//             </div>

//             <div className="border-t border-gray-200 p-4">
//               <div className="mb-3 flex justify-between text-gray-800">
//                 <span>Subtotal</span>
//                 <span className="font-semibold">{fmt(subtotal)}</span>
//               </div>
//               <button className="w-full bg-black py-3 text-sm uppercase tracking-widest text-white">
//                 Checkout
//               </button>
//             </div>
//           </>
//         )}

//         <PaymentIcons />
//       </aside>
//     </>
//   );
// };

// export default CartDrawer;



import { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

const emptyAddress = { name: "", phone: "", line1: "", city: "", state: "", pincode: "" };

const PaymentIcons = () => (
  <div className="flex items-center justify-center gap-2 border-t border-gray-200 px-4 py-4">
    <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-bold italic text-gray-600">
      UPI
    </div>
    <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-sm font-extrabold italic text-blue-900">
      VISA
    </div>
    <div className="flex h-10 w-16 items-center justify-center border border-gray-200">
      <span className="h-5 w-5 rounded-full bg-red-600" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-orange-400 opacity-90" />
    </div>
    <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-semibold text-black">
       Pay
    </div>
    <div className="flex h-10 w-16 items-center justify-center border border-gray-200 text-xs font-semibold text-gray-700">
      G Pay
    </div>
    <div className="flex h-10 w-16 items-center justify-center bg-blue-600 text-[10px] font-extrabold tracking-tight text-white">
      AMEX
    </div>
  </div>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-gray-700">
    <path d="M6 7V6a6 6 0 0 1 12 0v1h2a1 1 0 0 1 1 1l1 13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2L3 8a1 1 0 0 1 1-1h2Zm2 0h8V6a4 4 0 0 0-8 0v1Zm0 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" />
  </svg>
);

const CartDrawer = () => {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal, clearCart } = useCart();

  const [step, setStep] = useState("cart"); // "cart" | "address"
  const [address, setAddress] = useState(emptyAddress);
  const [paying, setPaying] = useState(false);

  const onAddr = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const addressValid =
    address.name.trim() &&
    /^\d{10}$/.test(address.phone) &&
    address.line1.trim() &&
    address.city.trim() &&
    /^\d{6}$/.test(address.pincode);

  const handleClose = () => {
    setStep("cart");
    closeCart();
  };

  const handlePay = async () => {
    if (!addressValid) {
      alert("Please fill all fields. Phone must be 10 digits and pincode 6 digits.");
      return;
    }
    setPaying(true);
    try {
      // 1. ask our backend to create the order (it decides the price)
      const { data } = await api.post("/payment/create-order", {
        items: items.map((i) => ({ productId: i._id, size: i.size, qty: i.qty })),
        address,
      });

      // 2. open the Razorpay popup
      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Rivana",
        description: "Order payment",
        order_id: data.orderId,
        prefill: { name: address.name, contact: address.phone },
        theme: { color: "#000000" },
        handler: async (response) => {
          // 3. payment done: ask our backend to verify the signature
          try {
            const verify = await api.post("/payment/verify", response);
            if (verify.data.success) {
              clearCart();
              setAddress(emptyAddress);
              handleClose();
              alert("Payment successful! Your order is confirmed.");
            }
          } catch {
            alert("Payment verification failed. If money was deducted, please contact support.");
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.on("payment.failed", () => alert("Payment failed. Please try again."));
      rzp.open();
    } catch (e) {
      alert(e.response?.data?.error || e.response?.data?.message || e.message);
    } finally {
      setPaying(false);
    }
  };

  const inputCls = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg text-gray-700">{step === "cart" ? "Cart" : "Shipping details"}</h2>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center border-2 border-black text-xl text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center pt-24 text-gray-500">
            <BagIcon />
            <p className="mt-3 text-lg">Your bag is empty</p>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.lineId} className="flex gap-3">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="h-24 w-20 bg-pink-100 object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-2 text-sm text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="font-semibold text-[#e0626a]">{fmt(item.price)}</span>
                      {item.comparePrice > item.price && (
                        <span className="text-gray-400 line-through">{fmt(item.comparePrice)}</span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300">
                        <button onClick={() => updateQty(item.lineId, -1)} className="px-3 py-1">
                          −
                        </button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.lineId, 1)}
                          disabled={item.qty >= item.maxStock}
                          className="px-3 py-1 disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        className="text-xs text-gray-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="mb-3 flex justify-between text-gray-800">
                <span>Subtotal</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              <button
                onClick={() => setStep("address")}
                className="w-full bg-black py-3 text-sm uppercase tracking-widest text-white"
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <input name="name" value={address.name} onChange={onAddr} placeholder="Full name" className={inputCls} />
              <input
                name="phone"
                value={address.phone}
                onChange={onAddr}
                placeholder="Phone (10 digits)"
                maxLength={10}
                inputMode="numeric"
                className={inputCls}
              />
              <input name="line1" value={address.line1} onChange={onAddr} placeholder="Address" className={inputCls} />
              <div className="flex gap-3">
                <input name="city" value={address.city} onChange={onAddr} placeholder="City" className={inputCls} />
                <input name="state" value={address.state} onChange={onAddr} placeholder="State" className={inputCls} />
              </div>
              <input
                name="pincode"
                value={address.pincode}
                onChange={onAddr}
                placeholder="Pincode"
                maxLength={6}
                inputMode="numeric"
                className={inputCls}
              />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="mb-3 flex justify-between text-gray-800">
                <span>Total</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full bg-black py-3 text-sm uppercase tracking-widest text-white disabled:opacity-50"
              >
                {paying ? "Please wait..." : `Pay ${fmt(subtotal)}`}
              </button>
              <button
                onClick={() => setStep("cart")}
                className="mt-2 w-full text-xs text-gray-500 underline"
              >
                Back to cart
              </button>
            </div>
          </>
        )}

        <PaymentIcons />
      </aside>
    </>
  );
};

export default CartDrawer;