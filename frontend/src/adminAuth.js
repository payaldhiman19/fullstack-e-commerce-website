// Admin session lives under its own keys, separate from customers.
export const saveAdmin = (token, user) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminUser", JSON.stringify(user));
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

// returns the admin user, or null if not logged in as admin (or the token expired)
export const getAdmin = () => {
  try {
    const token = localStorage.getItem("adminToken");
    const user = JSON.parse(localStorage.getItem("adminUser"));
    if (!token || user?.role !== "admin") return null;

    // read the expiry date inside the token; treat an expired token as logged out
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return user;
  } catch {
    return null;
  }
};