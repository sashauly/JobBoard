import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root.tsx";
import "./index.css";
import Error from "./pages/Error";
import Vacancies from "./pages/Vacancies";
import MyVacancies from "./pages/MyVacancies";
import SpecificVacancy from "./pages/SpecificVacancy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/vacancies",
        element: <Vacancies />,
        children: [
          {
            path: ":id",
            element: <SpecificVacancy />,
          },
        ],
      },
      {
        path: "/my-vacancies",
        element: <MyVacancies />,
        children: [
          {
            path: ":id",
            element: <SpecificVacancy />,
          },
        ],
      },
      {
        path: "/active-vacancies",
        element: <div className="active-vacancies">Active Vacancies</div>, // TODO Add active vacancies
        children: [
          {
            path: ":id",
            element: <SpecificVacancy />,
          },
        ],
      },
      {
        path: "/create-vacancy",
        element: <div className="create-vacancy">Create Vacancy</div>, // TODO Add create vacancy
      },
      {
        path: "/login",
        element: <div className="login">Login</div>, // TODO Add login
      },
      {
        path: "/register",
        element: <div className="register">Register</div>, // TODO Add register
      },
      {
        path: "/company-register",
        element: <div className="register">Company Register</div>, // TODO Add company register
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
