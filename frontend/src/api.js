import axios from "axios";
//it helps avoid hardcoding the base URL in every request and allows for easier configuration and maintenance of the API endpoints.
const api = axios.create({ baseURL: "http://localhost:5000/api" });
//it helps avoid writing authorization headers manually for every request,ensuring that the token is always included in the request while making api call to protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;