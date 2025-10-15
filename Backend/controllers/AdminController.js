
import User from "../models/user.model.js";
import Car from "../models/Car.model.js";  // adjust import if file name differs
import NewCar from "../models/NewCar.model.js";  // adjust import if file name differs
import Dealer from "../models/Dealer.model.js";
import jwt from "jsonwebtoken";
// import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const dashboarddata = async (req, res) => {
  try {
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only allow admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments(); // Assuming you store an `isActive` flag
    const totalCars = await Car.countDocuments();
    const NewCars = await NewCar.countDocuments();
    const userCount = await User.countDocuments();
    const dealerCount = await Dealer.countDocuments();

    res.status(200).json({
      totalUsers,
      activeUsers,
      totalCars,
      NewCars,
      userCount,
      dealerCount
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getactiveusers = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Query GA Realtime API via Data API
    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
      dimensions: [],  // optional
    });

    const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || '0';

    // You might also want “total users” over a period — need other endpoint
    // For now, send activeUsers
    res.json({
      activeUsers: parseInt(activeUsers, 10),
    });
  } catch (err) {
    console.error('GA dashboard error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};