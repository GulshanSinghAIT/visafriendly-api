// controllers/resume/resumeController.js
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const pdfParse = require("pdf-parse");
const User = require("../../db/models/user");
const Resume = require("../../db/models/resume");
const { Op } = require("sequelize");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../../config/firebase");
const sequelize = require("../../config/database");
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer configuration
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf"];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
}).single("resume");

// Get all resumes for a user
const getUserResumes = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resumes = await Resume.findAll({
      where: { userId: user.id },
      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      resumes: resumes.map((resume) => ({
        id: resume.id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        filePath: resume.filePath,
        isDefault: resume.isDefault,
        createdAt: resume.createdAt,
        skills: resume.skills || [],
      })),
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

// Upload a new resume
const uploadResume = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check resume limit
      const resumeCount = await Resume.count({ where: { userId: user.id } });
      if (resumeCount >= 5) {
        return res.status(400).json({
          success: false,
          message: "Maximum resume limit reached (5)",
        });
      }

      let extractedText = "";
      let skills = [];

      try {
        // Extract text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text;

        if (extractedText && extractedText.length > 0) {
          const prompt = `
        You are an expert resume parser that extracts **all skills** from resume text.
                
        Extract:
        - Technical skills (e.g., JavaScript, Kubernetes, DevOps, AWS, TensorFlow, APIs, Frontend, Backend, Full Stack,software development, etc.)
        - Non-technical skills (e.g., Leadership, Communication, Agile Coaching, Project Management)
        - Tools, platforms, frameworks, languages, methodologies, certifications
                
        🛠 Format the output as a **JSON array of strings**, like:
        ["JavaScript", "ReactJS", "Leadership", "CI/CD", "Project Management"]
                
        ✅ Guidelines:
        - Each skill should be **1–3 words only**
        - Do **not include duplicates** or meaningless phrases
        - Return **every valid skill** mentioned in the resume, not just from a predefined list
        - Maintain proper casing (e.g., "Google Cloud", not "google cloud")

        ❌ Do not include explanations or formatting like markdown. Just return a clean JSON array.

        Resume text:
        ${extractedText}
        `;


          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are a skill extraction assistant. Extract skills from resume text and return them as a JSON array of strings.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.3,
              max_tokens: 500,
            });

            let responseText = completion.choices[0].message.content.trim();

            // Clean markdown-style wrappers (```json ... ```)
            if (responseText.startsWith("```")) {
              responseText = responseText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
            }

            // Try parsing clean JSON
            try {
              skills = JSON.parse(responseText);
            } catch (jsonError) {
              // Fallback: manually extract entries
              skills = responseText
                .replace(/[\[\]\"]/g, "") // remove brackets and quotes
                .split(/[\n,]/)
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);
            }

          } catch (openaiError) {
            console.error("Error extracting skills with OpenAI:", openaiError);
          }
        }
      } catch (pdfError) {
        console.error("Error extracting text from PDF:", pdfError);
      }


      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = `resumes/${user.id}/${fileName}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Upload file
      const metadata = {
        contentType: "application/pdf",
      };

      // Upload to Firebase
      const snapshot = await uploadBytes(
        storageRef,
        req.file.buffer,
        metadata
      );

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Create resume record
      const isFirst = resumeCount === 0;
      const resume = await Resume.create({
        userId: user.id,
        fileName: req.file.originalname,
        filePath: downloadURL,
        fileSize: `${(req.file.size / 1024).toFixed(1)}KB`,
        extractedText: extractedText,
        skills: skills,
        isDefault: isFirst,
      });

      return res.status(201).json({
        success: true,
        message: "Resume uploaded successfully",
        resume: {
          id: resume.id,
          fileName: resume.fileName,
          fileSize: resume.fileSize,
          filePath: resume.filePath,
          isDefault: resume.isDefault,
          createdAt: resume.createdAt,
          skills: resume.skills || [],
        },
      });
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
      error: error.message,
    });
  }
};

// Delete a resume
const deleteResume = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resume = await Resume.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!resume) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    try {
      // First handle the default resume change if needed
      if (resume.isDefault) {
        const nextResume = await Resume.findOne({
          where: {
            userId: user.id,
            id: { [Op.ne]: id }, // Fixed operator usage
          },
          order: [["createdAt", "DESC"]],
        });

        if (nextResume) {
          await nextResume.update({ isDefault: true }, { transaction: t });
        }
      }

      // Then try to delete from Firebase Storage
      try {
        const fileUrl = new URL(resume.filePath);
        const filePath = decodeURIComponent(
          fileUrl.pathname.split("/o/")[1].split("?")[0]
        );
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
      } catch (storageError) {
        // Log the error but continue with database deletion
        console.error("Error deleting file from storage:", storageError);
      }

      // Finally delete from database
      await resume.destroy({ transaction: t, force: true });
      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    await t.rollback();
    console.error("Error deleting resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};

// Set default resume
const setDefaultResume = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { resumeId, email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // First, set all user's resumes to non-default
    await Resume.update(
      { isDefault: false },
      {
        where: { userId: user.id },
        transaction: t,
      }
    );

    // Then set the specified resume as default
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        userId: user.id,
      },
    });

    if (!resume) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await resume.update({ isDefault: true }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Default resume set successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error setting default resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set default resume",
      error: error.message,
    });
  }
};

module.exports = {
  getUserResumes,
  uploadResume,
  deleteResume,
  setDefaultResume,
};
