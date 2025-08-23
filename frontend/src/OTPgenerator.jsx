import {React} from "react";
import {Link} from "react-router-dom";
import { useLocation } from "react-router-dom";
function OTPgenerator(){
    const location = useLocation();
    const {phone} = location.state;
    return(
        <>
        <div className="w-full h-screen bg-[#FAFAFA] flex items-center justify-center">

            <p className="text-purple-700 font-medium">OTP: {phone}</p>
        </div>
        </>
    )
}

export default OTPgenerator;