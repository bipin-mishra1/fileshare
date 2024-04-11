const route = require("express").Router();
const multer = require("multer");
const path = require("path");
const { v4: uuid4 } = require("uuid");
const File = require("../models/file");
const fs = require("fs");
const uploadDirectory = path.join(__dirname, "../uploads/");
const sendMail = require('../service/emailService')

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const uniquefilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniquefilename);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("filename");

route.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(`Internal server error: ${err.message}`);
    }
    
    if (!req.file) {
      return res.json({
        error: "please enter a file",
      });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_URI}/files/${response.uuid}`,
    });
  });
});

route.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required." });
  }

  try {
    const file = await File.findOne({ uuid });
    if (!file) {
      return res.status(404).send({ error: "File not found." });
    }

    if (file.sender) {
      return res.status(422).send({ error: "Email already sent." });
    }

    file.sender = emailFrom;
    file.reciever = emailTo;

    await file.save();

    await sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'this is test email generated from node app',
      text: 'sending email to test my app',
      html: `<a href="${process.env.APP_URI}api/file/${uuid}">Download Link</a>`
    });

    return res.status(200).send({ success: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send({ error: "Internal server error." });
  }
});

module.exports = route;
