import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.js";
import Activities from "./pages/activities.js";
import PageNotFound from "./pages/_PageNotFound.js";
import Dining from "./pages/dining.js";
import Problems from "./pages/problems.js";
import Tickets from "./pages/tickets.js";
import Shop from "./pages/shop.js";
import Register from "./components/register.js";
import Login from "./components/login.js";

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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
