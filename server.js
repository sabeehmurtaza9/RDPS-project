const express = require("express");
const app = express();
const PORT = process.env.EXPRESS_PORT || 5001;

app.get("/", (req, res) => {
  res.send("Express server is running!");
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});