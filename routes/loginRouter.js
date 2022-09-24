const { response } = require("express");
const express = require("express");
const userModal = require("../models/userModel");
const docterModal = require("../models/docterModel");

const loginRouter = express.Router();

const { compareHash } = require("../utils/hash");
const { generateToken, verfiyTokenAndExtractInfo } = require("../utils/token");


loginRouter.get('/logout', async (req, res) => {
  try {
    res.clearCookie('byf-session-config');
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

loginRouter.post('/check', async (req, res) => {
  try {
    const cookieData = verfiyTokenAndExtractInfo(req.cookies["byf-session-config"], "*")
    res.json(cookieData);
  } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
  }
});

loginRouter.post('/login', async (req, res) => {
    try {
        const userData = await userModal.find({
          email: req.body.email,
        });

        const docterData = await docterModal.find({
            email: req.body.email,
        });

        const isDocter = Boolean(docterData.length);

        const data = docterData.length ? docterData : userData;

        if (data.length) {
          const result = await compareHash(req.body.password, data[0].password);
          if (result) {
            const { _id, email } = data[0];
            const cookieData = { _id, email, isDocter };
            res.cookie("byf-session-config", generateToken(cookieData), {
              expiresIn: new Date(Date.now() + 18000000),
              maxAge: 18000000,
              httpOnly: true  
            });
            const responseData = { message: "Success", isDocter, _id };
            if (isDocter) {
                const docterData = data[0];
                delete docterData['password'];
                // console.log({ tutorData });
                responseData.docter = docterData;
            }
            res.json(responseData);
          } else {
            throw { message: "Password mismatch" }
          }
        } else {
          throw { message: "User not found" }
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
      }
});

module.exports = loginRouter;

