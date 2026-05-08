const express = require("express");
const router = express.Router();
const { addSchool, listSchools } = require("../controllers/schoolController");
const { validateAddSchool, validateListSchools } = require("../middlewares/validate");

// POST /addSchool - Add a new school
router.post("/addSchool", validateAddSchool, addSchool);

// GET /listSchools - Get all schools sorted by proximity
router.get("/listSchools", validateListSchools, listSchools);

module.exports = router;
