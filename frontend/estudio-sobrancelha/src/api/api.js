import axios from "axios";

const api = axios.create({
  baseURL: "https://studio-brow.onrender.com",
});

export default api;