import axios, { AxiosError } from "axios";

export const baseInstance = axios.create({
  baseURL: "/api/v1", // TODO: change to env for deployment
});

export const setInterceptor = (token: string) => {
  baseInstance.interceptors.request.clear();
  baseInstance.interceptors.request.use((req) => {
    req.headers.set("Authorization", "Bearer " + token);
    return req;
  });
  baseInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error: AxiosError) => {
      console.log(error);

      if (error.response?.status == 401) {
        window.location.href = "/logout";
      }
      return Promise.reject(error);
    },
  );
};
