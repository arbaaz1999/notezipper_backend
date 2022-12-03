const fs = require('fs');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const noteRoutes = require('./routes/noteRoutes')

const app = express()
app.use(cors())
dotenv.config()
connectDB();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...')
})

/* app.post('/api/notes', (req, res) => {
    res.json(notes)
}) */

app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)


const server = https.createServer({
    key: fs.readFileSync(`./localhost-key.pem`, 'utf8'),
    cert: fs.readFileSync(`./localhost.pem`, 'utf8')
}, app);

server.listen(443);

/* const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`port started on Port ${PORT}`)) */