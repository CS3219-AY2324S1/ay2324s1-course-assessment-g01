import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { setInterceptor } from "../services/apiInstance";
import { LoadingOverlay } from "@mantine/core";

type UserContextProps = {
  jwt: string | null;
  setJwt: (string: string) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps,
);
const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setJwt(localStorage.getItem("jwt")!);
      setInterceptor(localStorage.getItem("jwt")!);
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        jwt,
        setJwt,
        logout() {
          setJwt(null);
        },
      }}
    >
      {loading ? <LoadingOverlay visible={true} /> : children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
