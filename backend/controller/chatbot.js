import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Simple in-memory storage for conversation context
const conversationMemory = new Map();

// Enhanced session management
function getSession(sessionId) {
  if (!conversationMemory.has(sessionId)) {
    conversationMemory.set(sessionId, {
      messages: [],
      lastActivity: Date.now(),
      patientInfo: {},
      mentionedSymptoms: [],
    });
  }

  const session = conversationMemory.get(sessionId);
  session.lastActivity = Date.now();
  return session;
}

// Add message to session
function addMessageToSession(sessionId, role, content, metadata = {}) {
  const session = getSession(sessionId);
  const message = {
    role,
    content,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  session.messages.push(message);

  // Keep only last 6 messages to maintain context
  if (session.messages.length > 6) {
    session.messages = session.messages.slice(-6);
  }

  return session;
}

// Generate conversation context for AI
function generateConversationContext(session) {
  if (!session.messages || session.messages.length === 0) {
    return "No previous conversation.";
  }

  let context = "PREVIOUS CONVERSATION:\n\n";

  session.messages.forEach((msg, index) => {
    const role = msg.role === "user" ? "USER" : "MEDORA AI";
    context += `${role}: ${msg.content}\n`;

    // Add metadata if available
    if (msg.severity) {
      context += `[Previous severity: ${msg.severity}]\n`;
    }
    if (msg.suggested_clinics && msg.suggested_clinics.length > 0) {
      context += `[Previously suggested clinics: ${msg.suggested_clinics.join(
        ", "
      )}]\n`;
    }

    context += "\n";
  });

  return context;
}

// Extract and update patient info from conversation
function updatePatientInfo(session, userMessage, aiResponse) {
  const lowerMessage = userMessage.toLowerCase();

  // Extract symptoms
  const symptomKeywords = [
    "fever",
    "cough",
    "headache",
    "pain",
    "hurt",
    "stomach",
    "rash",
    "cold",
    "flu",
    "sore throat",
    "nausea",
    "vomiting",
    "diarrhea",
    "chest pain",
    "shortness of breath",
    "dizziness",
    "fatigue",
  ];

  const newSymptoms = symptomKeywords.filter(
    (symptom) =>
      lowerMessage.includes(symptom) &&
      !session.mentionedSymptoms.includes(symptom)
  );

  if (newSymptoms.length > 0) {
    session.mentionedSymptoms = [...session.mentionedSymptoms, ...newSymptoms];
    session.patientInfo.symptoms = session.mentionedSymptoms;
  }

  // Update severity
  if (aiResponse.severity) {
    session.patientInfo.lastSeverity = aiResponse.severity;
  }

  // Extract duration
  const durationMatch = userMessage.match(
    /(\d+)\s*(day|days|hour|hours|week|weeks)/i
  );
  if (durationMatch && !session.patientInfo.duration) {
    session.patientInfo.duration = durationMatch[0];
  }
}

// Enhanced chat endpoint with proper conversation memory
export const chatWithGemini = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 350,
      },
    });

    // Get session and add user message
    const session = getSession(sessionId);
    addMessageToSession(sessionId, "user", message);

    // Generate conversation context
    const conversationContext = generateConversationContext(session);

    const prompt = `
CONVERSATION HISTORY:
${conversationContext}

CURRENT USER MESSAGE:
"${message}"

STRICT RULES - FOLLOW EXACTLY:

1. ONLY set "suggest_appointment": true if the user's message contains ANY of these exact phrases:
   - "book appointment"
   - "schedule appointment" 
   - "make appointment"
   - "see doctor"
   - "see a doctor"
   - "want appointment"
   - "need appointment"
   - "make booking"
   - "i want to book"
   - "can i book"
   - "appointment with"

2. For ALL other messages, set "suggest_appointment": false

3. ALWAYS remember the conversation history above and continue naturally

4. Return ONLY this JSON format, nothing else:

{
  "severity": "MILD",
  "reply": "Your response that continues naturally from the conversation history",
  "emergency_trigger": false,
  "suggest_appointment": true/false,
  "appointment_reason": "Appointment booking requested"
}

EXAMPLES:

User: "book appointment" → suggest_appointment: true
User: "i want to see doctor" → suggest_appointment: true  
User: "can i schedule appointment" → suggest_appointment: true
User: "hello" → suggest_appointment: false
User: "headache" → suggest_appointment: false
User: "fever" → suggest_appointment: false

RESPONSE:`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // JSON parsing
    let responseData;
    try {
      responseText = responseText.replace(/```json\s*|\s*```/g, "").trim();
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.log("🔄 First parse failed, trying regex extraction...");
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          responseData = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.error("❌ JSON parse error:", secondError);
          responseData = createFallbackResponse(responseText);
        }
      } else {
        console.error("❌ No JSON found in response");
        responseData = createFallbackResponse(responseText);
      }
    }

    // Clean response
    let cleanReply = responseData.reply || responseText;
    cleanReply = cleanReply
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const finalResponse = {
      severity: responseData.severity || classifySeverity(cleanReply),
      reply: cleanReply,
      emergency_trigger: responseData.emergency_trigger || false,
      suggest_appointment: responseData.suggest_appointment || false,
      appointment_reason:
        responseData.appointment_reason || "Medical consultation",
      sessionId: sessionId,
      conversationLength: session.messages.length,
    };

    // Add AI response to session and update patient info
    addMessageToSession(sessionId, "assistant", cleanReply, {
      severity: finalResponse.severity,
      suggested_clinics: finalResponse.suggested_clinics || [],
    });

    updatePatientInfo(session, message, finalResponse);

    console.log(`💬 Conversation memory: ${session.messages.length} messages`);
    res.json(finalResponse);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};

