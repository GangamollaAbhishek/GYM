const mongoose = require('mongoose');
const Attendance = require('../../../../models/Attendance');
const User = require('../../../../models/User');
const { sendManualCheckInOtpEmail } = require('../../../../utils/mailer');

// Global in-memory OTP request cache with auto-expiry
const activeOtpMap = new Map();

// Helper to automatically turn active check-ins from previous days into 'Inactive'
const syncEndOfDayAttendance = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await Attendance.updateMany(
      {
        date: { $lt: todayStr },
        status: 'Active Inside',
      },
      {
        $set: {
          status: 'Inactive',
        },
      }
    );
  } catch (err) {
    console.error('Error syncing end-of-day attendance:', err);
  }
};

// Sync end-of-day attendance on boot & every 5 minutes
syncEndOfDayAttendance();
setInterval(syncEndOfDayAttendance, 5 * 60 * 1000);

// Helper to cleanup expired OTPs
const cleanupExpiredOtps = () => {
  const now = Date.now();
  for (const [key, val] of activeOtpMap.entries()) {
    if (val.expiresAt < now) {
      activeOtpMap.delete(key);
    }
  }
};

// Check if athlete has checked in within the last 6 hours (6-hour gap cooldown)
const check6HourCooldown = async ({ customerId, userId, email, name }) => {
  try {
    const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const sixHoursAgo = new Date(Date.now() - COOLDOWN_MS);

    const orClauses = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      orClauses.push({ userId: new mongoose.Types.ObjectId(userId) });
    }
    if (customerId && String(customerId).trim()) {
      orClauses.push({ customerId: String(customerId).trim() });
    }
    if (email && email.trim()) {
      orClauses.push({ email: email.toLowerCase().trim() });
    }
    if (name && name.trim()) {
      orClauses.push({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    }

    if (orClauses.length === 0) return { isBlocked: false };

    // Find latest attendance record within last 6 hours
    const recentRecord = await Attendance.findOne({
      $or: orClauses,
      status: { $ne: 'Cancelled' },
      $or: [
        { checkInTimestamp: { $gte: sixHoursAgo } },
        { createdAt: { $gte: sixHoursAgo } },
      ],
    }).sort({ checkInTimestamp: -1, createdAt: -1 });

    if (recentRecord) {
      const checkInTime = recentRecord.checkInTimestamp || recentRecord.createdAt || new Date();
      const checkInMs = new Date(checkInTime).getTime();
      const elapsedMs = Math.max(0, Date.now() - checkInMs);

      if (elapsedMs < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - elapsedMs;
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

        const nextEligibleDate = new Date(checkInMs + COOLDOWN_MS);
        const nextEligibleTime = nextEligibleDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const timeElapsedStr = elapsedHours > 0
          ? `${elapsedHours} hr ${elapsedMinutes} mins ago`
          : `${elapsedMinutes} mins ago`;

        const timeRemainingStr = remainingHours > 0
          ? `${remainingHours}h ${remainingMinutes}m`
          : `${remainingMinutes} mins`;

        return {
          isBlocked: true,
          previousCheckIn: {
            logId: recentRecord.logId,
            timeIn: recentRecord.timeIn,
            date: recentRecord.date,
            terminal: recentRecord.terminal || 'Turnstile Gate Alpha-1',
            status: recentRecord.status,
            verification: recentRecord.verification,
            checkInTimestamp: recentRecord.checkInTimestamp || recentRecord.createdAt,
            name: recentRecord.name,
            customerId: recentRecord.customerId,
            plan: recentRecord.plan,
          },
          timeElapsedStr,
          timeRemainingStr,
          nextEligibleTime,
          remainingHours,
          remainingMinutes,
          message: `Athlete ${recentRecord.name} is already checked in at ${recentRecord.timeIn} (${timeElapsedStr}). Minimum 6-hour gap required between check-ins. Next check-in eligible at ${nextEligibleTime} (${timeRemainingStr} remaining).`,
        };
      }
    }

    return { isBlocked: false };
  } catch (err) {
    console.error('Cooldown check error:', err);
    return { isBlocked: false };
  }
};

// POST /api/attendance/request-otp - Generate & dispatch manual check-in OTP for customer
const requestOtp = async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan } = req.body;
    if (!name && !customerId && !userId && !email) {
      return res.status(400).json({ status: 'error', message: 'Customer identifier is required' });
    }

    cleanupExpiredOtps();

    // 6-Hour Cooldown Validation
    const cooldownStatus = await check6HourCooldown({ customerId, userId, name, email });
    if (cooldownStatus.isBlocked) {
      console.warn(`⛔ Check-in blocked for ${name}: Already checked in (${cooldownStatus.timeElapsedStr})`);
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus,
      });
    }

    // Generate secure 4-digit numeric OTP matching orbit verification console
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000; // Exactly 2:00 minutes validity

    const otpData = {
      otp: generatedOtp,
      customerId: customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      userId: userId ? String(userId) : null,
      name: name || 'Valued Athlete',
      email: email || '',
      phone: phone || '',
      plan: plan || 'PRO MEMBERSHIP',
      requestedAt: new Date().toISOString(),
      expiresAt,
      verified: false,
    };

    // Store by customerId, userId, and email for fast lookup
    if (customerId) activeOtpMap.set(String(customerId).toLowerCase(), otpData);
    if (userId) activeOtpMap.set(String(userId).toLowerCase(), otpData);
    if (email) activeOtpMap.set(String(email).toLowerCase(), otpData);
    activeOtpMap.set(name.toLowerCase().trim(), otpData);

    // Resolve target customer email for dispatching OTP email
    let targetEmail = (email || '').trim();
    if (!targetEmail) {
      try {
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          const dbUser = await User.findById(userId);
          if (dbUser && dbUser.email) targetEmail = dbUser.email.trim();
        }
        if (!targetEmail && name) {
          const dbUser = await User.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
          if (dbUser && dbUser.email) targetEmail = dbUser.email.trim();
        }
      } catch (dbErr) {
        console.warn('Error fetching customer email for OTP dispatch:', dbErr.message);
      }
    }

    if (targetEmail) {
      otpData.email = targetEmail;
      activeOtpMap.set(targetEmail.toLowerCase(), otpData);

      // Asynchronously send the OTP email
      sendManualCheckInOtpEmail({
        to: targetEmail,
        name: name || 'Valued Athlete',
        email: targetEmail,
        otp: generatedOtp,
        expiresInMins: 2,
        receptionistName: 'Front Desk Receptionist',
      }).catch((mailErr) => {
        console.error('❌ Failed to dispatch OTP email to customer:', mailErr.message);
      });
    }

    console.log(`🔑 Manual Check-In OTP generated for ${name} (${customerId || userId}): [ ${generatedOtp} ] (Sent to ${targetEmail || 'portal'}) (Expires in 2:00 mins)`);

    return res.status(200).json({
      status: 'success',
      message: `OTP successfully sent to customer portal and email for ${name}`,
      data: {
        customerId: otpData.customerId,
        userId: otpData.userId,
        name: otpData.name,
        email: targetEmail || '',
        expiresAt: otpData.expiresAt,
        requestedAt: otpData.requestedAt,
        debugOtp: generatedOtp,
      },
    });
  } catch (error) {
    console.error('Request OTP Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to request check-in OTP' });
  }
};

