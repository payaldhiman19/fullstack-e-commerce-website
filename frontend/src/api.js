// import axios from "axios";
// //it helps avoid hardcoding the base URL in every request and allows for easier configuration and maintenance of the API endpoints.
// const api = axios.create({ baseURL: "http://localhost:5000/api" });
// //it helps avoid writing authorization headers manually for every request,ensuring that the token is always included in the request while making api call to protected routes
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// admin pages use the admin login, every other page uses the customer login
const inAdminArea = () => window.location.pathname.startsWith("/admin");

// before every request: attach the right token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(inAdminArea() ? "adminToken" : "token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// after every response: if the admin login has expired, send them to the admin login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      inAdminArea() &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;