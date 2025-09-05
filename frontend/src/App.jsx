import "./App.css";
import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import SendOtp  from "./SendOtp.jsx";
import AddCar from "./addCar.jsx";
import CarView from "./Carview.jsx";
import Home from "./Home";
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
      </Routes>
  </Router>
  );
}

export default App;
