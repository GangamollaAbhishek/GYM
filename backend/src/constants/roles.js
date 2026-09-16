/**
 * PAMS Fitness & Sports - Core System Role & Activity Constants
 */

const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  RECEPTIONIST: 'RECEPTIONIST',
  TRAINER: 'TRAINER',
  CUSTOMER: 'CUSTOMER',
});

const ACTIVITIES = Object.freeze({
  GYM: 'GYM',
  YOGA: 'YOGA',
  ZUMBA: 'ZUMBA',
  BASKETBALL: 'BASKETBALL',
  BADMINTON: 'BADMINTON',
  SWIMMING: 'SWIMMING',
});

/**
 * Normalizes any legacy or case-varied role string into the official 5-role enum.
 * e.g. 'admin' -> 'ADMIN', 'customer' -> 'CUSTOMER', 'member' -> 'CUSTOMER'
 */
const normalizeRole = (role) => {
  if (!role) return ROLES.CUSTOMER;
  const upper = String(role).toUpperCase().trim();
  if (upper === 'SUPER_ADMIN' || upper === 'SUPERADMIN') return ROLES.SUPER_ADMIN;
  if (upper === 'ADMIN') return ROLES.ADMIN;
  if (upper === 'RECEPTIONIST' || upper === 'RECEPTION') return ROLES.RECEPTIONIST;
  if (upper === 'TRAINER' || upper === 'COACH') return ROLES.TRAINER;
  if (upper === 'CUSTOMER' || upper === 'MEMBER' || upper === 'ATHLETE') return ROLES.CUSTOMER;
  return ROLES.CUSTOMER;
};

module.exports = {
  ROLES,
  ACTIVITIES,
  normalizeRole,
};
