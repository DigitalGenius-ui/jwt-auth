import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "./DB/Connect.js";
import { User } from "./DB/UserSchema.js";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
} from "./Tokens/createTokens.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);
connectDb();

app.get("/", (req, res) => {
  res.json("Hello world");
});

//register
app.post("/api/register", async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//register
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    name: req.body.name,
    password: req.body.password,
  });

  // if user exist in the database
  if (user) {
    // generate new access and refresh tokens 
    const accessToken = createAccessToken(user._id);
    res.status(200).json({
      name: user.name,
      accessToken,
    });
  } else {
    res.status(500).json({ message: "email or password is wrong!!" });
  }
});

// verify if the token matches
const verify = (req, res, next) => {
  const isValid = req.headers.authorization;
  if (isValid) {
    const token = isValid.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Token is not valid!!" });
      }

      req.userId = user.id;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};


// delete singleUser
app.delete("/api/delete/:id", verify, (req, res) => {
  if (req.userId === req.params.id) {
    res.status(200).json({ message: "User has been deleted!!" });
  } else {
    res
      .status(403)
      .json({ message: "You are not allow to delete this user!!" });
  }
});

app.listen("5000", () => {
  console.log("Server is connected to port 3000");
});
