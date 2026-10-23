import { Navigate } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/storage";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
