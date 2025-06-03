import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Settings from "./components/Settings";
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
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Hero from "./components/Hero";
// import LandingPage from "./components/LandingPage";
// import SignUp from "./components/SignUp";
// import LogIn from "./components/LogIn";
// import Settings from "./components/Settings";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// function App() {
//   const GoogleAuthWrapper = () => {
//     return (
//       <GoogleOAuthProvider clientId="508252238705-g8tdudir370g918k2ivsc578bsic3ss6.apps.googleusercontent.com">
//         <SignUp></SignUp>
//       </GoogleOAuthProvider>
//     );
//   };
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />}></Route>
//         <Route path="/hero" element={<Hero />}></Route>
//         <Route path="/signup" element={<GoogleAuthWrapper />}></Route>
//         <Route path="/login" element={<LogIn />}></Route>
//         <Route path="/settings" element={<Settings />}></Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
