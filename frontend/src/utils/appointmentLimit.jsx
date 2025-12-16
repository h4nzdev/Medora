// appointmentLimitUtils.js

// Plan limits configuration
export const planLimits = {
  free: 10,
  basic: 20,
  pro: Infinity, // unlimited
};

/**
 * Check if clinic has reached its appointment limit
 * @param {Array} appointments - All appointments from AppointmentContext
 * @param {Object} user - Current user from AuthContext
 * @param {Array} clinics - Clinics from ClinicContext
 * @returns {Object} - Contains limitReached boolean, plan, and clinic info
 */
export const checkAppointmentLimit = (appointments, user, clinics) => {
  if (!user || !user.clinicId || !appointments || !clinics) {
    return {
      limitReached: false,
      plan: "free",
      clinic: null,
      clinicAppointmentCount: 0,
      maxAppointments: planLimits.free,
    };
  }

  // Get the clinic info
  const clinic = clinics?.find((c) => c._id === user.clinicId._id);
  const plan = clinic?.subscriptionPlan || "free";
  const maxAppointments = planLimits[plan] || planLimits.free;

  // Count total appointments for this clinic
  const clinicAppointmentCount = appointments.filter(
    (app) => app.clinicId?._id === user.clinicId._id
  ).length;

  // Check if limit is reached
  const limitReached = clinicAppointmentCount >= maxAppointments;

  return {
    limitReached,
    plan,
    clinic,
    clinicAppointmentCount,
    maxAppointments,
  };
};

/**
 * Simple check function that returns only boolean
 * @param {Array} appointments - All appointments from AppointmentContext
 * @param {Object} user - Current user from AuthContext
 * @param {Array} clinics - Clinics from ClinicContext
 * @returns {boolean} - True if limit is reached
 */
export const isAppointmentLimitReached = (appointments, user, clinics) => {
  const result = checkAppointmentLimit(appointments, user, clinics);
  return result.limitReached;
};

/**
 * Get appointment limit info for display
 * @param {Array} appointments - All appointments from AppointmentContext
 * @param {Object} user - Current user from AuthContext
 * @param {Array} clinics - Clinics from ClinicContext
 * @returns {Object} - Formatted info for UI display
 */
export const getAppointmentLimitInfo = (appointments, user, clinics) => {
  const result = checkAppointmentLimit(appointments, user, clinics);

  return {
    limitReached: result.limitReached,
    plan: result.plan,
    clinicName: result.clinic?.name || "Clinic",
    currentCount: result.clinicAppointmentCount,
    maxLimit: result.maxAppointments,
    message: result.limitReached
      ? `The clinic has reached its appointment limit for the ${result.plan} plan.`
      : `${result.clinicAppointmentCount} / ${result.maxAppointments} appointments used`,
  };
};
