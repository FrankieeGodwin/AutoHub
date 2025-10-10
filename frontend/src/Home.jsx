
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import CarList from "./CarList";
import Footer from "./Footer";
import NewCarList from "./NewCarList.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All"); 
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
      <NavBar category={category} setCategory={setCategory}/>
      {/* <CarList /> */}

      {category === "All" && <CarList/>}
      {category === "Used" && <CarList/>}
      {category === "New" && <NewCarList />}
      <Footer />
    </div>
  );
}