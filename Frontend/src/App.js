import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import PageNotFound from "./pages/_PageNotFound.js";
import Dining from "./pages/dining/dining.js";
import Problems from "./pages/Problems/problems.js";
import Tickets from "./pages/Tickets/tickets.js";
import Shop from "./pages/Shop/shop.js";
import Shoppingcart from "./pages/ShoppingCart/shoppingcart.js";
import Register from "./components/authentication/register.js";
import ManagerPortal from "./pages/Manager/ManagerPortal.js";
import EmployeePortal from "./pages/Employee/EmployeePortal.js";
import HandleLogin from "./components/authentication/HandleLogin.js";
import EmployeeLogin from "./components/employeeAuth/EmployeeLogin.js";
import AuthContext from "./context/AuthContext.js";
import ProtectedRoute from "./components/authentication/ProtectedRoute.js";
import Activities from "./pages/activities/activities.js";
import Account from "./pages/account/Account.js";
import MyOrders from "./pages/account/MyOrders/MyOrders.js";
import MerchandiseOrders from "./pages/account/MyOrders/MerchandiseOrders.js";
import Footer from "./components/Footer/Footer.js";

function App() {
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);

  console.log("App.js Rendered → isLoggedIn:", isLoggedIn, "| userType:", userType);

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Determine if footer should be displayed
  const shouldShowFooter = !(isLoggedIn && (userType === 'employee' || userType === 'manager'));

  return (
    <>
      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shopping-cart" element={<Shoppingcart />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/account" element={<Account />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/merchandise-orders" element={<MerchandiseOrders />} />

          {/* Auth routes with redirects if already logged in */}
          <Route path="/register" element={
            isLoggedIn ? <Navigate to="/" /> : <Register />
          } />
          <Route path="/login" element={
            isLoggedIn ?
              (userType === 'employee' ? <Navigate to="/EmployeePortal" /> :
                userType === 'manager' ? <Navigate to="/ManagerPortal" /> : <Navigate to="/" />)
              : <HandleLogin />
          } />
          <Route path="/EmployeeLogin" element={
            isLoggedIn && userType === 'employee' ?
              <Navigate to="/EmployeePortal" /> : <EmployeeLogin />
          } />

          {/* Protected routes */}
          <Route
            path="/ManagerPortal"
            element={<ProtectedRoute element={<ManagerPortal />} requiredUserType="manager" />}
          />
          <Route
            path="/EmployeePortal"
            element={<ProtectedRoute element={<EmployeePortal />} requiredUserType="employee" />}
          />

          {/* 404 route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default App;