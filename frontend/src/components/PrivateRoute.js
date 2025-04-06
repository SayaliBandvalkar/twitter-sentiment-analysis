// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const isAuthenticated = localStorage.getItem("authToken"); // ✅ Check if token exists
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;











// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const authToken = localStorage.getItem("authToken");

//   return authToken ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;




















import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const authToken = localStorage.getItem("authToken");
  const location = useLocation(); // To capture the location the user was trying to visit

  // Optionally check for token expiry here (if using JWT)
  // Example: decode token and check expiry

  return authToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
