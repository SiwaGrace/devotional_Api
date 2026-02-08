const express = require("express");
require("dotenv").config({ quiet: true });

const devotionsRoutes = require("./routes/devotions");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// devotions route
app.use("/api", devotionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
