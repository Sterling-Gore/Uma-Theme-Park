import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.js";
import Activities from "./pages/activities.js";
import PageNotFound from "./pages/_PageNotFound.js";
import Dining from "./pages/dining.js";
import Problems from "./pages/Problems/problems.js";
import Tickets from "./pages/Tickets/tickets.js";
import Shop from "./pages/Shop/shop.js";
import Register from "./components/authentication/register.js";
import Login from "./components/authentication/login.js";
import ManagerPortal from "./pages/Manager/ManagerPortal.js";
import EmployeePortal from "./pages/Employee/EmployeePortal.js";

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
      <Route path="/login" element={<Login />} />
      <Route path="/ManagerPortal" element={<ManagerPortal />} />
      <Route path="/EmployeePortal" element={<EmployeePortal />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
