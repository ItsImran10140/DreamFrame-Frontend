/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage/LandingPage";
import SignUp from "../auth/SignUp";
import Hero from "../components/Hero";
import PrivateRoute from "../routes/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LogIn from "../auth/LogIn";

const GoogleWrapper = ({ children }: any) => (
  <GoogleOAuthProvider clientId="508252238705-g8tdudir370g918k2ivsc578bsic3ss6.apps.googleusercontent.com">
    {children}
  </GoogleOAuthProvider>
);

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/signup",
    element: (
      <GoogleWrapper>
        {" "}
        <SignUp />
      </GoogleWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <GoogleWrapper>
        {" "}
        <LogIn />
      </GoogleWrapper>
    ),
  },
  // { path: "/settings", element: <Settings /> },
  {
    path: "/hero",
    element: (
      <PrivateRoute>
        <Hero />
      </PrivateRoute>
    ),
  },
]);
