// import { useState } from "react";
import "./App.css";
import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import NavBar from "./NavBar.jsx";
import CarView from "./Carview.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Otppage from "./otppage.jsx";
import H from "./h.jsx"
import SendOtp  from "./SendOtp.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavBar/>}/>
        <Route path="/" element={<CarView/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/Otp" element={<SendOtp/>}/>
    </Routes>
    </Router>
  );
}

export default App;
// buga exnr mozv pfkv