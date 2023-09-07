import { baseInstance } from "./apiInstance";

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