// GET /api/attendance/active-otp/:identifier - Retrieve pending check-in OTP for Customer Portal
const getActiveOtp = (req, res) => {
  try {
    const rawId = req.params.identifier;
    if (!rawId) {
      return res.status(400).json({ status: 'error', message: 'Identifier required' });
    }

    cleanupExpiredOtps();

    const lookupKey = rawId.toLowerCase().trim();
    const active = activeOtpMap.get(lookupKey);

    if (active && active.expiresAt > Date.now() && !active.verified) {
      return res.status(200).json({
        status: 'success',
        data: {
          hasActiveOtp: true,
          otp: active.otp,
          customerId: active.customerId,
          name: active.name,
          plan: active.plan,
          expiresAt: active.expiresAt,
          requestedAt: active.requestedAt,
        },
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        hasActiveOtp: false,
      },
    });
  } catch (error) {
    console.error('Get Active OTP Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to check active OTP' });
  }
};

// POST /api/attendance/verify-otp - Verify receptionist entered OTP & record attendance clock-in
const verifyOtp = async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan, otp, terminal } = req.body;

    if (!otp) {
      return res.status(400).json({ status: 'error', message: 'OTP is required for manual verification' });
    }

    cleanupExpiredOtps();

    const cleanOtp = String(otp).trim();
    let matchedData = null;

    const keysToCheck = [
      customerId ? String(customerId).toLowerCase() : null,
      userId ? String(userId).toLowerCase() : null,
      email ? String(email).toLowerCase() : null,
      name ? name.toLowerCase().trim() : null,
    ].filter(Boolean);

    for (const key of keysToCheck) {
      if (activeOtpMap.has(key)) {
        const candidate = activeOtpMap.get(key);
        if (candidate.otp === cleanOtp && candidate.expiresAt > Date.now()) {
          matchedData = candidate;
          break;
        }
      }
    }

    if (!matchedData) {
      for (const [, v] of activeOtpMap.entries()) {
        if (v.otp === cleanOtp && v.expiresAt > Date.now()) {
          matchedData = v;
          break;
        }
      }
    }

    if (!matchedData) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP code. Please check the code or request a new one.',
      });
    }

    // 6-Hour Cooldown Validation before finalizing attendance
    const cooldownStatus = await check6HourCooldown({
      customerId: matchedData.customerId || customerId,
      userId: matchedData.userId || userId,
      name: matchedData.name || name,
      email: matchedData.email || email,
    });

    if (cooldownStatus.isBlocked) {
      console.warn(`⛔ OTP verification blocked: ${matchedData.name} already checked in within 6 hrs`);
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus,
      });
    }

    const now = new Date();
    const timeInStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = now.toISOString().split('T')[0];
    const logId = `LOG-${Date.now().toString().slice(-4)}`;

    const attendanceDoc = new Attendance({
      logId,
      customerId: matchedData.customerId || customerId || 'CUST-301',
      userId: matchedData.userId || userId || null,
      name: matchedData.name || name || 'Athlete Member',
      email: matchedData.email || email || '',
      phone: matchedData.phone || phone || '',
      plan: matchedData.plan || plan || 'PRO MEMBERSHIP',
      terminal: terminal || 'Turnstile Gate Alpha-1 (Front Desk Manual)',
      timeIn: timeInStr,
      timeOut: '--',
      date: dateStr,
      status: 'Active Inside',
      verification: 'Manual OTP Verified',
      otpCode: cleanOtp,
      checkInTimestamp: now,
    });

    await attendanceDoc.save();

    matchedData.verified = true;
    for (const [k, v] of activeOtpMap.entries()) {
      if (v.otp === cleanOtp || v.customerId === matchedData.customerId) {
        activeOtpMap.delete(k);
      }
    }

    console.log(`✅ Customer ${attendanceDoc.name} checked in via OTP at ${timeInStr} (Log: ${logId})`);

    return res.status(200).json({
      status: 'success',
      message: `Access Granted: ${attendanceDoc.name} checked in successfully!`,
      data: {
        id: attendanceDoc.logId,
        _id: attendanceDoc._id,
        logId: attendanceDoc.logId,
        customerId: attendanceDoc.customerId,
        userId: attendanceDoc.userId,
        name: attendanceDoc.name,
        email: attendanceDoc.email,
        phone: attendanceDoc.phone,
        plan: attendanceDoc.plan,
        terminal: attendanceDoc.terminal,
        timeIn: attendanceDoc.timeIn,
        timeOut: attendanceDoc.timeOut,
        date: attendanceDoc.date,
        status: attendanceDoc.status,
        verification: attendanceDoc.verification,
        checkInTimestamp: attendanceDoc.checkInTimestamp,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to verify OTP' });
  }
};

// POST /api/attendance/quick-checkin - Direct RFID / Fast Scanner Check-In
const quickCheckIn = async (req, res) => {
  try {
    const { customerId, userId, name, email, phone, plan, terminal, verification } = req.body;
    if (!name && !customerId && !userId) {
      return res.status(400).json({ status: 'error', message: 'Member details required for check-in' });
    }

    // 6-Hour Cooldown Validation
    const cooldownStatus = await check6HourCooldown({ customerId, userId, name, email });
    if (cooldownStatus.isBlocked) {
      return res.status(400).json({
        status: 'already_checked_in',
        message: cooldownStatus.message,
        data: cooldownStatus,
      });
    }

    const now = new Date();
    const timeInStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const dateStr = now.toISOString().split('T')[0];
    const logId = `LOG-${Date.now().toString().slice(-4)}`;

    const attendanceDoc = new Attendance({
      logId,
      customerId: customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      userId: userId || null,
      name: name || 'Athlete Member',
      email: email || '',
      phone: phone || '',
      plan: plan || 'PRO MEMBERSHIP',
      terminal: terminal || 'Turnstile Gate Alpha-1',
      timeIn: timeInStr,
      timeOut: '--',
      date: dateStr,
      status: 'Active Inside',
      verification: verification || 'Biometric NFC Pass',
      checkInTimestamp: now,
    });

    await attendanceDoc.save();

    return res.status(200).json({
      status: 'success',
      message: `Access Granted: ${attendanceDoc.name} checked in!`,
      data: attendanceDoc,
    });
  } catch (error) {
    console.error('Quick checkin error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Failed to perform check-in' });
  }
};

