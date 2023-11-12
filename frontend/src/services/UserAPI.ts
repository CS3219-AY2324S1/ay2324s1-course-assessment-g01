import { User } from "../types/User";
import { baseInstance, setInterceptor } from "./apiInstance";

type RegisterUser = {
  email: string;
  password: string;
  name: string;
};

export const register = async (user: RegisterUser) => {
  // TODO: remove access_type
  const res = await baseInstance.post("/user/register", {
    ...user,
    access_type: "1",
  });
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
  const data = await baseInstance.post<User>("/user");
  return data.data;
};

export const getOtherUserData = async (id: number) => {
  const data = await baseInstance.get<User>("/user", { params: { id } });
  return data.data;
};

export const logout = () => {
  baseInstance.interceptors.request.clear();
  localStorage.removeItem("jwt");
};

// TODO: should use JWT to determine user
export const deregister = async (user_id: number) => {
  const data = await baseInstance.post("/user/deregister", { user_id });
  return data.data;
};

export const changeName = async (name: string) => {
  const data = await baseInstance.post("/user/changename", {
    name,
  });
  return data.data;
};

export const changePassword = async (newPassword: string, oldPassword: string) => {
  const data = await baseInstance.post("/user/changepassword", {
    password: newPassword,
    oldPassword,
  });
  return data.data;
};
