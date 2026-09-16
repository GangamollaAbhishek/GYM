const mongoose = require('mongoose');
const User = require('../../../../models/User');

// GET /api/trainers - Retrieve all genuine registered trainers/coaches
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password').lean().exec();
    const formatted = trainers.map((t, idx) => ({
      id: t._id.toString(),
      displayId: `TRN-${501 + idx}`,
      name: t.name,
      email: t.email,
      phone: t.phone && t.phone !== 'N/A' ? t.phone : 'N/A',
      role: t.role,
      avatar: t.avatar || '',
      spec: t.specialization || 'Master Coach & Strength Specialist',
      experience: t.experience || '6+ Years Experience',
      shift: t.shift || '06:00 AM - 02:00 PM',
      room: t.assignedRoom || 'Main Strength & Conditioning Arena',
      days: t.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      rating: t.rating || '5.0',
      pricePerSession: t.pricePerSession || '₹1,499',
      bio: t.bio || 'Certified strength, biomechanics and performance specialist.',
      image: t.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80',
    }));
    res.status(200).json({ status: 'success', data: formatted });
  } catch (err) {
    console.error('Error fetching trainers:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch trainers' });
  }
};

// PUT /api/users/:id/assign-trainer - Direct Assign Trainer endpoint
const assignTrainer = async (req, res) => {
  try {
    const { trainerId, trainerName } = req.body;
    if (!trainerName) {
      return res.status(400).json({ status: 'error', message: 'Trainer name is required' });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedTrainer: trainerId ? String(trainerId) : null,
          assignedTrainerName: trainerName,
        },
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully assigned Coach ${trainerName} to athlete`,
      data: updated,
    });
  } catch (error) {
    console.error('Assign trainer endpoint error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to assign trainer' });
  }
};

// PUT /api/users/:id/coaching-data - Update customer workout plan, diet plan, notes & progress (Protected: Trainer & Admin)
const updateCoachingData = async (req, res) => {
  try {
    const { workoutPlan, dietPlan, trainerNotes, progress } = req.body;
    const updateFields = {};

    if (workoutPlan) updateFields.workoutPlan = workoutPlan;
    if (dietPlan) updateFields.dietPlan = dietPlan;
    if (trainerNotes) updateFields.trainerNotes = trainerNotes;
    if (progress) updateFields.progress = progress;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Athlete not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Athlete coaching telemetry updated successfully!',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update coaching data error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update coaching data' });
  }
};

// POST /api/users/:id/chat-message - Send a coach/athlete chat message
const sendChatMessage = async (req, res) => {
  try {
    const { text, sender, senderName } = req.body;
    if (!text) {
      return res.status(400).json({ status: 'error', message: 'Message text is required' });
    }

    const newMsg = {
      sender: sender || 'coach',
      senderName: senderName || req.user.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { chatMessages: newMsg } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Athlete not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Message sent successfully',
      data: newMsg,
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to send message' });
  }
};

// PUT /api/users/:id/shift - Update trainer shift timings, working days, and arena (Protected: Admin, Receptionist, Trainer)
const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { shift, room, days, specialization, breakTime } = req.body;

    const updateFields = {};
    if (shift) updateFields.shift = shift;
    if (room) updateFields.assignedRoom = room;
    if (days) updateFields.workingDays = days;
    if (specialization) updateFields.specialization = specialization;
    if (breakTime) updateFields.breakTime = breakTime;

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    if (!updated) {
      updated = await User.findOneAndUpdate(
        { $or: [{ email: id }, { name: new RegExp(`^${id}$`, 'i') }] },
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Trainer not found in database' });
    }

    res.status(200).json({
      status: 'success',
      message: `Shift timings updated successfully to ${shift}`,
      data: updated,
    });
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllTrainers,
  assignTrainer,
  updateCoachingData,
  sendChatMessage,
  updateShift,
};
