import Feedback from "../model/feedbackModel.js";

// 📝 Submit feedback (the "ahahaha I found something" button)
export const submitFeedback = async (req, res) => {
  try {
    const { message, type } = req.body;
    const userId = req.user?._id; // optional, if user is logged in

    // Just create the feedback, that's it!
    const newFeedback = new Feedback({
      userId,
      message,
      type: type || "suggestion", // default to suggestion if not specified
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Thanks for your feedback! We'll look into it 😊",
      feedback: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Oops! Couldn't save your feedback",
      error: error.message,
    });
  }
};

// 📊 Get all feedback (for you to see what people are saying)
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name email") // optional, to see who sent it
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: "Error getting feedback",
      error: error.message,
    });
  }
};

// 🐛 Get feedback by type (just bugs, just suggestions, etc.)
export const getFeedbackByType = async (req, res) => {
  try {
    const { type } = req.params;

    const feedback = await Feedback.find({ type })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: "Error getting feedback",
      error: error.message,
    });
  }
};

// ❌ Delete feedback (in case someone spams)
export const deleteFeedback = async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting feedback",
      error: error.message,
    });
  }
};
