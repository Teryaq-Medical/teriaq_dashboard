import axios from "axios";


const is_production = false

const api = axios.create({
    baseURL: is_production ? "https://teriaq-medical-be.onrender.com/api" : "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
