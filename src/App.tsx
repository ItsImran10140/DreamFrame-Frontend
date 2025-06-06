import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import LandingPage from "./components/LandingPage/LandingPage";
import SignUp from "./auth/SignUp";
import LogIn from "./auth/LogIn";
// import Settings from "./components/settings/Settings";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="508252238705-g8tdudir370g918k2ivsc578bsic3ss6.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
