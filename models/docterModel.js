const mongoose = require("mongoose");
const { Schema } = mongoose;

const speciality = new Schema({
  specialityName:String
})
const docter = new Schema(
  {
    // docterId: String,
    email: String,
    password: String,
    addresslong: Number,
    addresslat: Number,
    language: String,
    degree: String,
    specialities:[speciality]
  },
  { timestamps: true }
);

const docterModel = mongoose.model("docterModal", docter);
module.exports = docterModel;