const mongoose = require('mongoose');
const Feedback = require('../../models/Feedback');
const User = require('../../models/User');

// POST /api/feedbacks - Create new customer feedback
const createFeedback = async (req, res) => {
  try {
    const {
      trainerId,
      trainerName,
      category,
      rating,
      message,
      customerName,
      customerPlan,
      customerAvatar,
    } = req.body;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Feedback message is required' });
    }

    const customerUser = await User.findById(req.user.id || req.user._id);

    const feedbackDoc = new Feedback({
      customerId: req.user.id || req.user._id,
      customerName: customerName || customerUser?.name || 'Gym Athlete',
      customerEmail: req.user.email || customerUser?.email || '',
      customerAvatar: customerAvatar || customerUser?.avatar || '',
      customerPlan: customerPlan || customerUser?.plan || 'VIP Obsidian Access',
      trainerId: trainerId || customerUser?.assignedTrainer || null,
      trainerName: trainerName || customerUser?.assignedTrainerName || 'Master Coach',
      category: category || 'Trainer Consultation',
      rating: Number(rating) || 5,
      message: message.trim(),
    });

    await feedbackDoc.save();

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: {
        ...feedbackDoc.toObject(),
        id: feedbackDoc._id.toString(),
      },
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit feedback' });
  }
};

// GET /api/feedbacks - List feedbacks (filter by trainerId or trainerName)
const getAllFeedbacks = async (req, res) => {
  try {
    const { trainerId, trainerName, customerId } = req.query;
    let query = {};
    if (trainerId && mongoose.Types.ObjectId.isValid(trainerId)) query.trainerId = trainerId;
    if (trainerName) query.trainerName = new RegExp(trainerName, 'i');
    if (customerId) query.customerId = customerId;

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).lean().exec();

    // Fetch live user avatars to always show the updated profile pictures
    const customerIds = feedbacks.map((f) => f.customerId).filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    const customerNames = feedbacks.map((f) => f.customerName).filter(Boolean);
    const users = await User.find({
      $or: [
        { _id: { $in: customerIds } },
        { name: { $in: customerNames } },
      ],
    }).select('name email avatar plan').lean().exec();

    const userMap = {};
    users.forEach((u) => {
      userMap[String(u._id)] = u;
      if (u.name) userMap[u.name.toLowerCase().trim()] = u;
      if (u.email) userMap[u.email.toLowerCase().trim()] = u;
    });

    res.status(200).json({
      status: 'success',
      count: feedbacks.length,
      data: feedbacks.map((f) => {
        const liveUser = (f.customerId && userMap[String(f.customerId)]) ||
                         (f.customerName && userMap[f.customerName.toLowerCase().trim()]) ||
                         (f.customerEmail && userMap[f.customerEmail.toLowerCase().trim()]);
        const avatar = liveUser?.avatar || f.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const plan = liveUser?.plan || f.customerPlan || 'VIP Athlete Member';

        return {
          ...f,
          id: f._id.toString(),
          athleteName: liveUser?.name || f.customerName || 'Gym Athlete',
          athleteAvatar: avatar,
          customerAvatar: avatar,
          plan: plan,
          customerPlan: plan,
          comment: f.message,
          rating: f.rating || 5,
          category: f.category || 'Trainer Review',
          reply: f.reply || '',
          replyAuthor: f.replyAuthor || '',
          replyDate: f.replyDate || '',
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        };
      }),
    });
  } catch (error) {
    console.error('Fetch feedbacks error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch feedbacks' });
  }
};

// GET /api/feedbacks/trainer/:trainerId
const getTrainerFeedbacks = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainerUser = await User.findById(req.user?.id || req.user?._id).lean().exec();
    const trainerName = req.user?.name || trainerUser?.name || '';

    let orConditions = [];

    if (mongoose.Types.ObjectId.isValid(trainerId)) {
      orConditions.push({ trainerId: new mongoose.Types.ObjectId(trainerId) });
    }
    if (trainerUser?._id) {
      orConditions.push({ trainerId: trainerUser._id });
    }
    if (trainerName) {
      orConditions.push({ trainerName: new RegExp(trainerName, 'i') });
    }
    if (trainerId && !mongoose.Types.ObjectId.isValid(trainerId) && trainerId !== 'default') {
      orConditions.push({ trainerName: new RegExp(trainerId, 'i') });
    }

    orConditions.push({ customerName: { $exists: true, $ne: '' } });

    const query = orConditions.length > 0 ? { $or: orConditions } : {};

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 }).lean().exec();

    const customerIds = feedbacks.map((f) => f.customerId).filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    const customerNames = feedbacks.map((f) => f.customerName).filter(Boolean);
    const users = await User.find({
      $or: [
        { _id: { $in: customerIds } },
        { name: { $in: customerNames } },
      ],
    }).select('name email avatar plan').lean().exec();

    const userMap = {};
    users.forEach((u) => {
      userMap[String(u._id)] = u;
      if (u.name) userMap[u.name.toLowerCase().trim()] = u;
      if (u.email) userMap[u.email.toLowerCase().trim()] = u;
    });

    res.status(200).json({
      status: 'success',
      count: feedbacks.length,
      data: feedbacks.map((f) => {
        const liveUser = (f.customerId && userMap[String(f.customerId)]) ||
                         (f.customerName && userMap[f.customerName.toLowerCase().trim()]) ||
                         (f.customerEmail && userMap[f.customerEmail.toLowerCase().trim()]);
        const avatar = liveUser?.avatar || f.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const plan = liveUser?.plan || f.customerPlan || 'VIP Athlete Member';

        return {
          ...f,
          id: f._id.toString(),
          athleteName: liveUser?.name || f.customerName || 'Gym Athlete',
          athleteAvatar: avatar,
          customerAvatar: avatar,
          plan: plan,
          customerPlan: plan,
          comment: f.message,
          rating: f.rating || 5,
          category: f.category || 'Trainer Review',
          reply: f.reply || '',
          replyAuthor: f.replyAuthor || '',
          replyDate: f.replyDate || '',
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        };
      }),
    });
  } catch (error) {
    console.error('Fetch trainer feedbacks error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch feedbacks' });
  }
};

// PUT /api/feedbacks/:id/reply - Coach/Admin adds a reply to a feedback
const replyFeedback = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ status: 'error', message: 'Reply text is required' });
    }

    const feedbackDoc = await Feedback.findById(req.params.id);
    if (!feedbackDoc) {
      return res.status(404).json({ status: 'error', message: 'Feedback not found' });
    }

    feedbackDoc.reply = reply.trim();
    feedbackDoc.replyAuthor = req.user?.name || 'Master Coach';
    feedbackDoc.replyDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    await feedbackDoc.save();

    res.status(200).json({
      status: 'success',
      message: 'Reply posted successfully',
      data: {
        ...feedbackDoc.toObject(),
        id: feedbackDoc._id.toString(),
      },
    });
  } catch (error) {
    console.error('Reply feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to post reply' });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getTrainerFeedbacks,
  replyFeedback,
};
