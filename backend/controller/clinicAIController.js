import { GoogleGenerativeAI } from "@google/generative-ai";
import Clinic from "../model/clinicModel.js";
import { getSimpleClinicData } from "../services/simpleClinicData.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Conversation memory for clinic AI
const clinicConversationMemory = new Map();

// Clinic session management
function getClinicSession(clinicId) {
  if (!clinicConversationMemory.has(clinicId)) {
    clinicConversationMemory.set(clinicId, {
      messages: [],
      lastActivity: Date.now(),
      clinicContext: {},
      previousQueries: [],
    });
  }

  const session = clinicConversationMemory.get(clinicId);
  session.lastActivity = Date.now();
  return session;
}

function addMessageToClinicSession(clinicId, role, content, metadata = {}) {
  const session = getClinicSession(clinicId);
  const message = {
    role,
    content,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  session.messages.push(message);

  // Keep only last 8 messages to maintain context
  if (session.messages.length > 8) {
    session.messages = session.messages.slice(-8);
  }

  return session;
}

function generateClinicConversationContext(session) {
  if (!session.messages || session.messages.length === 0) {
    return "No previous conversation about clinic operations.";
  }

  let context = "PREVIOUS CLINIC OPERATIONS CONVERSATION:\n\n";

  session.messages.forEach((msg, index) => {
    const role = msg.role === "user" ? "CLINIC STAFF" : "MEDORA CLINIC AI";
    context += `${role}: ${msg.content}\n`;

    // Add metadata if available
    if (msg.insights) {
      context += `[Previous insights: ${JSON.stringify(msg.insights)}]\n`;
    }

    context += "\n";
  });

  return context;
}

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

    // 1. GET CLINIC DATA USING SIMPLE SERVICE
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found." });
    }

    const clinicData = await getSimpleClinicData(clinicId);

    // 2. GET CONVERSATION MEMORY
    const session = getClinicSession(clinicId);
    addMessageToClinicSession(clinicId, "user", message);
    const conversationContext = generateClinicConversationContext(session);

    // 3. CREATE ENHANCED CLINIC CONTEXT FOR AI WITH MEMORY
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

SYSTEM DATA I CAN ACCESS:
- Today's Appointments: ${clinicData.todays_appointments}
- Total Doctors: ${clinicData.total_doctors}
- Total Patients: ${clinicData.total_patients}
- Pending Appointments: ${clinicData.pending_appointments}
- Completed Appointments: ${clinicData.completed_appointments}

CONVERSATION HISTORY:
${conversationContext}

CURRENT STAFF QUERY: ${message}
`;

    // 4. AI PROMPT WITH CONVERSATION MEMORY
    const prompt = `
You are Medora Clinic AI - a specialized operations assistant for clinic management in the Philippines. You have access to real-time clinic data and conversation history.

CONVERSATION MEMORY GUIDELINES:
- Remember previous questions and answers about clinic operations
- Continue naturally from previous discussions
- Build on insights from earlier conversations
- Maintain context about ongoing clinic issues or topics
- Reference previous data points when relevant

CLINIC OPERATIONS FOCUS:
- Appointment scheduling and management
- Staff and resource allocation  
- Patient flow optimization
- Business performance analysis
- Operational efficiency improvements
- Data-driven recommendations

RESPONSE FORMAT: Return JSON with this exact structure:
{
  "reply": "Your response that continues the conversation naturally...",
  "clinic_insights": {
    "needs_followup": true/false,
    "suggested_actions": ["action1", "action2"],
    "data_mentioned": ["appointments", "efficiency", "etc"]
  },
  "followup_questions": ["question1", "question2"]
}

IMPORTANT: 
- Provide continuity in your recommendations
- Ask relevant follow-up questions based on context

${clinicContext}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 350,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. PARSE AND RETURN RESPONSE
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
          followup_questions: [],
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
        followup_questions: [],
      };
    }

    // 6. FINAL RESPONSE WITH ENHANCED DATA
    const finalResponse = {
      ai_response: responseData,
      clinic_data: {
        clinic_name: clinic.clinicName,
        basic_stats: clinicData,
      },
      conversation_context: {
        session_id: clinicId,
        message_count: session.messages.length,
        has_previous_conversation: session.messages.length > 1,
      },
      timestamp: new Date().toISOString(),
    };

    // Store AI response in conversation memory
    addMessageToClinicSession(clinicId, "assistant", responseData.reply, {
      insights: responseData.clinic_insights,
      followup_questions: responseData.followup_questions,
    });

    console.log(
      `🏥 Clinic AI conversation: ${session.messages.length} messages`
    );
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
    const clinicData = await getSimpleClinicData(clinicId);

    // Get conversation stats
    const session = getClinicSession(clinicId);

    res.json({
      clinic_info: {
        name: clinic.clinicName,
        contact_person: clinic.contactPerson,
        location: clinic.address,
        email: clinic.email,
        phone: clinic.phone,
      },
      clinic_data: clinicData,
      conversation_stats: {
        total_messages: session.messages.length,
        last_activity: session.lastActivity,
        recent_queries: session.previousQueries.slice(-5),
      },
      report_generated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Clinic analytics error:", error);
    res.status(500).json({ error: "Failed to get clinic analytics" });
  }
};

// Get clinic conversation history
export const getClinicConversationHistory = async (req, res) => {
  try {
    const clinicId = req.user?._id;

    if (!clinicId) {
      return res.status(401).json({ error: "Clinic authentication required." });
    }

    const session = getClinicSession(clinicId);

    res.json({
      clinic_id: clinicId,
      messages: session.messages,
      total_messages: session.messages.length,
      last_activity: session.lastActivity,
      session_created:
        session.messages.length > 0 ? session.messages[0].timestamp : null,
    });
  } catch (error) {
    console.error("Get clinic conversation error:", error);
    res.status(500).json({ error: "Failed to get conversation history" });
  }
};

// Clear clinic conversation
export const clearClinicConversation = async (req, res) => {
  try {
    const clinicId = req.user?._id;

    if (!clinicId) {
      return res.status(401).json({ error: "Clinic authentication required." });
    }

    clinicConversationMemory.delete(clinicId);

    res.json({
      success: true,
      message: "Clinic conversation cleared successfully",
      clinic_id: clinicId,
    });
  } catch (error) {
    console.error("Clear clinic conversation error:", error);
    res.status(500).json({ error: "Failed to clear conversation" });
  }
};
