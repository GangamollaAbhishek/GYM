/**
 * Utility to calculate shift windows, duty status, and online toggle availability
 */

export function parseTimeMinutes(timeStr, ampmStr) {
  if (!timeStr) return 0;
  let [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;
  const ampm = (ampmStr || "").toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatCurrentTime(date = new Date()) {
  const d = typeof date === "number" || typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "--";
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${strHours}:${strMinutes} ${ampm}`;
}

export function getTodayDateString(date = new Date()) {
  const d = typeof date === "number" || typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function calculateDutyHours(clockInTimestamp, clockOutTimestamp = null) {
  if (!clockInTimestamp) return "0.0 hrs";
  const startMs = typeof clockInTimestamp === "number" ? clockInTimestamp : new Date(clockInTimestamp).getTime();
  if (isNaN(startMs)) return "0.0 hrs";

  const endMs = clockOutTimestamp
    ? typeof clockOutTimestamp === "number"
      ? clockOutTimestamp
      : new Date(clockOutTimestamp).getTime()
    : Date.now();

  if (isNaN(endMs) || endMs < startMs) return "0.1 hrs";

  const diffMinutes = Math.max(1, Math.floor((endMs - startMs) / (1000 * 60)));
  const hours = (diffMinutes / 60).toFixed(1);
  return `${hours} hrs`;
}

export function checkShiftDutyStatus(shiftString) {
  if (!shiftString || typeof shiftString !== "string" || shiftString.trim() === "") {
    return {
      isShiftActive: true,
      hasShiftAssigned: false,
      shiftWindowText: "Flexible / Open Hours",
      statusText: "Flexible Shift",
      startTimeFormatted: "06:00 AM",
      endTimeFormatted: "10:00 PM",
      nextShiftMessage: "Shift window open",
    };
  }

  // Regex to extract start time and end time e.g. "06:00 AM - 02:00 PM" or "6:00 AM to 2:00 PM"
  const match = shiftString.match(
    /(\d{1,2}:\d{2})\s*(AM|PM|am|pm)\s*(?:-|–|to)\s*(\d{1,2}:\d{2})\s*(AM|PM|am|pm)/i
  );

  if (!match) {
    return {
      isShiftActive: true,
      hasShiftAssigned: true,
      shiftWindowText: shiftString,
      statusText: "Active Shift",
      startTimeFormatted: "",
      endTimeFormatted: "",
      nextShiftMessage: "Shift active",
    };
  }

  const startMinutes = parseTimeMinutes(match[1], match[2]);
  const endMinutes = parseTimeMinutes(match[3], match[4]);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let isShiftActive = false;

  if (startMinutes <= endMinutes) {
    // Standard same-day shift (e.g. 06:00 AM to 02:00 PM)
    isShiftActive = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight shift crossing midnight (e.g. 10:00 PM to 06:00 AM)
    isShiftActive = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  const startTimeFormatted = `${match[1]} ${match[2].toUpperCase()}`;
  const endTimeFormatted = `${match[3]} ${match[4].toUpperCase()}`;
  const shiftWindowText = `${startTimeFormatted} - ${endTimeFormatted}`;

  let nextShiftMessage = "";
  if (!isShiftActive) {
    let diff = startMinutes - currentMinutes;
    if (diff < 0) diff += 1440; // next day
    const hoursRemaining = Math.floor(diff / 60);
    const minsRemaining = diff % 60;
    nextShiftMessage = `Shift starts in ${
      hoursRemaining > 0 ? `${hoursRemaining}h ` : ""
    }${minsRemaining}m (at ${startTimeFormatted})`;
  } else {
    let diff = endMinutes - currentMinutes;
    if (diff < 0) diff += 1440;
    const hoursRemaining = Math.floor(diff / 60);
    const minsRemaining = diff % 60;
    nextShiftMessage = `Shift active • ${
      hoursRemaining > 0 ? `${hoursRemaining}h ` : ""
    }${minsRemaining}m remaining`;
  }

  return {
    isShiftActive,
    hasShiftAssigned: true,
    startMinutes,
    endMinutes,
    currentMinutes,
    startTimeFormatted,
    endTimeFormatted,
    shiftWindowText,
    nextShiftMessage,
    statusText: isShiftActive
      ? "Shift Active (Duty Window Open)"
      : "Shift Inactive (Off Duty Hours)",
  };
}

// -------------------------------------------------------------
// STAFF DUTY SESSION STORAGE & REAL-TIME TRACKING
// -------------------------------------------------------------

const DUTY_STORAGE_KEY = "titan_staff_duty_records";

export function getAllStaffDutyRecords() {
  try {
    const raw = localStorage.getItem(DUTY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Retrieve today's staff duty record with fuzzy ID/Name/Email/Attendance matching
 */
export function getTodayStaffDutyRecord(
  staffId,
  role = "trainer",
  defaultShift = "06:00 AM - 02:00 PM",
  staffName = "",
  staffEmail = "",
  userId = ""
) {
  if (!staffId && !staffName && !userId && !staffEmail) return null;
  const today = getTodayDateString();
  const allRecords = getAllStaffDutyRecords();

  const cleanStaffId = staffId ? String(staffId).trim() : "";
  const cleanUserId = userId ? String(userId).trim() : "";
  const cleanName = staffName ? String(staffName).trim().toLowerCase() : "";
  const cleanEmail = staffEmail ? String(staffEmail).trim().toLowerCase() : "";

  // 1. Check direct key match
  let matchedRecord =
    (cleanStaffId ? allRecords[`${today}_${cleanStaffId}`] : null) ||
    (cleanUserId ? allRecords[`${today}_${cleanUserId}`] : null) ||
    (cleanName ? allRecords[`${today}_${cleanName}`] : null);

  // 2. Scan all records for today if not found by primary key
  if (!matchedRecord) {
    const todayPrefix = `${today}_`;
    for (const [key, rec] of Object.entries(allRecords)) {
      if (!key.startsWith(todayPrefix) || !rec) continue;

      const recStaffId = rec.staffId ? String(rec.staffId).trim() : "";
      const recUserId = rec.userId ? String(rec.userId).trim() : "";
      const recName = rec.name ? String(rec.name).trim().toLowerCase() : "";
      const recEmail = rec.email ? String(rec.email).trim().toLowerCase() : "";

      const idMatches =
        (cleanStaffId && (recStaffId === cleanStaffId || recUserId === cleanStaffId || key === `${today}_${cleanStaffId}`)) ||
        (cleanUserId && (recStaffId === cleanUserId || recUserId === cleanUserId || key === `${today}_${cleanUserId}`));

      const nameMatches =
        cleanName &&
        recName &&
        (recName === cleanName ||
          recName.includes(cleanName) ||
          cleanName.includes(recName));

      const emailMatches =
        cleanEmail && recEmail && recEmail === cleanEmail;

      if (idMatches || nameMatches || emailMatches) {
        matchedRecord = rec;
        break;
      }
    }
  }

  // 3. If record found, calculate live active duty hours
  if (matchedRecord) {
    const isLiveActive =
      matchedRecord.status === "On Duty" ||
      matchedRecord.status === "Online" ||
      matchedRecord.status === "Active Inside";

    let liveDutyHours = matchedRecord.dutyHours || "0.0 hrs";

    if (isLiveActive) {
      const clockIn = matchedRecord.clockInTimestamp || Date.now();
      const calculated = calculateDutyHours(clockIn, null);
      liveDutyHours = calculated === "0.0 hrs" ? "0.1 hrs" : calculated;
    }

    return {
      ...matchedRecord,
      status: isLiveActive
        ? role === "trainer"
          ? "On Duty"
          : "Online"
        : matchedRecord.status || (role === "trainer" ? "Off Duty" : "Offline"),
      dutyHours: liveDutyHours,
    };
  }

  // 4. Default if not clocked in today
  return {
    staffId: cleanStaffId || cleanUserId || "staff",
    userId: cleanUserId || cleanStaffId,
    name: staffName || "Staff Member",
    email: staffEmail || "",
    role,
    date: today,
    shift: defaultShift,
    status: role === "trainer" ? "Off Duty" : "Offline",
    timeIn: "--",
    timeOut: "--",
    clockInTimestamp: null,
    clockOutTimestamp: null,
    dutyHours: "0.0 hrs",
    completed: false,
  };
}

/**
 * Start a staff duty session when Online is toggled or attendance punch happens
 */
export function startStaffDutySession(
  staffId,
  staffName = "Staff Member",
  role = "trainer",
  shift = "06:00 AM - 02:00 PM",
  staffEmail = "",
  userId = ""
) {
  if (!staffId && !staffName && !userId) return null;
  const today = getTodayDateString();
  const allRecords = getAllStaffDutyRecords();

  const primaryId = String(staffId || userId || staffName).trim();
  const key = `${today}_${primaryId}`;

  const existing = getTodayStaffDutyRecord(
    primaryId,
    role,
    shift,
    staffName,
    staffEmail,
    userId
  );

  const clockInTimestamp =
    existing?.clockInTimestamp && !existing?.completed
      ? existing.clockInTimestamp
      : Date.now();

  const timeIn =
    existing?.timeIn && existing.timeIn !== "--" && !existing?.completed
      ? existing.timeIn
      : formatCurrentTime(new Date(clockInTimestamp));

  const record = {
    staffId: String(staffId || primaryId),
    userId: String(userId || staffId || ""),
    name: staffName || existing?.name || "Staff Member",
    email: staffEmail || existing?.email || "",
    role,
    date: today,
    shift: shift || existing?.shift || "06:00 AM - 02:00 PM",
    status: role === "trainer" ? "On Duty" : "Online",
    timeIn,
    timeOut: "--",
    clockInTimestamp,
    clockOutTimestamp: null,
    dutyHours:
      calculateDutyHours(clockInTimestamp, null) === "0.0 hrs"
        ? "0.1 hrs"
        : calculateDutyHours(clockInTimestamp, null),
    completed: false,
    updatedAt: new Date().toISOString(),
  };

  allRecords[key] = record;
  if (userId && String(userId) !== primaryId) {
    allRecords[`${today}_${String(userId).trim()}`] = record;
  }
  if (staffName) {
    allRecords[`${today}_${staffName.trim().toLowerCase()}`] = record;
  }

  try {
    localStorage.setItem(DUTY_STORAGE_KEY, JSON.stringify(allRecords));
    window.dispatchEvent(
      new CustomEvent("titan_duty_status_changed", {
        detail: record,
      })
    );
  } catch (e) {
    console.warn("Duty storage save error:", e);
  }

  return record;
}

/**
 * End a staff duty session when Offline is clicked
 */
export function endStaffDutySession(
  staffId,
  staffName = "Staff Member",
  role = "trainer",
  shift = "06:00 AM - 02:00 PM",
  staffEmail = "",
  userId = ""
) {
  if (!staffId && !staffName && !userId) return null;
  const today = getTodayDateString();
  const allRecords = getAllStaffDutyRecords();

  const primaryId = String(staffId || userId || staffName).trim();
  const key = `${today}_${primaryId}`;

  const existing = getTodayStaffDutyRecord(
    primaryId,
    role,
    shift,
    staffName,
    staffEmail,
    userId
  );

  const clockInTimestamp =
    existing?.clockInTimestamp || Date.now() - 60000;
  const clockOutTimestamp = Date.now();
  const timeIn =
    existing?.timeIn && existing.timeIn !== "--"
      ? existing.timeIn
      : formatCurrentTime(new Date(clockInTimestamp));
  const timeOut = formatCurrentTime(new Date(clockOutTimestamp));
  const finalDutyHours = calculateDutyHours(
    clockInTimestamp,
    clockOutTimestamp
  );

  const record = {
    staffId: String(staffId || primaryId),
    userId: String(userId || staffId || ""),
    name: staffName || existing?.name || "Staff Member",
    email: staffEmail || existing?.email || "",
    role,
    date: today,
    shift: shift || existing?.shift || "06:00 AM - 02:00 PM",
    status: role === "trainer" ? "Off Duty" : "Offline",
    timeIn,
    timeOut,
    clockInTimestamp,
    clockOutTimestamp,
    dutyHours: finalDutyHours === "0.0 hrs" ? "0.1 hrs" : finalDutyHours,
    completed: true,
    updatedAt: new Date().toISOString(),
  };

  allRecords[key] = record;
  if (userId && String(userId) !== primaryId) {
    allRecords[`${today}_${String(userId).trim()}`] = record;
  }
  if (staffName) {
    allRecords[`${today}_${staffName.trim().toLowerCase()}`] = record;
  }

  try {
    localStorage.setItem(DUTY_STORAGE_KEY, JSON.stringify(allRecords));
    window.dispatchEvent(
      new CustomEvent("titan_duty_status_changed", {
        detail: record,
      })
    );
  } catch (e) {
    console.warn("Duty storage save error:", e);
  }

  return record;
}
