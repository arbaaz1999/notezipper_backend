const bcrypt = require("bcryptjs/dist/bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      message: "User Registered Successfully",
      error: null,
    });
  } else {
    res.status(400);
    throw new Error("Error Occured!");
  }
});

const loginAuth = asyncHandler(async (req, res) => {
  console.log("isnide one");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(201).json({
        message: "Logged In Successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
        },
        error: null,
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Something Went Wrong",
      error: err,
    });
  }
});

const updateProfile = async (req, res) => {
  try {
    const { name, email, pic, password } = req.body;
    console.log("user ruquested is ", req.userId);
    const user = await User.findOne({ _id: req.userId }, (err, doc) => {
      if (err) return err;
      else return doc;
    })
      .clone()
      .catch((err) => err);
    console.log("found user id is ", user._id.toString());
    if (user._id.toString() !== req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.pic = pic || user.pic;

      if (password) {
        user.password = password;
      }

      const updatedProfile = await user.save();
      return res.status(200).json({
        message: "Profile Updated Successfully",
        data: updatedProfile,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "An error occured",
      error: error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    console.log(req.userId);
    const user = await User.find({ _id: req.userId });
    if (user) {
      return res.status(200).json({
        message: "Success",
        data: user,
        error: null,
      });
    } else {
      return res.status(404).json({
        message: "User Not Found",
        data: null,
        error: true,
      });
    }
  } catch (error) {
    console.log("Error inside the catch of getUser is : ", error);
    res.status(400).json({
      message: "Something went wrong",
      data: null,
      error: error,
    });
  }
};

module.exports = { registerUser, loginAuth, updateProfile, getUser };
