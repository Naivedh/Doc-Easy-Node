const express = require("express");


const docterRouter = express.Router();

const { generateHash, compareHash } = require("../utils/hash");

const { verfiyTokenAndExtractInfo, generateToken } = require("../utils/token");
const { checkUser } = require("../utils/checkUser");
const userModel = require("../models/userModel");
const docterModal = require("../models/docterModel");

//all Tutors
docterRouter.get("/docter", async (req, res) => {
  try {
    const data = await docterModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//one Tutor
docterRouter.get("/docter/:_id", async (req, res) => {
  try {
    const token = req.cookies["byf-session-config"];
    verfiyTokenAndExtractInfo(token)
    const data = await docterModel.find({ _id: req.params._id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//signUp (add Tutor)
docterRouter.post("/docterSignUp", async (req, res) => {
  try {
  const docter = await docterModel.find({ email: req.body.email });

  const user = await userModel.find({ email: req.body.email });

  if (docter.length !== 0 || user.length !== 0) {
    return res.status(500).json({ message: "Email already taken" });
  }

  // const { workingHourStart, workingHourEnd } = req.body;

  // if (workingHourStart >= workingHourEnd) {
  //   throw { message: 'Please select proper working hours' }
  // }
  
    // const tutorId = uuidv4();  

    const data = new docterModel({
                ...req.body,
                // _id:tutorId,
                password: await generateHash(req.body.password),
              });
          await data.save();
          res.status(200).json({ message: "Docter added" });
  } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
  }
});


module.exports = docterRouter;
