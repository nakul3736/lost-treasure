const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/images", express.static(__dirname + "/public/images"));
app.use("/app", express.static(__dirname + "/public/app"));
app.use("/css", express.static(__dirname + "/public/css"));

app.get("/buried_treasure", (req, res) => {
  res.sendFile("./views/buried_treasure.html", {
    root: __dirname,
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).sendFile("./views/404.html", { root: __dirname });
});
