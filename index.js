const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();
dotenv.config();

app.use(express.json())

const PORT = process.env.PORT|8080

app.get('/', (req, res) => {
    res.send('response has been sent!')
})

app.use('/api/files', require('./routes/files')) 

app.use('/api/file', require('./routes/download'))

app.listen(PORT, ()=>{
    connectDB(process.env.MONGODB_URI)
    console.log(`listeing on port: ${PORT}`)
})