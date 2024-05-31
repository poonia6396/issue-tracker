import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;
