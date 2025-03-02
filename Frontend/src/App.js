import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home.js";
import Activities from "./pages/activities.js";
import PageNotFound from "./pages/_PageNotFound.js";
import Dining from "./pages/dining.js";
import Problems from "./pages/Problems/problems.js";
import Tickets from "./pages/Tickets/tickets.js";
import Shop from "./pages/Shop/shop.js";
import Register from "./components/authentication/register.js";
import ManagerPortal from "./pages/Manager/ManagerPortal.js";
import EmployeePortal from "./pages/Employee/EmployeePortal.js";
import HandleLogin from "./components/authentication/HandleLogin.js";
import EmployeeLogin from "./components/employeeAuth/EmployeeLogin.js";
import AuthContext from "./context/AuthContext";
import UserContext from "./context/userContext";

function ProtectedRoute({ element, allowedRoles }) {
  const { isLoggedIn } = useContext(AuthContext);
  const { userType } = useContext(UserContext);

  if (!isLoggedIn || !allowedRoles.includes(userType)) {
    return <Navigate to="/" />;
  }
  return element;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/dining" element={<Dining />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<HandleLogin />} />
      <Route path="/ManagerPortal" element={<ManagerPortal />} />
      <Route
        path="/EmployeePortal"
        element={<ProtectedRoute element={<EmployeePortal />} allowedRoles={["employee"]} />}
      />
      <Route path="/EmployeeLogin" element={<EmployeeLogin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
