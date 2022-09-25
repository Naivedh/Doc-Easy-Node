const mongoose = require("mongoose");
const { Schema } = mongoose;

const meeting = new Schema(
  {
    userId: String,
    docterId: String,
    userEmail: String,
    docterEmail: String,
    status: Boolean,
    link: String,
    startTime: String,
    endTime: String,
    symptoms:String,
    description: String
  },
  { timestamps: true }
);

const meetings = mongoose.model("meetings", meeting);
module.exports = meetings;