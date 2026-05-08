const db = require("../config/db");

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /addSchool
async function addSchool(req, res) {
  const { name, address, latitude, longitude } = req.body;

  try {
    const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [name, address, latitude, longitude]);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });
  } catch (error) {
    console.error("Error adding school:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the school"
    });
  }
}

// GET /listSchools
async function listSchools(req, res) {
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;

  try {
    const [rows] = await db.execute("SELECT * FROM schools");

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found",
        data: []
      });
    }

    // Add distance to each school and sort by nearest first
    const schoolsWithDistance = rows.map((school) => {
      const distance = getDistanceKm(userLat, userLon, school.latitude, school.longitude);
      return {
        ...school,
        distance_km: parseFloat(distance.toFixed(2))
      };
    });

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      total: schoolsWithDistance.length,
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error("Error fetching schools:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching schools"
    });
  }
}

module.exports = { addSchool, listSchools };
