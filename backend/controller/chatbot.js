import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// In your backend chat endpoint
export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

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
        maxOutputTokens: 200,
      },
    });

    const prompt = `
You are Medora AI, a specialized virtual health assistant and symptom checker.

🚨 EMERGENCY DETECTION:
- Analyze the user's symptoms for severity
- Return a JSON response with this exact format:
{
  "severity": "MILD|MODERATE|SEVERE",
  "reply": "Your response text here...",
  "emergency_trigger": true/false
}

SEVERE SYMPTOMS (emergency_trigger: true):
- Chest pain, difficulty breathing, severe bleeding
- Sudden weakness/numbness, confusion, severe headache  
- Fainting, seizures, high fever with stiff neck
- Severe abdominal pain, poisoning, suicidal thoughts

MODERATE SYMPTOMS (emergency_trigger: false):
- Persistent fever, worsening cough, moderate pain
- Symptoms that concern you but aren't immediately life-threatening

MILD SYMPTOMS (emergency_trigger: false):
- Common cold, mild headache, minor aches
- Routine health questions

User: ${message}
Response:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    let responseData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        responseData = {
          severity: "MODERATE",
          reply: responseText,
          emergency_trigger: false,
        };
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      responseData = {
        severity: "MODERATE",
        reply: responseText,
        emergency_trigger: false,
      };
    }

    // Ensure all required fields
    const finalResponse = {
      severity: responseData.severity || "MODERATE",
      reply: responseData.reply || responseText,
      emergency_trigger: responseData.emergency_trigger || false,
    };

    res.json(finalResponse);
  } catch (error) {
    console.error("Chat error:", error);
    const msg = error?.message || "Something went wrong";
    res.status(500).json({ error: msg });
  }
};

// 🚨 Emergency contact function
export const getEmergencyContacts = async (req, res) => {
  try {
    const { severity, location } = req.body;

    // Mock emergency contacts - in real app, this would come from a database
    const emergencyContacts = {
      SEVERE: {
        message: "🚨 IMMEDIATE MEDICAL ATTENTION REQUIRED",
        contacts: [
          { name: "Emergency Services", number: "911", type: "emergency" },
          { name: "Local Hospital", number: "+1-555-0123", type: "hospital" },
          {
            name: "Poison Control",
            number: "+1-800-222-1222",
            type: "specialty",
          },
        ],
        actions: [
          "Call emergency services immediately",
          "Do not drive yourself to the hospital",
          "Have someone stay with you",
          "Prepare your medical information",
        ],
      },
      MODERATE: {
        message: "⚠️ Medical Attention Recommended",
        contacts: [
          { name: "Urgent Care", number: "+1-555-0456", type: "urgent_care" },
          {
            name: "Primary Care Physician",
            number: "+1-555-0789",
            type: "doctor",
          },
          { name: "Telemedicine", number: "+1-555-0321", type: "telehealth" },
        ],
        actions: [
          "Contact healthcare provider within 24 hours",
          "Monitor symptoms closely",
          "Rest and avoid strenuous activity",
        ],
      },
      MILD: {
        message: "ℹ️ Self-Care Recommended",
        contacts: [
          { name: "Pharmacy", number: "+1-555-0654", type: "pharmacy" },
          { name: "Nurse Line", number: "+1-555-0987", type: "advice" },
        ],
        actions: [
          "Try home remedies first",
          "Contact doctor if symptoms persist beyond 3 days",
          "Stay hydrated and rest",
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

// 📋 Chat Summary Function
export const summarizeChatHistory = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing GEMINI_API_KEY in environment." });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a summary prompt
    const summaryPrompt = `
You are a medical assistant helping clinic staff understand patient conversations.

Please analyze the following chat conversation between a patient and our chatbot, and provide a helpful summary.

Chat Messages:
${messages.map((msg) => `${msg.role}: ${msg.text}`).join("\n")}

Please provide a summary that includes:
1. Main symptoms or concerns mentioned by the patient
2. Key advice given by the chatbot
3. Overall health topics discussed
4. Any recommendations for follow-up

Keep the summary clear, professional, and helpful for medical staff. Use bullet points for easy reading.
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
