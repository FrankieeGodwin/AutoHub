import React from "react";
import NavBar from "./NavBar";
import CarList from "./carList";
import Footer from "./Footer";
export default function Home() {
  return (
    <div>
      <NavBar />
      <CarList />
      <Footer />
    </div>
  );
}