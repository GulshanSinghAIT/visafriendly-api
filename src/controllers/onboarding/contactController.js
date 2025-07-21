// Using separate creation without transaction
const User = require("../../db/models/user.js");
const Address = require("../../db/models/address.js");
const { sendEmail } = require("../../emailservice/emailService.js");
const { ensureDefaultPlan } = require("../../utils/databaseInit.js");
const { generateReferralCode, validateReferralCode } = require("../../utils/referralCodeGenerator.js");

// Create a new user with address (created separately)
const contactController = async (req, res) => {
  try {
    console.log('\n=== Contact Controller Debug ===');
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    const {
      firstName,
      lastName,
      email,
      mobile,
      city,
      state,
      Summary,
      password,
      referralSource,
      referralCode,
    } = req.body;

    // Enhanced validation with specific field checks
    const requiredFields = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      password: password,
      referralSource: referralSource
    };

    const missingFields = [];
    const emptyFields = [];

    // Check each required field
    Object.entries(requiredFields).forEach(([fieldName, fieldValue]) => {
      if (fieldValue === undefined || fieldValue === null) {
        missingFields.push(fieldName);
      } else if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
        emptyFields.push(fieldName);
      }
    });

    // Validation error response
    if (missingFields.length > 0 || emptyFields.length > 0) {
      const errorMessage = {
        error: "Validation failed",
        message: "Missing or empty required fields",
        missingFields: missingFields,
        emptyFields: emptyFields,
        requiredFields: Object.keys(requiredFields),
        receivedFields: Object.keys(req.body),
        fieldDetails: {
          firstName: firstName ? `"${firstName}"` : 'MISSING',
          lastName: lastName ? `"${lastName}"` : 'MISSING',
          email: email ? `"${email}"` : 'MISSING',
          mobile: mobile ? `"${mobile}"` : 'MISSING',
          password: password ? 'PROVIDED' : 'MISSING',
          referralSource: referralSource ? `"${referralSource}"` : 'MISSING'
        }
      };
      
      console.log('Validation Error:', JSON.stringify(errorMessage, null, 2));
      return res.status(400).json(errorMessage);
    }

    // Enhanced password extraction with validation
    let passwordString;
    if (typeof password === 'object' && password !== null) {
      if (password.password) {
        passwordString = password.password;
      } else {
        console.log('Password object missing password property:', password);
        return res.status(400).json({ 
          error: "Invalid password format",
          message: "Password object must contain a 'password' property",
          received: typeof password
        });
      }
    } else if (typeof password === 'string') {
      passwordString = password;
    } else {
      return res.status(400).json({ 
        error: "Invalid password type",
        message: "Password must be a string or object with password property",
        received: typeof password
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address",
        received: email
      });
    }

    // Mobile number validation (basic)
    const mobileStr = String(mobile);
    if (mobileStr.length < 10 || mobileStr.length > 15) {
      return res.status(400).json({
        error: "Invalid mobile number",
        message: "Mobile number must be between 10-15 digits",
        received: mobile,
        length: mobileStr.length
      });
    }

    // Ensure default plan exists before creating user
    try {
      await ensureDefaultPlan();
    } catch (planError) {
      console.error('Error ensuring default plan:', planError);
      return res.status(500).json({
        error: "Database setup error",
        message: "Failed to ensure default plan exists",
        details: planError.message
      });
    }

    console.log('Creating user with validated data:', {
      firstName,
      lastName,
      email,
      mobileNumber: mobile,
      passwordHash: passwordString ? '***HIDDEN***' : undefined,
      role: 'user',
      currentPlanId: 1,
      referralSource,
      Summary: Summary || null,
      city: city || null,
      state: state || null
    });

    // Handle referral code validation and referral tracking
    let referredBy = null;
    if (referralCode && referralCode.trim()) {
      const referringUser = await validateReferralCode(referralCode.trim());
      if (referringUser) {
        referredBy = referringUser.id;
        console.log('Valid referral code found:', { referralCode, referringUserId: referringUser.id });
      } else {
        console.log('Invalid referral code provided:', referralCode);
      }
    }

    // Create the User record
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      passwordHash: passwordString,
      email: email.trim().toLowerCase(),
      mobileNumber: String(mobile),
      role: 'user',
      currentPlanId: 1,
      referralSource: referralSource.trim(),
      referredBy: referredBy,
      Summary: Summary || null,
    });

    // Generate unique referral code for the new user
    const userReferralCode = await generateReferralCode(newUser.id);
    await newUser.update({ referralCode: userReferralCode });
    console.log('Generated referral code for new user:', { userId: newUser.id, referralCode: userReferralCode });

    // Award points to referring user if valid referral
    if (referredBy) {
      try {
        const { sequelize } = require("../../db/models/index");
        await sequelize.query(
          'UPDATE "pointsTables" SET "referals_accepted" = "referals_accepted" + 1, "total_points" = "total_points" + 100, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = ?',
          {
            replacements: [referredBy],
            type: sequelize.QueryTypes.UPDATE,
          }
        );
        console.log('Awarded 100 points to referring user:', { referringUserId: referredBy });
      } catch (error) {
        console.error('Error awarding points to referring user:', error);
      }
    }

    // Create points table entry for new user
    try {
      const { sequelize } = require("../../db/models/index");
      await sequelize.query(
        'INSERT INTO "pointsTables" ("referals_accepted","total_points","userId","createdAt","updatedAt") values (0,0,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
        {
          replacements: [newUser.id],
          type: sequelize.QueryTypes.INSERT,
        }
      );
      console.log('Created points table entry for new user:', { userId: newUser.id });
    } catch (error) {
      console.error('Error creating points table entry:', error);
    }

    console.log('User created successfully:', { id: newUser.id, email: newUser.email });

    // Create Address record separately (only if city or state provided)
    let newAddress = null;
    if (city || state) {
      newAddress = await Address.create({
        city: city || null,
        state: state || null,
        userId: newUser.id,
      });
      console.log('Address created successfully:', { id: newAddress.id, userId: newAddress.userId });
    } else {
      console.log('No address data provided, skipping address creation');
    }

    // Attach address to user data if created
    if (newAddress) {
      newUser.dataValues.address = newAddress;
    }

    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Our App!",
      text: `Hi ${firstName}, thanks for signing up!`, // Plain text fallback
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f4f8;">
            <tr>
              <td align="center" style="padding: 20px 10px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1); overflow: hidden;">
                  
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        🎉 Welcome to VisaFriendly!
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px; opacity: 0.9;">
                        Your journey to H1B success starts here!
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #1e40af; font-size: 24px; font-weight: 600;">
                        Hi ${firstName}! 👋
                      </h2>
                      
                      <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        We're absolutely thrilled to have you join our community! You've just taken the first step towards finding your dream H1B-sponsored job.
                      </p>
                      
                      <!-- Feature highlights -->
                      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                          🚀 Here's what you can do next:
                        </h3>
                        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.7;">
                          <li style="margin-bottom: 8px;">
                            <strong style="color: #1e40af;">Explore your dashboard</strong> and set up your profile
                          </li>
                          <li style="margin-bottom: 8px;">
                            <strong style="color: #1e40af;">Maintain your streak</strong> by applying to jobs every day
                          </li>
                          <li style="margin-bottom: 8px;">
                            <strong style="color: #1e40af;">Discover opportunities</strong> - Find all H1B sponsored jobs in one place
                          </li>
                        </ul>
                      </div>
                      
                      <p style="margin: 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        Our platform is designed to make your job search efficient and successful. If you have any questions or need assistance, our support team is here to help!
                      </p>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="https://visafriendly.com" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                          Go to Dashboard →
                        </a>
                      </div>
                      
                      <!-- Stats or additional info -->
                      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          💼 <strong style="color: #1e40af;">10,000+</strong> H1B jobs • 
                          🏢 <strong style="color: #1e40af;">500+</strong> sponsor companies • 
                          ✅ <strong style="color: #1e40af;">95%</strong> success rate
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                        Need help? Reply to this email
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        © 2024 VisaFriendly. Made with ❤️ for international talent.
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
    

    // Final response
    console.log("Hogaya bhai")
    return res.status(201).json({
      message: "User created successfully and email sent",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in contactController:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = contactController;
