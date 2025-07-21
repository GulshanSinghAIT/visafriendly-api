const express = require("express");
const router = express.Router();

const insertPointsTableController = require("../../controllers/referals/insertPointsTable")
const updateRefsAndPointsController = require("../../controllers/referals/updatePointsAndRefs")
const top5Controller = require("../../controllers/referals/getTop5")
const getTransController = require("../../controllers/referals/getAllTransactions")
const insertTransController = require("../../controllers/referals/insertTransactions")
const getPointsController = require("../../controllers/referals/getPointsAndRefs")
const getUserReferralCodeController = require("../../controllers/referals/getUserReferralCode")

router.get("/refAndPoints",getPointsController.getPointsAndRefs)
router.get("/transactions",getTransController.getAllTransactions)
router.get("/top5ReferPoints",top5Controller.getTop5)
router.get("/referralCode",getUserReferralCodeController.getUserReferralCode)
router.post("/transactions/:id",insertTransController.insertTransaction)
router.post("/refAndPoints",insertPointsTableController.insertPointsTable)
router.put("/refAndPoints",updateRefsAndPointsController.updatePointsAndRefs)
router.put("/refAndPoints/:points",updateRefsAndPointsController.updatePoints)

// router.update("/totalPoints/:id")


module.exports = router