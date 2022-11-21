const jwt = require('jsonwebtoken')
const User = require('../models/userModels')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(
    async (req, res, next) => {
        let token;
        console.log(token)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1];

                // decode token

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('decoded is ', decoded)
                req.decoded = decoded;
                console.log(req.user)
                next();
            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error("Token is not Authorized");
            }
        }


        if (!token) {
            res.status(401)
            console.log('inside this')
            throw new Error("Token is not Authorized");
        }
    }
)

module.exports = protect;
