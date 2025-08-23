// import { useState } from "react";
import "./App.css";
import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import NavBar from "./NavBar.jsx";
import CarView from "./Carview.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import OTPgenerator from "./OTPgenerator.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/OTP" element={<OTPgenerator/>}/>
    </Routes>
    </Router>
  );
}

export default App;