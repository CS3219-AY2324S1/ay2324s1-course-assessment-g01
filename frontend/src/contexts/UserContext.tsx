import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { setInterceptor } from "../services/apiInstance";
import { LoadingOverlay } from "@mantine/core";

type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps,
);
const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setuser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user: User = JSON.parse(localStorage.getItem("user")!);
      setuser(user);
      setInterceptor(user.jwt);
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser(user) {
          setuser(user);
        },
      }}
    >
      {loading ? <LoadingOverlay visible={true} /> : children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
