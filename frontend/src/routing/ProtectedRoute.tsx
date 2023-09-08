import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useContext(UserContext);
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav("/login");
    }
  }, [nav, user]);

  return <Outlet />;
};

export default ProtectedRoute;
