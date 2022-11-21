const bcrypt = require('bcryptjs/dist/bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("User already exist")
    }

    const user = await User.create({
        name, email, password, pic
    })

    if (user) {
        res.status(201).json({
            message: 'User Registered Successfully',
            error: null,
        })
    } else {
        res.status(400)
        throw new Error("Error Occured!")
    }
})



const loginAuth = asyncHandler(async (req, res) => {
    console.log("isnide one")
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(201).json(
                {
                    message: 'Logged In Successfully',
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        pic: user.pic,
                        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
                    },
                    error: null
                })
        }
    } catch (err) {
        res.status(401).json({
            message: 'Something Went Wrong',
            error: err
        })
    }


})

module.exports = { registerUser, loginAuth };