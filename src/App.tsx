import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import LandingPage from "./components/LandingPage/LandingPage";
import SignUp from "./auth/SignUp";
import LogIn from "./auth/LogIn";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/new" element={<Hero />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
