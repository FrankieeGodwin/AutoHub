import jwt from "jsonwebtoken";
import Dealer from "../models/Dealer.model.js";

const dealerAuthMiddleware = async (req,res,next)=>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ","");
        if(!token) return res.status(401).json({message:"No Token, Authorization Denied"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dealer = await Dealer.findById(decoded.id);
        if (!dealer) return res.status(401).json({ message: "Dealer not found" });
    
        req.user = { id: dealer._id };
        next();
      } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
      }
};
    
export default dealerAuthMiddleware;