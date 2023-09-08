import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { jwt } = useContext(UserContext);
  const nav = useNavigate();
  useEffect(() => {
    if (!jwt) {
      nav("/login");
    }
  }, [nav, jwt]);

  return <Outlet />;
};

export default ProtectedRoute;
