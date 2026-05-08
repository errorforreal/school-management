// Simple validation middleware for addSchool
function validateAddSchool(req, res, next) {
  const { name, address, latitude, longitude } = req.body;

  // Check all fields exist and are not empty
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, address, latitude, longitude"
    });
  }

  // Check name and address are strings and not just whitespace
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Name must be a non-empty string" });
  }

  if (typeof address !== "string" || address.trim() === "") {
    return res.status(400).json({ success: false, message: "Address must be a non-empty string" });
  }

  // Check latitude and longitude are valid numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({ success: false, message: "Latitude must be a number between -90 and 90" });
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ success: false, message: "Longitude must be a number between -180 and 180" });
  }

  // Attach sanitized values to body
  req.body.name = name.trim();
  req.body.address = address.trim();
  req.body.latitude = lat;
  req.body.longitude = lon;

  next();
}

// Simple validation middleware for listSchools query params
function validateListSchools(req, res, next) {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "Query parameters latitude and longitude are required"
    });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({ success: false, message: "Latitude must be a number between -90 and 90" });
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ success: false, message: "Longitude must be a number between -180 and 180" });
  }

  req.query.latitude = lat;
  req.query.longitude = lon;

  next();
}

module.exports = { validateAddSchool, validateListSchools };
