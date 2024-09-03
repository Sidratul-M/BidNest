const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
} = require("../controller/adminController");

// Login an admin
router.post("/login", loginAdmin);

// Add a staff
router.post("/add", addStaff);

// Get all staff
router.get("/", getAllStaff);

// Get a specific staff member by ID
router.get("/:id", getStaffById);

// Update a staff member by ID
router.put("/:id", updateStaff);

// Update staff status by ID
router.put("/update-status/:id", updatedStatus);

// Delete a staff member by ID
router.delete("/:id", deleteStaff);

module.exports = router;
