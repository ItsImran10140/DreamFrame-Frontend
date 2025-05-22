import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/hero" element={<Hero />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
