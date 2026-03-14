import Payment from '../models/Payment.model.js';

export const createPayment = async (req, res) => {
    try{
        const { userId, carId, paymentId, amount, type, status } = req.body;
        const newPayment = new Payment({ userId, carId, paymentId, amount, type, status });
        await newPayment.save();
        res.status(201).json({ message: 'Payment record created successfully', payment: newPayment });
    }
    catch(err){
        console.error("Error creating payment record:", err);
        res.status(500).json({ error: 'Failed to create payment record' }); 
    }
}

export const AllPaymentsByUserId = async (req,res) => {
    try {
        const { userId } = req.params;

        if(!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const payments = await Payment.find({userId});

        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this user' });
        }

        res.status(200).json({payments});
    }
    catch(err) {
        res.status(500).json({message:'error'});
    }
}

export const AllpaymentsForAdmin = async (req,res) => {
    try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const PaymentMonthlySummary = async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      // Convert createdAt to Date safely
      {
        $project: {
          createdAtDate: { $toDate: "$createdAt" }, // ensures even string dates work
          amount: 1,
        },
      },
      // Extract year, month, and day from createdAt
      {
        $addFields: {
          year: { $year: "$createdAtDate" },
          month: { $month: "$createdAtDate" },
          day: { $dayOfMonth: "$createdAtDate" },
        },
      },
      // Create custom range field
      {
        $addFields: {
          range: {
            $switch: {
              branches: [
                { case: { $lte: ["$day", 10] }, then: "1-10" },
                {
                  case: { $and: [{ $gt: ["$day", 10] }, { $lte: ["$day", 20] }] },
                  then: "11-20",
                },
              ],
              default: "21-31",
            },
          },
        },
      },
      // Group by year, month, and range
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            range: "$range",
          },
          totalEarnings: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      // Sort by year, month, and range order
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error getting monthly summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};
