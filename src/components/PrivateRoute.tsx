import { UserAuth } from "./AuthContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { session } = UserAuth();
  return <>{session ? <>{children}</> : <Navigate to="/signup" />} </>;
};

export default PrivateRoute;
