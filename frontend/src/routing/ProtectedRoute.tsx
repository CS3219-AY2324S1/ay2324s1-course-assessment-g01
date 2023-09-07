import React, { PropsWithChildren, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user } = useContext(UserContext);
  const nav = useNavigate();
  if (!user) {
    nav("/login");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
