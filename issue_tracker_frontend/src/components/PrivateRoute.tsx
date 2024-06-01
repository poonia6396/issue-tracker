import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useUser();

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
