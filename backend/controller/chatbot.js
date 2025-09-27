import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 🧩 Symptom-checker Prompt Template
const systemPrompt = `
You are Medora AI, a helpful virtual health assistant.
Your job is to give quick, beginner-friendly advice to patients who describe symptoms.
Always be clear, supportive, and professional.

✅ Rules:
- If the symptoms are mild (like cough, headache, cold), suggest simple home remedies (rest, hydration, healthy food, over-the-counter meds).
- If the symptoms are serious (chest pain, high fever, difficulty breathing, severe pain), strongly advise the user to seek immediate medical help or visit a clinic/ER.
- Do NOT give complex medical jargon. Keep it simple and friendly.
- Remind the user that this is just advice, not a replacement for a doctor’s consultation.
- Keep answers short (3–5 sentences).

💡 Example:
User: "I have a cough"
Reply: "I’m sorry you’re not feeling well. For a cough, drink warm fluids, rest, and consider honey tea. If it lasts more than a week, or if you have fever or trouble breathing, please visit a doctor."
`;

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment." });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Combine system prompt + user question
    const result = await model.generateContent([systemPrompt, message]);

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chat error:", error);
    const msg = error?.message || "Something went wrong";
    res.status(500).json({ error: msg });
  }
};

// 📋 Chat Summary Function
export const summarizeChatHistory = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment." });
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
${messages.map(msg => `${msg.role}: ${msg.text}`).join('\n')}

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
      messageCount: messages.length 
    });
  } catch (error) {
    console.error("Summary error:", error);
    const msg = error?.message || "Something went wrong while summarizing";
    res.status(500).json({ error: msg });
  }
};