// GET /api/attendance - Fetch all attendance logs (For Receptionist & Admin Dashboards)
const getAllAttendance = async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const query = {};
    if (req.query.userId) {
      query.$or = [
        { userId: req.query.userId },
        { customerId: req.query.userId },
      ];
    } else if (req.query.email) {
      query.email = req.query.email;
    }
    const logs = await Attendance.find(query)
      .sort({ createdAt: -1 })
      .limit(300)
      .lean()
      .exec();

    const formatted = logs.map((l) => ({
      id: l.logId || `LOG-${String(l._id).slice(-4)}`,
      _id: l._id,
      logId: l.logId || `LOG-${String(l._id).slice(-4)}`,
      customerId: l.customerId,
      userId: l.userId,
      name: l.name,
      email: l.email,
      phone: l.phone,
      plan: l.plan,
      gate: l.terminal || 'Turnstile Gate Alpha-1',
      terminal: l.terminal || 'Turnstile Gate Alpha-1',
      in: l.timeIn,
      timeIn: l.timeIn,
      out: l.timeOut || '--',
      timeOut: l.timeOut || '--',
      date: l.date || (l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : ''),
      status: l.status || 'Active Inside',
      duration: l.status === 'Checked Out' ? '1h 15m' : l.status === 'Inactive' ? 'Session Ended' : 'Active In Arena',
      verification: l.verification || '✓ Verified Turnstile Pass',
      checkInTimestamp: l.checkInTimestamp || l.createdAt,
      createdAt: l.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch attendance logs' });
  }
};

// GET /api/attendance/customer/:identifier - Fetch individual customer attendance history
const getCustomerAttendance = async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const identifier = req.params.identifier;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const orConditions = [
      { customerId: identifier },
      { email: identifier },
      { name: new RegExp(`^${identifier.trim()}$`, 'i') },
    ];
    if (isObjectId) {
      orConditions.push({ userId: identifier });
    }
    const logs = await Attendance.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .exec();

    const formatted = logs.map((l) => ({
      id: l.logId || `LOG-${String(l._id).slice(-4)}`,
      _id: l._id,
      logId: l.logId || `LOG-${String(l._id).slice(-4)}`,
      customerId: l.customerId,
      userId: l.userId,
      name: l.name,
      email: l.email,
      phone: l.phone,
      plan: l.plan,
      gate: l.terminal || 'Turnstile Gate Alpha-1',
      terminal: l.terminal || 'Turnstile Gate Alpha-1',
      in: l.timeIn,
      timeIn: l.timeIn,
      out: l.timeOut || '--',
      timeOut: l.timeOut || '--',
      date: l.date || (l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : ''),
      status: l.status || 'Active Inside',
      duration: l.status === 'Checked Out' ? '1h 15m' : l.status === 'Inactive' ? 'Session Ended' : 'Active In Arena',
      verification: l.verification || '✓ Verified Turnstile Pass',
      checkInTimestamp: l.checkInTimestamp || l.createdAt,
      createdAt: l.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch customer attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch customer attendance' });
  }
};

// GET /api/attendance/my - Fetch personal attendance logs for Customer Dashboard
const getMyAttendance = async (req, res) => {
  try {
    await syncEndOfDayAttendance();
    const userId = req.user.id || req.user._id;
    const userEmail = req.user.email;

    const logs = await Attendance.find({
      $or: [{ userId }, { email: userEmail }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    return res.status(200).json({
      status: 'success',
      count: logs.length,
      data: logs.map((l) => ({
        id: l.logId || `LOG-${String(l._id).slice(-4)}`,
        date: l.date,
        checkIn: l.timeIn,
        checkOut: l.timeOut,
        duration: l.status === 'Checked Out' ? '1 hr 15 mins' : 'In Session',
        gate: l.terminal,
        zone: 'Main Strength & Conditioning Floor',
        status: l.status === 'Active Inside' ? 'Active Floor' : 'Verified',
        verification: l.verification,
      })),
    });
  } catch (error) {
    console.error('Fetch my attendance error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch your attendance history' });
  }
};

// PUT /api/attendance/:id/checkout - Record Member Check-Out
const checkOut = async (req, res) => {
  try {
    const targetId = req.params.id;
    const now = new Date();
    const timeOutStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = await Attendance.findOneAndUpdate(
      { $or: [{ logId: targetId }, { _id: mongoose.isValidObjectId(targetId) ? targetId : null }] },
      {
        $set: {
          status: 'Checked Out',
          timeOut: timeOutStr,
          checkOutTimestamp: now,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Attendance record not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: `Check-out recorded for ${updated.name} at ${timeOutStr}`,
      data: updated,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to record check-out' });
  }
};

module.exports = {
  requestOtp,
  getActiveOtp,
  verifyOtp,
  quickCheckIn,
  getAllAttendance,
  getCustomerAttendance,
  getMyAttendance,
  checkOut,
  syncEndOfDayAttendance,
};