// Get conversation history endpoint
export const getConversationHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    const session = getSession(sessionId);

    res.json({
      sessionId,
      messages: session.messages,
      patientInfo: session.patientInfo,
      totalMessages: session.messages.length,
      lastActivity: session.lastActivity,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ error: "Failed to get conversation history" });
  }
};

// Clear conversation endpoint
export const clearConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    conversationMemory.delete(sessionId);

    res.json({
      success: true,
      message: "Conversation cleared successfully",
      sessionId,
    });
  } catch (error) {
    console.error("Clear conversation error:", error);
    res.status(500).json({ error: "Failed to clear conversation" });
  }
};

// Helper functions (keep your existing ones)
function createFallbackResponse(rawText) {
  const cleanText = rawText
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

  return {
    reply: cleanText,
    severity: classifySeverity(cleanText),
    emergency_trigger: false,
  };
}

function classifySeverity(text) {
  const lowerText = text.toLowerCase();
  const severeKeywords = [
    "emergency",
    "immediate",
    "911",
    "urgent",
    "severe",
    "chest pain",
    "difficulty breathing",
  ];
  const moderateKeywords = [
    "persistent",
    "worsening",
    "fever",
    "consult doctor",
    "medical attention",
  ];

  if (severeKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "SEVERE";
  } else if (moderateKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "MODERATE";
  } else {
    return "MILD";
  }
}

