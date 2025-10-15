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

export const PaymentMonthlySummary = async (req,res) => {
    try {
    const summary = await Payment.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalEarnings: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error getting monthly summary:", error);
    res.status(500).json({ message: "Server error" });
  }
}