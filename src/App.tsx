import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/hero" element={<Hero />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
