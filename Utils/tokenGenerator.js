const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET)
}

module.exports = generateToken;