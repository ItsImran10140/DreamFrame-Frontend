/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import SignUp from "../components/SignUp";
import LogIn from "../components/LogIn";
import Hero from "../components/Hero";
import PrivateRoute from "../components/PrivateRoute";
import Settings from "../components/Settings";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
