import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, token } = useUser();

  if (token === null) {
    return <Navigate to="/login" />;
  }

  if (user === null) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return children;
};

export default PrivateRoute;
