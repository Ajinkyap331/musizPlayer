const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv/config");
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("Hello World....");
});

// user Authentication route
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Artist Routes
const artistRoutes = require("./routes/artist");
app.use("/api/artist/", artistRoutes);

// Albums Routes
const albumRoutes = require("./routes/albums");
app.use("/api/albums/", albumRoutes);

// Songs Routes
const songRoutes = require("./routes/songs");
app.use("/api/songs/", songRoutes);

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });

mongoose.connection
  .once("open", () => console.log("Connected"))
  .on("error", (e) => console.log(`ERROR: ${e}`));

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
