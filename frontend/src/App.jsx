import "./App.css";
import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import SendOtp  from "./SendOtp.jsx";
import AddCar from "./addCar.jsx";
import CarView from "./Carview.jsx";
import Home from "./Home";
import Profile from "./Profile.jsx";
import YourCars from "./YourCars.jsx";
import Payment from "./Payment.jsx";
import EditProfile from "./EditProfile.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx"
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import TermsConditions from "./TermsConditions.jsx";
function App() {
  useEffect(() => {
  console.log("ENV Test:", import.meta.env.VITE_API_BASE);
}, []);

  return (
  <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/Otp" element={<SendOtp/>}/>
        <Route path="/addCar" element={<AddCar/>}/>
        <Route path="/carView" element={<CarView/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/YourCars" element={<YourCars/>}/>
        <Route path="/Payment" element={<Payment/>}/>
        <Route path="EditProfile" element={<EditProfile/>}/>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Contact" element={<Contact />}/>
        <Route path="TermsConditions" element={<TermsConditions />}/>
      </Routes>
  </Router>
  );
}

export default App;
