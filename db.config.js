const mongoose = require("mongoose");

// Define the URL model
const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    unique: true,
  },
  short_url: {
    type: Number,
    unique: true,
  },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
