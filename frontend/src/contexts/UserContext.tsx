import React, { PropsWithChildren, createContext, useState } from "react";

type User = {
  jwt: string;
  name: string;
  access_type: string;
  email: string;
  userId: string;
};

type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps,
);

const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setuser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser(user) {
          setuser(user);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
