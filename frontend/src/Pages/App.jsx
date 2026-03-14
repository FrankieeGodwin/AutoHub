import "./App.css";
import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "../Login.jsx";
import Register from "../Register.jsx";
import SendOtp  from "../SendOtp.jsx";
import AddCar from "./addCar.jsx";
import CarView from "../user/Carview.jsx";
import Home from "../Home.jsx";
import Profile from "../Profile.jsx";
import YourCars from "../YourCars.jsx";
import Payment from "../Payment/Payment.jsx";
import EditProfile from "../EditProfile.jsx";
import PrivacyPolicy from "../PrivacyPolicy.jsx"
import About from "../Components/About.jsx";
import Contact from "../Components/Contact.jsx";
import TermsConditions from "../TermsConditions.jsx";
import Subscription from "../Subscription.jsx";
import ForgotPassword from "../ForgotPassword.jsx";
import Favorites from "../Favorites.jsx";
import DealerLogin from "../Dealer/dealerLogin.jsx";
import DealerDashboard from "../Dealer/dealerDashboard.jsx";
import DealerRegister from "../dealerRegister.jsx";
import DealerSendOtp from "../dealerSendOtp.jsx";
import APIcheck from "../APIcheck.jsx";
import YourActivity from "../YourActivity.jsx";
import Notifications from "../Notifications.jsx";
import ChatPage from "./ChatPage.jsx"; // buyer-seller chat
import SellerChats from "../SellerChats.jsx"; // seller view all chats
import UploadCars from "../UploadCars.jsx";
import AdminLogin from "../Admin/AdminLogin.jsx";  
import AdminCarListView from "../Admin/AdminCarListView.jsx";
import AdminDashboard from "../Admin/AdminDashboard.jsx";
import NewCarList from "../NewCarList.jsx";
import CarViewPage from "../user/carViewPage.jsx";
import { Upload } from "lucide-react";
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
        <Route path="/EditProfile" element={<EditProfile/>}/>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Contact" element={<Contact />}/>
        <Route path="/TermsConditions" element={<TermsConditions />}/>
        <Route path="/Subscription" element={<Subscription/>}/>
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route path="/Favorites" element={<Favorites/>}/>
        <Route path="/dealerLogin" element={<DealerLogin/>}/>
        <Route path="/dealerDashboard" element={<DealerDashboard/>}/>
        <Route path="/dealerRegister" element={<DealerRegister/>}/>
        <Route path="/dealerOtp" element={<DealerSendOtp/>}/>
        <Route path="/APIcheck" element={<APIcheck/>}/>
        <Route path="/YourActivity" element={<YourActivity/>}/>
        <Route path="/Notifications" element={<Notifications/>}/>
        <Route path="/dealerUploadCars" element={<UploadCars/>}/>
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/AdminLogin" element={<AdminLogin/> } />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/AdminCarListView" element={<AdminCarListView />} />

        <Route path="/NewCarList" element={<NewCarList />} />
            {/* Seller chat overview */}
            <Route path="/seller-chats" element={<SellerChats />} />
        <Route path="/car/:newcarid" element={<CarViewPage />} /> 

      </Routes>
  </Router>

  
  );
}

export default App;
