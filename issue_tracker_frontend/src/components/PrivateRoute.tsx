import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useUser();

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
