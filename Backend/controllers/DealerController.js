import Dealer from "../models/Dealer.model.js"
import DealerStats from "../models/dealerStats.model.js";

export const createDealer = async (req, res) => {
  try {
    const newDealer = new Dealer(req.body);
    const savedDealer = await newDealer.save();

    const dealerStats = new DealerStats({
      DealerId: savedDealer._id, 
      TotalCarsSold: 0,
      TotalRevenue: 0,
      CarsSoldList: []
    });

    const savedDealerStats = await dealerStats.save();

    res.status(201).json({
      dealer: savedDealer,
      dealerStats: savedDealerStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteDealer(req, res) {
  try {
    const deletedDealer = await Dealer.findByIdAndDelete(req.params.dealerId);

    if (!deletedDealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    return res.status(200).json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    console.error('Error deleting dealer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
