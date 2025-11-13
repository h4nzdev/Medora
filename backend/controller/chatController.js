import Chat from "../model/chatModel.js";
import ChatCredit from "../model/chatCreditModel.js";

// Save a new chat
export const saveChat = async (req, res) => {
  try {
    const { patientId, clinicId, role, message } = req.body;
    const newChat = new Chat({ patientId, clinicId, role, message });
    await newChat.save();
    req.io.emit("message_sent");
    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all chats for a single patient (populated)
export const getChatsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const chats = await Chat.find({ patientId })
      .sort({ timestamp: 1 })
      .populate("patientId", "name email"); // only get name & email from Patient
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all chats from all patients (populated)
export const getAllPatientChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ timestamp: 1 })
      .populate("patientId", "name email"); // populate patient info
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all chats from patients in a specific clinic (populated)
export const getChatsByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const chats = await Chat.find({ clinicId })
      .sort({ timestamp: 1 })
      .populate("patientId", "name email"); // populate patient info
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteChatsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Delete all chats belonging to this patientId
    const result = await Chat.deleteMany({ patientId });
    req.io.emit("message_sent");

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} chat(s) for patient ${patientId}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get or create chat credits for a patient
export const getChatCredits = async (req, res) => {
  try {
    const { patientId } = req.params;

    let chatCredit = await ChatCredit.findOne({ patientId });

    if (!chatCredit) {
      // Create new credit record for patient
      chatCredit = new ChatCredit({
        patientId,
        dailyCredits: 0,
        lastResetDate: new Date(),
      });
      await chatCredit.save();
    } else if (chatCredit.shouldResetCredits()) {
      // Reset credits if it's a new day
      await chatCredit.resetDailyCredits();
    }

    res.json({
      success: true,
      credits: chatCredit.dailyCredits,
      maxCredits: 5,
      canChat: chatCredit.dailyCredits < 5,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Increment chat credits (called after successful chat)
export const incrementChatCredits = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res
        .status(400)
        .json({ success: false, error: "Patient ID is required" });
    }

    let chatCredit = await ChatCredit.findOne({ patientId });

    if (!chatCredit) {
      // Create new credit record
      chatCredit = new ChatCredit({
        patientId,
        dailyCredits: 0,
        lastResetDate: new Date(),
      });
    } else if (chatCredit.shouldResetCredits()) {
      // Reset credits if it's a new day
      await chatCredit.resetDailyCredits();
    }

    // Increment credits if under limit
    if (chatCredit.dailyCredits < 5) {
      await chatCredit.incrementCredits();
    }

    res.json({
      success: true,
      credits: chatCredit.dailyCredits,
      maxCredits: 5,
      canChat: chatCredit.dailyCredits < 5,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
