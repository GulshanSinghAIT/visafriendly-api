// notificationController.js
const UserNotification = require("../../db/models/userNotification");
const Notification = require("../../db/models/notification");

const updateNotificationPreference = async (req, res) => {
  try {
    const { email, type, title, enabled } = req.body;

    if (!email || !type || !title) {
      return res.status(400).json({
        success: false,
        message: "Email, type, and title are required",
      });
    }

    // First, get the notification
    const notification = await Notification.findOne({
      where: { type, title },
      attributes: ["id", "type", "title"],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Then, find or update the user's preference
    let userNotification = await UserNotification.findOne({
      where: {
        email,
        notificationId: notification.id,
      },
      attributes: ["id", "email", "notificationId", "enabled"],
    });

    if (userNotification) {
      // Update existing preference
      userNotification = await userNotification.update(
        { enabled },
        { returning: ["id", "email", "notificationId", "enabled"] }
      );
    } else {
      // Create new preference
      userNotification = await UserNotification.create(
        {
          email,
          notificationId: notification.id,
          enabled,
        },
        {
          returning: ["id", "email", "notificationId", "enabled"],
          fields: ["email", "notificationId", "enabled"],
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Notification preference updated successfully",
      data: {
        enabled: userNotification.enabled,
        type: notification.type,
        title: notification.title,
        notificationId: notification.id,
      },
    });
  } catch (error) {
    console.error("Error updating notification preference:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification preference",
      error: error.message,
    });
  }
};

const getUserNotificationPreferences = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userPreferences = await UserNotification.findAll({
      where: { email },
      attributes: ["enabled", "notificationId"], // Explicitly define attributes
      include: [
        {
          model: Notification,
          as: "notification",
          attributes: ["type", "title", "description"],
        },
      ],
    });

    const formattedPreferences = userPreferences.map((pref) => ({
      type: pref.notification.type,
      title: pref.notification.title,
      description: pref.notification.description,
      enabled: pref.enabled,
      notificationId: pref.notificationId,
    }));

    return res.status(200).json({
      success: true,
      preferences: formattedPreferences,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification preferences",
      error: error.message,
    });
  }
};

module.exports = {
  updateNotificationPreference,
  getUserNotificationPreferences,
};
