import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.67:3535",
});

export default api;