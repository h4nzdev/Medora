import Appointment from "../model/appointmentModel.js";
import Doctor from "../model/doctorModel.js";
import Patient from "../model/patientsModel.js";

// Get basic clinic statistics for AI context
export const getClinicBasicStats = async (clinicId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments count
    const todaysAppointments = await Appointment.countDocuments({
      clinicId,
      date: { $gte: today, $lt: tomorrow },
    });

    // Appointment status breakdown
    const statusBreakdown = await Appointment.aggregate([
      {
        $match: { clinicId: clinicId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation to simple object
    const appointmentStatus = {
      pending: 0,
      accepted: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };

    statusBreakdown.forEach((item) => {
      appointmentStatus[item._id] = item.count;
    });

    // Doctors count
    const doctorsCount = await Doctor.countDocuments({ clinicId });

    // Recent patients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPatientsCount = await Patient.countDocuments({
      clinicId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      todays_appointments: todaysAppointments,
      appointment_status: appointmentStatus,
      total_doctors: doctorsCount,
      recent_patients: recentPatientsCount,
      last_updated: new Date(),
    };
  } catch (error) {
    console.error("Error in getClinicBasicStats:", error);
    throw new Error("Failed to fetch clinic statistics");
  }
};

// Get detailed appointment analytics for the week
export const getWeeklyAppointmentAnalytics = async (clinicId) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Weekly appointments by day
    const weeklyAppointments = await Appointment.aggregate([
      {
        $match: {
          clinicId: clinicId,
          date: { $gte: startOfWeek, $lt: endOfWeek },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Appointment types breakdown
    const appointmentTypes = await Appointment.aggregate([
      {
        $match: { clinicId: clinicId },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $match: { _id: { $ne: null } },
      },
    ]);

    // Booking types (online vs walk-in)
    const bookingTypes = await Appointment.aggregate([
      {
        $match: { clinicId: clinicId },
      },
      {
        $group: {
          _id: "$bookingType",
          count: { $sum: 1 },
        },
      },
      {
        $match: { _id: { $ne: null } },
      },
    ]);

    return {
      weekly_appointments: weeklyAppointments,
      appointment_types: appointmentTypes,
      booking_types: bookingTypes,
      week_start: startOfWeek,
      week_end: endOfWeek,
    };
  } catch (error) {
    console.error("Error in getWeeklyAppointmentAnalytics:", error);
    throw new Error("Failed to fetch weekly analytics");
  }
};

// Get doctor availability and schedule insights
export const getDoctorScheduleInsights = async (clinicId) => {
  try {
    const doctors = await Doctor.find({ clinicId }).select(
      "name specialty schedule availability"
    );

    // Get today's appointments by doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointmentsByDoctor = await Appointment.aggregate([
      {
        $match: {
          clinicId: clinicId,
          date: { $gte: today, $lt: tomorrow },
          status: { $in: ["pending", "accepted", "scheduled"] },
        },
      },
      {
        $group: {
          _id: "$doctorId",
          appointment_count: { $sum: 1 },
        },
      },
    ]);

    // Enhance doctors data with today's appointment count
    const doctorsWithSchedule = doctors.map((doctor) => {
      const todayAppointments = todaysAppointmentsByDoctor.find(
        (item) => item._id.toString() === doctor._id.toString()
      );

      return {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        today_appointments: todayAppointments
          ? todayAppointments.appointment_count
          : 0,
        schedule: doctor.schedule || {},
        availability: doctor.availability || "available",
      };
    });

    return {
      doctors: doctorsWithSchedule,
      total_doctors: doctors.length,
      busiest_doctor: doctorsWithSchedule.reduce(
        (max, doctor) =>
          doctor.today_appointments > max.today_appointments ? doctor : max,
        { today_appointments: -1 }
      ),
      available_doctors: doctorsWithSchedule.filter(
        (doc) => doc.availability === "available" && doc.today_appointments < 10
      ).length,
    };
  } catch (error) {
    console.error("Error in getDoctorScheduleInsights:", error);
    throw new Error("Failed to fetch doctor schedule insights");
  }
};

// Get operational insights for the clinic
export const getOperationalInsights = async (clinicId) => {
  try {
    const basicStats = await getClinicBasicStats(clinicId);
    const weeklyAnalytics = await getWeeklyAppointmentAnalytics(clinicId);
    const doctorInsights = await getDoctorScheduleInsights(clinicId);

    // Calculate some business insights
    const totalAppointments = Object.values(
      basicStats.appointment_status
    ).reduce((a, b) => a + b, 0);
    const completionRate =
      totalAppointments > 0
        ? (basicStats.appointment_status.completed / totalAppointments) * 100
        : 0;

    const averageDailyAppointments =
      weeklyAnalytics.weekly_appointments.length > 0
        ? weeklyAnalytics.weekly_appointments.reduce(
            (sum, day) => sum + day.count,
            0
          ) / weeklyAnalytics.weekly_appointments.length
        : 0;

    return {
      basic_stats: basicStats,
      weekly_analytics: weeklyAnalytics,
      doctor_insights: doctorInsights,
      business_insights: {
        total_appointments: totalAppointments,
        completion_rate: Math.round(completionRate),
        average_daily_appointments:
          Math.round(averageDailyAppointments * 100) / 100,
        patient_retention: basicStats.recent_patients,
        operational_efficiency:
          completionRate > 70 ? "High" : completionRate > 50 ? "Medium" : "Low",
      },
      generated_at: new Date(),
    };
  } catch (error) {
    console.error("Error in getOperationalInsights:", error);
    throw new Error("Failed to fetch operational insights");
  }
};

// Get available time slots for scheduling
export const getAvailableTimeSlots = async (clinicId, date = new Date()) => {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get booked appointments for the date
    const bookedAppointments = await Appointment.find({
      clinicId,
      date: { $gte: targetDate, $lt: nextDate },
      status: { $in: ["scheduled", "accepted"] },
    }).select("date");

    // Generate available time slots (simplified version)
    const availableSlots = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 30-minute intervals
        const slotTime = new Date(targetDate);
        slotTime.setHours(hour, minute, 0, 0);

        // Check if this slot is booked
        const isBooked = bookedAppointments.some((appointment) => {
          const appointmentTime = new Date(appointment.date);
          return (
            appointmentTime.getHours() === hour &&
            appointmentTime.getMinutes() === minute
          );
        });

        if (!isBooked) {
          availableSlots.push({
            time: slotTime.toLocaleTimeString("en-PH", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            datetime: slotTime,
            available: true,
          });
        }
      }
    }

    return {
      date: targetDate.toDateString(),
      available_slots: availableSlots,
      total_available: availableSlots.length,
      total_booked: bookedAppointments.length,
    };
  } catch (error) {
    console.error("Error in getAvailableTimeSlots:", error);
    throw new Error("Failed to fetch available time slots");
  }
};
