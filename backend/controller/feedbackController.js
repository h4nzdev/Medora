import Feedback from "../model/feedbackModel.js";

// 📝 Submit feedback (the "ahahaha I found something" button)
// 📝 Submit feedback (the "ahahaha I found something" button)
export const submitFeedback = async (req, res) => {
  try {
    const { message, type } = req.body;
    const userId = req.session.user?._id;
    const userRole = req.session.user?.role; // Get the user's role from session

    // Determine userType based on the user's role
    let userType;
    if (userRole === "Client") {
      userType = "Client";
    } else if (userRole === "Clinic") {
      userType = "Clinic";
    } else {
      userType = null; // For anonymous or other roles
    }

    // Just create the feedback, that's it!
    const newFeedback = new Feedback({
      userId,
      userType, // Use the determined userType
      message,
      type: type || "suggestion", // default to suggestion if not specified
      status: "pending", // initial status
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Thanks for your feedback! We'll look into it 😊",
      feedback: {
        _id: newFeedback._id,
        message: newFeedback.message,
        type: newFeedback.type,
        createdAt: newFeedback.createdAt,
        status: newFeedback.status,
      },
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
    // Double security check - only admins can access all feedback
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const feedback = await Feedback.find()
      .populate("userId", "name email")
      .populate("adminResponse.respondedBy", "name email")
      .populate("reactedBy", "name email")
      .sort({ createdAt: -1 });

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
    // Double security check - only admins can filter feedback
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const { type } = req.params;

    const feedback = await Feedback.find({ type })
      .populate("userId", "name email")
      .populate("adminResponse.respondedBy", "name email")
      .populate("reactedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: "Error getting feedback",
      error: error.message,
    });
  }
};

// 💬 Add admin response to feedback
export const addAdminResponse = async (req, res) => {
  try {
    // Double security check - only admins can respond
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const { id } = req.params;
    const { message } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.adminResponse = {
      message,
      respondedAt: new Date(),
      respondedBy: req.session.user._id, // CHANGED: req.user → req.session.user
    };

    feedback.status = "reviewed"; // Update status when admin responds

    await feedback.save();

    // Populate the response for better output
    await feedback.populate("adminResponse.respondedBy", "name email");

    res.status(200).json({
      message: "Response added successfully",
      feedback: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding response",
      error: error.message,
    });
  }
};

// 👍👎 Add admin reaction (thumbs up/down)
export const addAdminReaction = async (req, res) => {
  try {
    // Double security check - only admins can react
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const { id } = req.params;
    const { reaction } = req.body; // "thumbs_up" or "thumbs_down"

    if (!["thumbs_up", "thumbs_down"].includes(reaction)) {
      return res.status(400).json({
        message: "Invalid reaction. Use 'thumbs_up' or 'thumbs_down'",
      });
    }

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.adminReaction = reaction;
    feedback.reactedAt = new Date();
    feedback.reactedBy = req.session.user._id; // CHANGED: req.user → req.session.user

    await feedback.save();

    // Populate the reactor for better output
    await feedback.populate("reactedBy", "name email");

    res.status(200).json({
      message: "Reaction added successfully",
      feedback: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding reaction",
      error: error.message,
    });
  }
};

// 🔄 Update feedback status
export const updateFeedbackStatus = async (req, res) => {
  try {
    // Double security check - only admins can update status
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved", "closed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use: pending, reviewed, resolved, or closed",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      feedback: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};

// ❌ Delete feedback (in case someone spams)
export const deleteFeedback = async (req, res) => {
  try {
    // Double security check - only admins can delete
    if (req.session.user?.role !== "Admin") {
      // CHANGED: req.user → req.session.user
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

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

// 👤 Get user's own feedback (for regular users to see their submissions)
export const getMyFeedback = async (req, res) => {
  try {
    const userId = req.session.user?._id; // CHANGED: req.user → req.session.user

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const feedback = await Feedback.find({ userId })
      .populate("adminResponse.respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: "Error getting your feedback",
      error: error.message,
    });
  }
};
