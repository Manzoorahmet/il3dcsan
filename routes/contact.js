const router = require('express').Router()
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')

const Contact = require('../models/Contact')

// Nodemailer clientt
const client = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

// Contact Page
router.route('/contact').get((req, res) => {
    res.render('contact')
})


router.route('/contact').post((req, res) => {


    if(!req.body.captcha){
        return res.json({success: false, msg: 'Fill up the captcha'})
    }

    const secretKey = '6LdHi8UZAAAAAPrVOiITFUHCMtLALw8mqz-FDxPj'

    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.body.remoteAddress
    })

    const validURL = `https://google.com/recaptcha/api/siteverify?${query}`

    const body = fetch(validURL).then(data => console.log(data))

    if(body.success !== undefined && !body.success){
        return res.json({ success: false, msg: 'Failed captcha verification' })
    }

    const newContact = new Contact({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        message: req.body.message
    })

    const sendEmail = {
        from: 'adhikari.gokul5@gmail.com',
        to: 'gocool.adhikari11@gmail.com',
        subject: 'Contact Form info from Infinity 3D',
        html: `<p>${req.body.firstName} filled the contact form. His email is ${req.body.email} and his message: ${req.body.message} `
    }


    client.sendMail(sendEmail, (err, info) => {
        if(err){
            console.log(err)
        }else{
            newContact.save()
        }
    })
    

    res.json({ success: true, msg: 'Captcha passed' })

})

module.exports = router