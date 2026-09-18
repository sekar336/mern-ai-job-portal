import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  // User not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check role
    if (
      allowedRole &&
      decoded.role !== allowedRole
    ) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    // Invalid token
    localStorage.removeItem("token");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;