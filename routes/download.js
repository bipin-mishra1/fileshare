const route = require("express").Router();
const File = require("../models/file");
const path = require("path");
const fs = require("fs");
const uploadDirectory = path.join(__dirname, "../uploads/");

route.get('/:uuid', async (req, res)=>{
    const uuid = req.params.uuid;
    const file = await File.findOne({uuid})
    if(!file){
        res.send('file does not exist, may be it\'s expired')
    }
    const fileToDownload = `${uploadDirectory}/${file.filename}`
    res.download(fileToDownload)
})

module.exports = route;
