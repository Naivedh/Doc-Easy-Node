const mongoose = require("mongoose");
const { Schema } = mongoose;

const meeting = new Schema(
  {
    userId: String,
    docterId: String,
    userEmail: String,
    docterEmail: String,
    userName: String,
    docterName: String,
    link: String,
  },
  { timestamps: true }
);

const meetings = mongoose.model("meetings", meeting);
module.exports = meetings;