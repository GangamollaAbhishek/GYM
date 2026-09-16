const mongoose = require('mongoose');
const Enquiry = require('../../models/Enquiry');

// POST /api/enquiries - Capture new prospect lead
const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, goal, source, notes, capturedBy } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Prospect Name and Phone Number are required fields.',
      });
    }

    const count = await Enquiry.countDocuments();
    const nextSeq = String(count + 1).padStart(3, '0');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const enquiryId = `ENQ-${nextSeq}-${randomSuffix}`;

    const newEnquiry = new Enquiry({
      enquiryId,
      name: name.trim(),
      phone: phone.trim(),
      email: email && email.trim() ? email.trim() : 'N/A',
      goal: goal || 'Muscle Gain & Strength',
      source: source || 'Walk-in Visitor',
      status: 'New Lead',
      notes: notes || '',
      capturedBy: capturedBy || 'Front Desk Receptionist',
      date: new Date().toISOString().split('T')[0],
    });

    await newEnquiry.save();

    console.log(`📥 [Enquiry API] New lead logged: ${newEnquiry.name} (${newEnquiry.enquiryId}) -> Synced to Admin Dashboard.`);

    return res.status(201).json({
      status: 'success',
      message: 'Prospect lead captured successfully and dispatched to Admin Dashboard!',
      data: newEnquiry,
    });
  } catch (error) {
    console.error('Error creating prospect enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to save enquiry lead: ' + (error.message || 'Server error'),
    });
  }
};

// GET /api/enquiries - Fetch all prospect leads
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve enquiries: ' + (error.message || 'Server error'),
    });
  }
};

// PUT /api/enquiries/:id - Update lead status or details
const updateEnquiry = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { status, notes, goal, phone, email } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (goal) updateFields.goal = goal;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;

    const updated = await Enquiry.findOneAndUpdate(
      {
        $or: [
          { enquiryId: targetId },
          { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
        ],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Prospect lead record not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Lead updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update enquiry: ' + (error.message || 'Server error'),
    });
  }
};

// DELETE /api/enquiries/:id - Delete lead
const deleteEnquiry = async (req, res) => {
  try {
    const targetId = req.params.id;
    const deleted = await Enquiry.findOneAndDelete({
      $or: [
        { enquiryId: targetId },
        { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Prospect lead record not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Lead ${deleted.enquiryId} (${deleted.name}) removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete enquiry: ' + (error.message || 'Server error'),
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
};
