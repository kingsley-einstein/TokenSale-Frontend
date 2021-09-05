const express = require("express");
const path = require("path");

const app = express();
const port = parseInt(process.env.PORT || "5000");

app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(port, () => console.log(`App is running on port: ${port}`));
