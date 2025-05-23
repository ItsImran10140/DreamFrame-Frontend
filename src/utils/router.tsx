import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import SignUp from "../components/SignUp";
import LogIn from "../components/Login";
import Hero from "../components/Hero";
import PrivateRoute from "../components/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  {
    path: "/hero",
    element: (
      <PrivateRoute>
        <Hero />
      </PrivateRoute>
    ),
  },
]);