// 🚨 Philippines Emergency contact function
export const getEmergencyContacts = async (req, res) => {
  try {
    const { severity, location } = req.body;

    // Philippines-specific emergency contacts
    const emergencyContacts = {
      SEVERE: {
        message: "🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED - PHILIPPINES",
        contacts: [
          {
            name: "National Emergency Hotline",
            number: "911",
            type: "emergency",
            description: "Nationwide emergency response",
          },
          {
            name: "Philippine Red Cross",
            number: "143",
            type: "emergency",
            description: "Ambulance and emergency services",
          },
          {
            name: "Philippine National Police (PNP) Hotline",
            number: "117",
            type: "emergency",
            description: "Police and emergency assistance",
          },
          {
            name: "Bureau of Fire Protection",
            number: "160",
            type: "emergency",
            description: "Fire and rescue services",
          },
          {
            name: "National Poison Control",
            number: "(02) 8524-1078",
            type: "specialty",
            description:
              "UP Manila National Poison Management and Control Center",
          },
          {
            name: "National Center for Mental Health",
            number: "(02) 8531-9001",
            type: "mental_health",
            description: "24/7 Mental health crisis line",
          },
        ],
        actions: [
          "Call 911 or 143 immediately for emergency medical response",
          "Do not drive yourself to the hospital - wait for ambulance",
          "Have someone stay with you while waiting for help",
          "Prepare your PhilHealth information and identification",
          "Keep your location address ready to provide to responders",
        ],
        hospitals: [
          "Philippine General Hospital (PGH) - Manila",
          "St. Luke's Medical Center - Quezon City & Global City",
          "Makati Medical Center - Makati",
          "The Medical City - Pasig",
          "Asian Hospital and Medical Center - Muntinlupa",
        ],
      },
      MODERATE: {
        message: "⚠️ Medical Attention Recommended - PHILIPPINES",
        contacts: [
          {
            name: "DOH Hotline",
            number: "(02) 8651-7800",
            type: "government",
            description: "Department of Health information line",
          },
          {
            name: "Telemedicine Services",
            number: "Varies by provider",
            type: "telehealth",
            description:
              "Consult doctors online via KonsultaMD, SeeYouDoc, or Medgate",
          },
          {
            name: "Local Health Center",
            number: "Check your barangay",
            type: "local_health",
            description: "Visit your nearest barangay health center",
          },
          {
            name: "Mercury Drug Patient Care Line",
            number: "(02) 8911-5073",
            type: "pharmacy",
            description: "Medication and pharmacy questions",
          },
        ],
        actions: [
          "Visit your nearest hospital emergency room or urgent care",
          "Consult with a doctor within 24 hours",
          "Check if your HMO (Maxicare, Intellicare, etc.) has telemedicine",
          "Monitor symptoms closely and rest",
          "Keep hydrated with clean water and oral rehydration solutions",
        ],
        recommendations: [
          "Public Hospitals: PGH, East Avenue Medical Center, Jose R. Reyes Memorial Medical Center",
          "Private Hospitals: St. Luke's, Makati Med, Medical City branches",
          "Urgent Care: Hi-Precision Diagnostics, Healthway Medical clinics",
        ],
      },
      MILD: {
        message: "ℹ️ Self-Care Recommended - PHILIPPINES",
        contacts: [
          {
            name: "Botika ng Barangay",
            number: "Visit local barangay",
            type: "pharmacy",
            description: "Affordable medicines at your local barangay",
          },
          {
            name: "Mercury Drug / Watsons",
            number: "Visit nearest branch",
            type: "pharmacy",
            description: "Over-the-counter medications and consultations",
          },
          {
            name: "Barangay Health Center",
            number: "Check local barangay",
            type: "local_health",
            description: "Free basic medical consultation and services",
          },
          {
            name: "DOH Health Education Line",
            number: "(02) 8651-7800",
            type: "information",
            description: "General health information and advice",
          },
        ],
        actions: [
          "Visit your barangay health center for free consultation",
          "Get adequate rest and stay hydrated with clean water",
          "Use over-the-counter medicines from trusted pharmacies",
          "Practice proper hygiene and handwashing",
          "Consult a doctor if symptoms persist beyond 3 days",
        ],
        home_remedies: [
          "Ginger tea for nausea or sore throat",
          "Calamansi juice with honey for cough and cold",
          "Warm salt water gargle for sore throat",
          "Proper rest in well-ventilated area",
          "Balanced diet with fruits and vegetables",
        ],
      },
    };

    const response = emergencyContacts[severity] || emergencyContacts.MODERATE;

    res.json(response);
  } catch (error) {
    console.error("Emergency contacts error:", error);
    res.status(500).json({ error: "Failed to get emergency contacts" });
  }
};

export const summarizeChatHistory = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing GEMINI_API_KEY in environment." });
    }

    if (messages.length === 0) {
      return res
        .status(400)
        .json({ error: "No conversation history found for this session." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300,
      },
    });

    // Enhanced summary prompt with full conversation context
    const summaryPrompt = `
You are a medical assistant helping clinic staff in the Philippines understand patient conversations.

Please analyze the following complete chat conversation between a patient and our chatbot, and provide a comprehensive summary for Philippine healthcare providers.

COMPLETE CONVERSATION HISTORY:
${messages
  .map((msg, index) => `[${index + 1}] ${msg.role.toUpperCase()}: ${msg.text}`)
  .join("\n")}

Please provide a detailed summary that includes:
1. Patient's main symptoms or concerns throughout the conversation
2. Progression of symptoms or concerns over time
3. Key medical advice and recommendations given
4. Emergency triggers or red flags detected
5. Patient's response to advice and follow-up questions
6. Recommended next steps for healthcare providers in the Philippines
7. Any patterns or important context from the entire conversation

Keep the summary clear, professional, and helpful for medical staff in the Philippines. Use plain text format.
`;

    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

    res.json({
      summary: summary,
      messageCount: messages.length,
    });
  } catch (error) {
    console.error("Summary error:", error);
    const msg = error?.message || "Something went wrong while summarizing";
    res.status(500).json({ error: msg });
  }
};
