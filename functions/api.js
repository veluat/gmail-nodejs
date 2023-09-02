const nodemailer = require("nodemailer");
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(cors({origin: '*'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


let smtp_login = process.env.SMTP_LOGIN || "---"
let smtp_password = process.env.SMTP_PASSWORD || "---"

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: smtp_login,
        pass: smtp_password
    },
});

router.get('/', (req, res) => {
    res.send("App is running..")
})

router.post('/sendMessage', async (req, res) => {

    const {name, email, subject, message} = req.body

    let info = await transporter.sendMail({
        from: "portfolio-form", // sender address
        to: smtp_login, // list of receivers
        subject: "✔ portfolio-form", // Subject line
        html: `<div>name: ${name}</div>
                 <div>contacts: ${email}</div>
                 <div>subject: ${subject}</div>
                <div>message: ${message}</div>`,
    });
    res.send(req.body)
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);


