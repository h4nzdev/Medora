import Subscription from "../model/subscriptionModel.js";
import Clinic from "../model/clinicModel.js";

export const createSubscription = async (req, res) => {
  try {
    const { clinicId, plan, amount } = req.body;

    // Calculate end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const subscription = new Subscription({
      clinicId,
      plan,
      amount,
      endDate,
    });

    await subscription.save();

    await Clinic.findByIdAndUpdate(clinicId, {
      subscriptionPlan: plan,
      subscriptionStatus: subscription.status,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
      error: error.message,
    });
  }
};

// Get current active subscription for a clinic
export const getClinicSubscription = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const subscription = await Subscription.findOne({
      clinicId,
      status: "active",
      endDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription",
      error: error.message,
    });
  }
};

// Update subscription status
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Update subscription
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subscription",
      error: error.message,
    });
  }
};

// Get all subscriptions (for admin)
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("clinicId", "clinicName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
      error: error.message,
    });
  }
};
