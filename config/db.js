/* eslint-disable */

const mongoose = require('mongoose')

const connectDB = (url)=>{

    mongoose.connect(url);

    const connection = mongoose.connection;
    
    connection.once("open", ()=>{
        console.log('DB Connected');
    }).on('error', (err)=>{
        console.log('Connection Failed.') 
    })

}

module.exports = connectDB