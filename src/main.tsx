import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.tsx";
import { AuthContextProvider } from "./auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
);
