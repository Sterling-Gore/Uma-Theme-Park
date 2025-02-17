
import React, {  useState , useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/dashboard.js"
import Activities from "./pages/activities.js"
import PageNotFound from "./pages/_PageNotFound.js"
import Dining from "./pages/dining.js"
import Problems from "./pages/problems.js"
import Tickets from "./pages/tickets.js"
import Shop from "./pages/shop.js"
import Register from "./components/register.js"


const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    errorElement: <PageNotFound />
  },
  {
    path: '/activities',
    element: <Activities />,
    errorElement: <PageNotFound />
  },
  {
    path: '/dining',
    element: <Dining />,
    errorElement: <PageNotFound />
  },
  {
    path: '/shop',
    element: <Shop />,
    errorElement: <PageNotFound />
  },
  {
    path: '/tickets',
    element: <Tickets />,
    errorElement: <PageNotFound />
  },
  {
    path: '/problems',
    element: <Problems />,
    errorElement: <PageNotFound />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <PageNotFound />
  },
]);

function App() {
  return (
    <RouterProvider router = {router} />
  );
}

export default App;
