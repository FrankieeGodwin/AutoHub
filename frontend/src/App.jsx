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
import Subscription from "./Subscription.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Favorites from "./Favorites.jsx";
import DealerLogin from "./dealerLogin.jsx";
import DealerDashboard from "./dealerDashboard.jsx";
import DealerRegister from "./dealerRegister.jsx";
import DealerSendOtp from "./dealerSendOtp.jsx";
import APIcheck from "./APIcheck.jsx";
import YourActivity from "./YourActivity.jsx";
import Notifications from "./Notifications.jsx";
import ChatPage from "./ChatPage"; // buyer-seller chat
import SellerChats from "./SellerChats"; // seller view all chats
import UploadCars from "./UploadCars.jsx";
import AdminLogin from "./AdminLogin.jsx";  
import AdminCarListView from "./AdminCarListView.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import NewCarList from "./NewCarList.jsx";
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
        <Route path="/chat/:sellerId" element={<ChatPage />} />
        <Route path="/AdminLogin" element={<AdminLogin/> } />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/AdminCarListView" element={<AdminCarListView />} />

        <Route path="/chat/:sellerId" element={<ChatPage />} />
        <Route path="/NewCarList" element={<NewCarList />} />
            {/* Seller chat overview */}
            <Route path="/seller-chats" element={<SellerChats />} />
        

      </Routes>
  </Router>

  
  );
}

export default App;
