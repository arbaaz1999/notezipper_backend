const mongoose = require('mongoose')

const connectDB = () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected: ${conn}`)
    } catch (error) {
        console.error(`Error - ${error.message}`)
        process.exit();
    }
}

module.exports = connectDB;