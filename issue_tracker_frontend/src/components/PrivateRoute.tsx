import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token !== null) {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
