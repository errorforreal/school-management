const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Add School  -> POST http://localhost:${PORT}/addSchool`);
  console.log(`List Schools -> GET  http://localhost:${PORT}/listSchools?latitude=28.6&longitude=77.2`);
});
