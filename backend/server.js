const express = require("express");
const { initialiseDB } = require("./db/init");
const { initialiseRouter } = require("./routers/init");
const app = express();
const PORT = process.env.EXPRESS_PORT || 5001;

initialiseDB();
initialiseRouter(app);

app.get("/", (req, res) => {
  res.send("Express server is running!");
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});