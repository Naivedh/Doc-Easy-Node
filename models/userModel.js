const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema(
  {
    // userId: String,
    email: String,
    password: String,
    language: String,
    addresslong: Number,
    addresslat: Number,
    startTime: String,
    EndTime: String,
    diagnosislist: [
      {
        date: Date,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

const userModal = mongoose.model("userModal", user);
module.exports = userModal;
