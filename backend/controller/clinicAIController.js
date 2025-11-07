import { GoogleGenerativeAI } from "@google/generative-ai";
import Clinic from "../model/clinicModel.js";
import {
  getClinicBasicStats,
  getOperationalInsights,
  getAvailableTimeSlots,
} from "../services/clinicDataService.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const clinicAIChat = async (req, res) => {
  try {
    const { message } = req.body;
    const clinicId = req.user?._id;

    if (!clinicId) {
      return res.status(401).json({ error: "Clinic authentication required." });
    }

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing GEMINI_API_KEY in environment." });
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ error: "Message is required." });
    }

    // 1. GET CLINIC DATA USING SERVICES
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found." });
    }

    const clinicStats = await getClinicBasicStats(clinicId);
    const operationalInsights = await getOperationalInsights(clinicId);

    // 2. CREATE ENHANCED CLINIC CONTEXT FOR AI
    const clinicContext = `
CLINIC OPERATIONS DATA - MEDORA CLINIC AI ASSISTANT:
- Clinic: ${clinic.clinicName}
- Contact: ${clinic.contactPerson}
- Location: ${clinic.address}
- Today: ${new Date().toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

CURRENT CLINIC STATUS:
- Today's Appointments: ${clinicStats.todays_appointments}
- Appointment Status: ${clinicStats.appointment_status.pending} pending, ${
      clinicStats.appointment_status.scheduled
    } scheduled, ${clinicStats.appointment_status.completed} completed
- Total Doctors: ${clinicStats.total_doctors}
- Recent Patients (30 days): ${clinicStats.recent_patients}

BUSINESS INSIGHTS:
- Completion Rate: ${operationalInsights.business_insights.completion_rate}%
- Average Daily Appointments: ${
      operationalInsights.business_insights.average_daily_appointments
    }
- Operational Efficiency: ${
      operationalInsights.business_insights.operational_efficiency
    }

USER QUERY: ${message}
`;

    // 3. AI PROMPT AND PROCESSING (same as before)
    const prompt = `
You are Medora Clinic AI... [rest of your prompt remains the same]
${clinicContext}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 4. PARSE AND RETURN RESPONSE (same as before)
    let responseData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseData = JSON.parse(jsonMatch[0]);
      } else {
        responseData = {
          reply: responseText,
          clinic_insights: {
            needs_followup: false,
            suggested_actions: [],
            data_mentioned: [],
          },
        };
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      responseData = {
        reply: responseText,
        clinic_insights: {
          needs_followup: false,
          suggested_actions: [],
          data_mentioned: [],
        },
      };
    }

    // 5. FINAL RESPONSE WITH ENHANCED DATA
    const finalResponse = {
      ai_response: responseData,
      clinic_data: {
        clinic_name: clinic.clinicName,
        basic_stats: clinicStats,
        business_insights: operationalInsights.business_insights,
      },
      timestamp: new Date().toISOString(),
    };

    res.json(finalResponse);
  } catch (error) {
    console.error("Clinic AI chat error:", error);
    const msg = error?.message || "Something went wrong with clinic AI";
    res.status(500).json({ error: msg });
  }
};

// Enhanced analytics endpoint using services
export const getClinicAnalytics = async (req, res) => {
  try {
    const clinicId = req.user?._id;

    if (!clinicId) {
      return res.status(401).json({ error: "Clinic authentication required." });
    }

    const clinic = await Clinic.findById(clinicId);
    const operationalInsights = await getOperationalInsights(clinicId);
    const availableSlots = await getAvailableTimeSlots(clinicId);

    res.json({
      clinic_info: {
        name: clinic.clinicName,
        contact_person: clinic.contactPerson,
        location: clinic.address,
        email: clinic.email,
        phone: clinic.phone,
      },
      operational_insights: operationalInsights,
      scheduling: availableSlots,
      report_generated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Clinic analytics error:", error);
    res.status(500).json({ error: "Failed to get clinic analytics" });
  }
};
