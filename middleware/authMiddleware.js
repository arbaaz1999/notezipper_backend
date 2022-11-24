const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        console.log("inside this")
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken)
        req.decodedToken = decodedToken
        const userId = decodedToken.id;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (err) {
        console.log("inside this ", err)
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

module.exports = protect;