import logo from './logo.svg';
import React, {  useState , useEffect } from "react";
import { BrowserRouter as Navigate, Routes, Route, Router } from "react-router-dom";

import './App.css';
import Dashboard from "./pages/dashboard.js"

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Dashboard />}  />
      </Routes>
    </Router>
  );
}

export default App;
