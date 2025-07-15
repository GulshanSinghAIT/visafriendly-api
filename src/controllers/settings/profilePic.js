// controllers/settings/profilePic.js
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const User = require("../../db/models/user");
const {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("../../config/firebase");

// Multer configuration
const multerStorage = multer.memoryStorage();
const multerUpload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
}).single("profilePicture");

const uploadProfilePicture = async (req, res) => {
  // Use multer upload as middleware
  multerUpload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: "File upload error: " + err.message,
        });
      } else if (err) {
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

      try {
        // Delete old profile picture if it exists
        if (user.profilePicture) {
          try {
            const oldFileUrl = new URL(user.profilePicture);
            const oldFilePath = decodeURIComponent(
              oldFileUrl.pathname.split("/o/")[1].split("?")[0]
            );
            const oldFileRef = ref(storage, oldFilePath);
            await deleteObject(oldFileRef);
          } catch (deleteError) {
            console.error("Error deleting old profile picture:", deleteError);
            // Continue with upload even if delete fails
          }
        }

        // Generate unique filename
        const fileExtension = req.file.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `profile-pictures/${user.id}/${fileName}`;

        // Create storage reference
        const storageRef = ref(storage, filePath);

        // Upload file
        const metadata = {
          contentType: req.file.mimetype,
        };

        // Upload to Firebase
        const snapshot = await uploadBytes(
          storageRef,
          req.file.buffer,
          metadata
        );

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update user's profile picture in database
        await user.update({ profilePicture: downloadURL });

        return res.status(200).json({
          success: true,
          message: "Profile picture uploaded successfully",
          profilePicture: downloadURL,
        });
      } catch (uploadError) {
        console.error("Error uploading to Firebase:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload file to storage",
          error: uploadError.message,
        });
      }
    } catch (error) {
      console.error("Error in profile picture upload:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process upload",
        error: error.message,
      });
    }
  });
};

module.exports = {
  uploadProfilePicture,
};
