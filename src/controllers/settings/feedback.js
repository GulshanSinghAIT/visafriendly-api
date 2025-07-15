// controllers/settings/feedback.js
const Feedback = require("../../db/models/feedback");

const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback cannot be empty",
      });
    }

    const newFeedback = await Feedback.create({
      feedback: feedback.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        id: newFeedback.id,
        feedback: newFeedback.feedback,
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
};
