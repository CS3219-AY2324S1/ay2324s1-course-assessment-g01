import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { logout } from "../services/UserAPI";

const Logout = () => {
  const { logout: logoutFromContext } = useContext(UserContext);
  logout();
  logoutFromContext();
  return <></>;
};

export default Logout;
