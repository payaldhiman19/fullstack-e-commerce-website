import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const links = [
  { label: "My Orders", to: "/orders" },
  { label: "Track Orders", to: "/track-orders" },
  { label: "Exchange Request", to: "/exchange" },
  { label: "Tickets", to: "/tickets" },
  { label: "Help / Support", to: "/contact" },
];

const AccountMenu = ({ user, setUser, setShowAuth }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // close when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleIconClick = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setOpen((o) => !o);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={handleIconClick} aria-label="Account" className="flex items-center">
        <User size={26} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-60 rounded bg-white py-2 shadow-lg">
          {user?.name && (
            <p className="border-b px-5 pb-2 pt-1 text-sm text-gray-500">Hi, {user.name}</p>
          )}
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-gray-700 hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="block w-full border-t px-5 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;