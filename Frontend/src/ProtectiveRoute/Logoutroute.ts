import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { store } from "../Reduxstore/Reduxstore";
import { useLocation, useNavigate } from "react-router-dom";

type RootState = ReturnType<typeof store.getState>;

interface ProtectiveCheckProps {
  element: React.ReactNode;
}

const UserLogoutPrivateRoute: React.FC<ProtectiveCheckProps> = ({
  element,
}) => {
  const isUserAuthenticated = useSelector(
    (state: RootState) => state.accessStore.userTocken
  );
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/dashboard", { state: { from: location } });
    }
  }, [isUserAuthenticated, navigate, location]);
  return isUserAuthenticated ? null : element;
};

export default UserLogoutPrivateRoute;
