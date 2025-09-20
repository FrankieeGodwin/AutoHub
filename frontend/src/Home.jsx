
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import CarList from "./CarList";
import Footer from "./Footer";

export default function Home() {
  const navigate = useNavigate();

  // Optional: redirect if no user logged in
  useEffect(() => {
    try{
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } 
  } catch(err) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <NavBar />
      <CarList />
      <Footer />
    </div>
  );
}