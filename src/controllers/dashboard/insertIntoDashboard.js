

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const insertRow = async (req, res) => {
  try {
    // const { id } = req.params; // Get ID from URL params
    // const data = req.body; // Get user email from request body
    const {email,formData} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    console.log(user.id)
    console.log(formData)
    const savedJob = await 
      sequelize.query('INSERT INTO "dashboards"  ("userId","rowData","createdAt","updatedAt") values (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [user.id,JSON.stringify(formData)],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json({success:true});
  } catch (error) {
    console.error("Error inserting column job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertRow};