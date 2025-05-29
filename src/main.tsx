import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router.tsx";
import { AuthContextProvider } from "./components/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
);
