import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import SignUp from "../components/SignUp";
import LogIn from "../components/LogIn";
import Hero from "../components/Hero";
import PrivateRoute from "../components/PrivateRoute";
import Settings from "../components/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/settings", element: <Settings /> },
  {
    path: "/hero",
    element: (
      <PrivateRoute>
        <Hero />
      </PrivateRoute>
    ),
  },
]);
