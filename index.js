require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const loginRouter = require("./routes/loginRouter");
const userRouter = require("./routes/userRouter");
const docterRouter = require("./routes/docterRouter");
const meetingRouter = require("./routes/meetingRouter");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, { 
  autoIndex: true,
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
// app.use(cookieParser())
app.use("/authapi", loginRouter);
app.use("/doctorapi", docterRouter);
app.use("/userapi", userRouter);
app.use("/meetingapi", meetingRouter);

app.listen(8000, () => {
  console.log(`Server Started at ${8000}`);
});
