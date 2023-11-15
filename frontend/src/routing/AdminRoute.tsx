import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../services/UserAPI";
import { isAdmin } from "../utils/userUtils";
import { User } from "../types/User";
import { useEffect } from "react";
import { Loader } from "@mantine/core";

const AdminRoute = () => {
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
  });

  const nav = useNavigate();
  useEffect(() => {
    if (data && !isAdmin(data)) nav("/");
  }, [data, nav]);
  if (!data || !isAdmin(data)) return <Loader />;
  return <Outlet />;
};

export default AdminRoute;
