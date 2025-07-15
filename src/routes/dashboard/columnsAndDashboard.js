const express = require("express");
const router = express.Router();

const insertColumnController = require("../../controllers/dashboard/insertColumn")
const getColumnController = require("../../controllers/dashboard/getVisibleColumns")
const updateVisibilityController = require("../../controllers/dashboard/updateVisibleColumns")
const getRowsController = require("../../controllers/dashboard/getDashboardRows")
const insertRowController = require("../../controllers/dashboard/insertIntoDashboard")
const updateTableCellController = require("../../controllers/dashboard/updateTheDashBoard")
const deleteRowsController = require("../../controllers/dashboard/deleteFromDashboard")
const deletColController = require("../../controllers/dashboard/deletColumn")

router.post("/columns",insertColumnController.insertextraColumn)
router.get("/columns",getColumnController.getAllVisibleColumns)
router.put("/columns",updateVisibilityController.updateColumnVisibility)
router.delete("/columns/:id",deletColController.deleteColumn)
router.get("/rows",getRowsController.getAllRows)
router.post("/rows",insertRowController.insertRow)
router.put("/rows/:id",updateTableCellController.updateTableCell)
router.delete("/rows",deleteRowsController.deleteRows)


module.exports = router