import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";

import App from "./App.tsx";
import NotFound from "./pages/NotFound";
import Plan from "./pages/Plan";
import Logs from "./pages/Logs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/plan",
    element: <Plan />,
    errorElement: <NotFound />,
  },
  {
    path: "/logs",
    element: <Logs />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);