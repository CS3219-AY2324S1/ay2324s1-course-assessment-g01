import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "http://localhost:5173/api/v1", // TODO: change to env for deployment
});

// TODO: change for login
baseInstance.interceptors.request.use((req) => {
  req.headers.set("Authorization", "Bearer placeholder");
  return req;
});
