import { User } from "../types/User";
import { baseInstance, setInterceptor } from "./apiInstance";

type RegisterUser = {
  email: string;
  password: string;
  name: string;
  access_type: string;
};

export const register = async (user: RegisterUser) => {
  const res = await baseInstance.post("/user/register", user);
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await baseInstance.post<{ jwt: string }>("/user/login", {
    email,
    password,
  });

  setInterceptor(res.data.jwt);
  return res.data;
};

export const getUserData = async () => {
  const data = await baseInstance.post<Omit<User, "jwt">>("/user");
  return data.data;
};

export const logout = () => {
  baseInstance.interceptors.request.clear();
  localStorage.removeItem("user");
};
