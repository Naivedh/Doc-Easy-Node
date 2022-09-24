const express = require("express");
const userModal = require("../models/userModel");
const docterModal = require("../models/docterModel");

const userRouter = express.Router();

const { generateHash, compareHash } = require("../utils/hash");
const { verfiyTokenAndExtractInfo, generateToken } = require("../utils/token");

//user get data
userRouter.get("/user/:_id", async (req, res) => {
  try {
    const data = await userModel.find({ _id: req.params._id });
    delete data["password"];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// signup
userRouter.post("/userSignUp", async (req, res) => {
  const docter = await docterModel.find({ email: req.body.email });

  const user = await userModal.find({ email: req.body.email });

  if (docter.length !== 0 || user.length !== 0) {
    return res.status(500).json({ message: "Email already taken" });
  }

  const data = new userModel({
    ...req.body,
    password: await generateHash(req.body.password),
  });

  try {
    await data.save();
    res.status(200).json({ message: "User added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = userRouter;
