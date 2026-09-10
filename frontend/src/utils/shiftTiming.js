/**
 * Utility to calculate shift windows, duty status, and online toggle availability
 */

export function parseTimeMinutes(timeStr, ampmStr) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(minutes)) minutes = 0;
  const ampm = (ampmStr || "").toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function checkShiftDutyStatus(shiftString) {
  if (!shiftString || typeof shiftString !== "string" || shiftString.trim() === "") {
    return {
      isShiftActive: true,
      hasShiftAssigned: false,
      shiftWindowText: "Flexible / Open Hours",
      statusText: "Flexible Shift",
      startTimeFormatted: "",
      endTimeFormatted: "",
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
