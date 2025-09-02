import {useLocation} from "react-router-dom";

export default function Greetings(){
    const location = useLocation();
    const username = location.state?.username;
    return(
        <div>
            <h1 className="text-black">Hello {username} </h1>
        </div>
    );
}