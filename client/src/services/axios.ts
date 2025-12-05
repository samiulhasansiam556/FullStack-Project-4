import axios from "axios";

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  console.log("apiURL",apiURL)

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true, // important for sending cookies
});

export default api;
