import SystemUpdate from "../model/systemUpdates.js";

// Create system update
export const createSystemUpdate = async (req, res) => {
  try {
    const systemUpdate = new SystemUpdate({
      ...req.body,
      createdBy: "Admin",
    });

    await systemUpdate.save();

    res.status(201).json({
      message: "System update created successfully",
      update: systemUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating system update",
      error: error.message,
    });
  }
};

// Get all system updates
export const getAllSystemUpdates = async (req, res) => {
  try {
    const updates = await SystemUpdate.find().sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching system updates",
      error: error.message,
    });
  }
};

// Get system update by ID
export const getSystemUpdateById = async (req, res) => {
  try {
    const update = await SystemUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: "System update not found" });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching system update",
      error: error.message,
    });
  }
};

// Update system update
export const updateSystemUpdate = async (req, res) => {
  try {
    const update = await SystemUpdate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!update) {
      return res.status(404).json({ message: "System update not found" });
    }
    res.status(200).json({
      message: "System update updated successfully",
      update: update,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating system update",
      error: error.message,
    });
  }
};

// Delete system update
export const deleteSystemUpdate = async (req, res) => {
  try {
    const deleted = await SystemUpdate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "System update not found" });
    }
    res.status(200).json({ message: "System update deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting system update",
      error: error.message,
    });
  }
};

// Publish system update
export const publishSystemUpdate = async (req, res) => {
  try {
    const update = await SystemUpdate.findByIdAndUpdate(
      req.params.id,
      {
        status: "published",
        publishedAt: new Date(),
      },
      { new: true }
    );
    if (!update) {
      return res.status(404).json({ message: "System update not found" });
    }
    res.status(200).json({
      message: "System update published successfully",
      update: update,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error publishing system update",
      error: error.message,
    });
  }
};
