// controllers/settingsController.js
const User = require("../../db/models/user");
const DeleteReasons = require("../../db/models/deleteReasons");
const { sequelize } = require("../../db/models/index");
const { sendEmail } = require("../../emailservice/emailService.js");

const deleteAccount = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { email, reason, category, additionalFeedback } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
      transaction: t,
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Store deletion reason if provided
    if (reason) {
      await DeleteReasons.create({
        userId: user.id,
        email: user.email,
        reason: reason,
        category: category || 'OTHER',
        additionalFeedback: additionalFeedback || null,
        deletedAt: new Date()
      }, { transaction: t });
    }

    // Explicit deletions if you want to ensure specific order or handle specific tables
    await Promise.all([
      // Delete all associated records
      sequelize.query('DELETE FROM "UserWorkSetting" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "UserSkill" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "UserOpenRole" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "UserJobType" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "UserEducation" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "Address" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "SocialProfile" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "Resume" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "JobAlert" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
      sequelize.query('DELETE FROM "UserWorkExperience" WHERE "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }),
    ]);

    // Finally delete the user
    await user.destroy({
      transaction: t,
      force: true,
    });

    await t.commit();
    await sendEmail({
      to: email,
      subject: "Account Deletion Confirmation - We're Sorry to See You Go",
      text: `Hi, your account has been successfully deleted. We're sorry to see you go!`, // Plain text fallback
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deletion Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f4f8;">
            <tr>
              <td align="center" style="padding: 20px 10px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(107, 114, 128, 0.1); overflow: hidden;">
                  
                <!-- Header with muted gradient -->
                
                  <tr>
                    <td style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Account Deletion Confirmed
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #d1d5db; font-size: 16px; opacity: 0.9;">
                        We're sorry to see you go
                      </p>
                    </td>
                  </tr>
                  
                <!-- Main content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        We've successfully processed your account deletion request. Your VisaFriendly account and all associated data have been permanently removed from our systems.
                      </p>
                      
                <!-- What happens next -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">
                          ⚠️ What this means:
                        </h3>
                        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.7;">
                          <li style="margin-bottom: 8px;">
                            Your profile and job applications have been <strong style="color: #92400e;">permanently deleted</strong>
                          </li>
                          <li style="margin-bottom: 8px;">
                            You will no longer receive job alerts or notifications from us
                          </li>
                          <li style="margin-bottom: 8px;">
                            All saved jobs and application history have been removed
                          </li>
                        </ul>
                      </div>
                      
                      <p style="margin: 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        We understand that everyone's journey is different, and we respect your decision. Thank you for being part of our community and trusting us with your job search.
                      </p>

                <!-- Feedback request -->
                      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                        <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                          💭 Help us improve
                        </p>
                        <p style="margin: 10px 0 0 0; color: #374151; font-size: 14px;">
                          If you have a moment, we'd love to hear why you decided to leave. Your feedback helps us serve our community better.
                        </p>
                      </div>

                <!-- CTA Buttons -->
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="mailto:support@visafriendly.com?subject=Account Deletion Feedback" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 0 10px 10px 0;">
                          Share Feedback
                        </a>
                        <a href="https://visafriendly.com/signup" style="display: inline-block; padding: 12px 24px; background-color: #6b7280; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 0 10px 10px 0;">
                          Changed Your Mind?
                        </a>
                      </div>
                    </td>
                  </tr>

                  
                  
                <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                        Questions? Contact us at support@visafriendly.com
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        © 2024 VisaFriendly. Thank you for being part of our journey.
                      </p>
                      
                      <!-- Social links -->
                      <div style="margin-top: 20px;">
                        <a href="#" style="display: inline-block; margin: 0 10px; color: #64748b; text-decoration: none; font-size: 12px;">
                          LinkedIn
                        </a>
                        <a href="#" style="display: inline-block; margin: 0 10px; color: #64748b; text-decoration: none; font-size: 12px;">
                          Twitter
                        </a>
                        <a href="#" style="display: inline-block; margin: 0 10px; color: #64748b; text-decoration: none; font-size: 12px;">
                          Blog
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    return res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully",
      deletedUserId: user.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const getDeleteReasons = async (req, res) => {
  try {
    const reasons = await DeleteReasons.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'email', 'reason', 'category', 'additionalFeedback', 'deletedAt', 'createdAt']
    });

    return res.status(200).json({
      success: true,
      data: reasons
    });
  } catch (error) {
    console.error("Error fetching delete reasons:", error);
    return res.status(500).json({
      message: "Error fetching delete reasons",
      error: error.message,
    });
  }
};

module.exports = {
  deleteAccount,
  getDeleteReasons,
  // ... other controller functions ...
};
