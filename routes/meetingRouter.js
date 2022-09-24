const express = require("express");
const meetingModal = require("../models/meetingModel");
const userModel = require("../models/userModel");
const docterModel = require("../models/docterModel");
const { checkUser } = require("../utils/checkUser");
const { verfiyTokenAndExtractInfo } = require("../utils/token");
const meetingRouter = express.Router();
const nodemailer = require("nodemailer");

const requestPromise = require("request-promise");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
    clientId: process.env.MAILER_ID,
    clientSecret: process.env.MAILER_SECRET
  }
});

const payload = {
  iss: process.env.ZOOM_API, //your API KEY
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

//req meeting is time limit
meetingRouter.post("/requestMeeting",async(req,res)=>{
  doctors=[]

  //find docters


  docters.forEach((docter)=>{
    transporter.sendMail(
      {
        from: "doceasy20@gmail.com",
        to: docter.email,
        subject: 'Doc-Easy',
        text: "Please login to the Doc-Easy App",
        html: "<button style='color:blue; padding: 2px'>Go to APP<button>",
        auth:{
          user:"doceasy20@gmail.com",
          refreshToken:process.env.MAILER_REFRESH_TOKEN,
          accessToken: process.env.MAILER_ACCESS_TOKEN
        }
      } 
      , 
        function(err, data) {
          if (err) {
            console.log("Error " + err);
          } else {
            console.log("Email sent successfully");
          }
        }
      )
  })
  
});

// finalized meeting route
///ISSUE CHECK CODE and based on doc
meetingRouter.post("/meeting", async (req, res) => {

  //zoom
  email = "naivedh.170410107104@gmail.com"; // your zoom developer email account
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Zoom Meeting", //meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  let link = "Here is the link: ";
  const zoomResponse = await requestPromise(options)
  link += zoomResponse.start_url;

  try {
    const { isDocter, _id: userId } = verfiyTokenAndExtractInfo(req.headers["easydoc-session-config"], "*");
    checkUser(isDocter, false);
    const { docterId } = req.body;

    const data = await meetingModal.find({ docterId, userId })
    
    const docter = await docterModel.find({ _id: docterId });
    const user = await userModel.find({ _id: userId });
    
    let userMailOptions = {
      from: "doceasy20@gmail.com",
      to: "naivedhshah1999@gmail.com",
      subject: 'Doc-Easy',
      text: link,
      auth:{
        user:"doceasy20@gmail.com",
        refreshToken:process.env.MAILER_REFRESH_TOKEN,
        accessToken: process.env.MAILER_ACCESS_TOKEN
      }
    };
    let docterMailOptions = {
      from: "doceasy20@gmail.com",
      to: "naivedhshah1999@gmail.com",
      subject: 'Doc-Easy',
      text:  link,
      auth:{
        user:"doceasy20@gmail.com",
        refreshToken:process.env.MAILER_REFRESH_TOKEN,
        accessToken: process.env.MAILER_ACCESS_TOKEN
      }
    };
    let docterName = docter.docterName;
    let userName = user.userName;
    
    const newData = new meetingModal({ ...req.body, docterId, userId, userName, docterName, link });
    try {
      const dataToSave = await newData.save();

      transporter.sendMail(userMailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });

      transporter.sendMail(docterMailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      
      });

      res.status(200).json(dataToSave);
      

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//getall for a User
meetingRouter.get("/meetings/user/:_id", async (req, res) => {
  try {
    const data = await meetingModal.find({
      userId: req.params._id
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getall for a Docter
meetingRouter.get("/meetings/docter/:_id", async (req, res) => {
  try {
    const data = await meetingModal.find({
      docterId: req.params._id
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = meetingRouter;
