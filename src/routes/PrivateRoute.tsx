import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;

// import { UserAuth } from "./AuthContext";
// import type { ReactNode } from "react";
// import { Navigate } from "react-router-dom";

// interface PrivateRouteProps {
//   children: ReactNode;
// }

// const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   const auth = UserAuth();
//   const session = auth?.session;
//   return <>{session ? <>{children}</> : <Navigate to="/signup" />} </>;
// };

// export default PrivateRoute;
