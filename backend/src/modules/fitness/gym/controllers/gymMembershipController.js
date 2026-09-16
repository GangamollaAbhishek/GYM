const User = require('../../../../models/User');

// PUT /api/users/:id/membership - Update/Purchase/Renew customer membership
const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, duration, amount, paymentMethod } = req.body;

    if (!plan) {
      return res.status(400).json({ status: 'error', message: 'Membership plan is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    const planDuration = duration || 'Monthly';
    if (planDuration === 'Monthly') expDate.setMonth(expDate.getMonth() + 1);
    else if (planDuration === 'Quarterly') expDate.setMonth(expDate.getMonth() + 3);
    else if (planDuration === 'Half-Yearly') expDate.setMonth(expDate.getMonth() + 6);
    else if (planDuration === 'Annual') expDate.setFullYear(expDate.getFullYear() + 1);
    else expDate.setMonth(expDate.getMonth() + 1);

    const updated = await User.findByIdAndUpdate(
      id,
      {
        membershipPlan: plan,
        membershipDuration: planDuration,
        membershipStatus: 'Active',
        membershipStartDate: today,
        membershipExpiry: expDate.toISOString().split('T')[0],
        amountPaid: Number(amount) || 0,
        paymentMethod: paymentMethod || 'Online Booking',
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Membership plan updated to ${plan}`,
      data: updated,
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  updateMembership,
};
