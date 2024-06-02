require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const UrlDB = require("./db.config");
const cors = require("cors");
const isValidUrl = require("./isValid");
const asyncHandler = require("express-async-handler");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const data = {
//   freecodecamp: { original_url: "https://freecodecamp.org", short_url: 1 },
//   google: { original_url: "https://www.google.com", short_url: 2 },
//   forums: { original_url: "https://forum.freecodecamp.org/", short_url: 3 },
// };

// -------------
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// ---------

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Second API
app.post(
  "/api/shorturl",
  isValidUrl,
  asyncHandler(async (req, res) => {
    const url = req.body.url;

    // console.log(Number(url))
    try {
      const result = await UrlDB.findOne({ original_url: url });
      res.json({
        original_url: result.original_url,
        short_url: result.short_url,
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  })
);

// Third API
app.get("/api/shorturl/:url", (req, res) => {
  url = req.params.url;
  const convert = Number(url);

  try {
    for (const key in data) {
      const element = data[key];
      const element_short_url = data[key].short_url;

      if (element_short_url === convert) {
        return res.redirect(element.original_url);
        // return res.redirect('www.google.com')
      }
    }
    return res.status(404).json("No Match!");
  } catch (error) {
    console.log("error");
  }
});

app.post(
  "/add",
  asyncHandler(async (req, res) => {
    const original = req.body.original_url;
    const short = req.body.short_url;

    try {
      await UrlDB.create({
        original_url: original,
        short_url: short,
      });
      res.json(`${original} \n ${short}`);
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  })
);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
