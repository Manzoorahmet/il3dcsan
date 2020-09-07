const router = require('express').Router()
const { stringify } = require('querystring')
const fetch = require('node-fetch')

const Appointment = require('../models/Appointment')
const Date = require('../models/Date')


// Site Details
router.route('/appointment').get((req, res) => {
    res.render('order1')
})

router.route('/site-details').post((req, res) => {
    const{address, apt, state, city, zipCode, sqFootage, access, orderType} = req.body
    var lockboxInput = ''

    if(access === 'Lockbox Combo'){
         lockboxInput = req.body.lockboxInput
    }

    const newAppointment = new Appointment({
        address,
        apt, 
        state, 
        city, 
        zipCode,
        sqFootage, 
        access, 
        lockboxInput,
        orderType
    })
    newAppointment.calender_access = true
    newAppointment.save().then(data => {
        
        res.redirect(`/${data.id}/pick-date`)
        
    }).catch(err => console.log(err))

})


// GET calendar
router.route('/:postID/pick-date').get((req, res) => {
    Appointment.findById(req.params.postID).then(appointment => {
        if(appointment.calender_access === false){
            res.redirect('/appointment')
        }else{
            res.render('order2', { appointment})
        }
    }).catch(err => console.log(err))
})

router.route('/:postID/pick-date').post((req, res) => {
    const date = req.body.date

    Appointment.findById(req.params.postID).then(data => {


        Appointment.findOne({"date": date}).then(dates => {
        if(dates){
            data.date = date
            data.save().then(appointment => {
                appointment.time_access = true
                appointment.save()
                res.redirect(`/${appointment.id}/pick-time`)

            }).catch(err => console.log(err))

        }else{
            data.date = date

            const newDate = new Date({
                date,
                availableTime: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM']
            })
            newDate.save()
            data.save().then(appointment => {
                appointment.time_access = true
                appointment.save()
                res.redirect(`/${appointment.id}/pick-time`)

            }).catch(err => console.log(err))
            
        }
    }).catch(err => console.log(err))
    })
    
})



// Pick time
router.route('/:postID/pick-time').get((req, res) => {
    // res.render('order3')
    Appointment.findById(req.params.postID).then(appointment => {
        const date = appointment.date
        if(appointment.time_access === false){
            res.redirect(`/${appointment.id}/pick-date`)
        }else{
            Date.findOne({date: date}).then(date => {
                res.render('order3', {availableTime: date.availableTime, appointment})
            }) 
        }
       
    }).catch(err => console.log(err))
})

router.route('/:postID/pick-time').post((req, res) => {
    // res.send('Got post')
    Appointment.findById(req.params.postID).then(post => {
        post.time = req.body.time
        post.save().then(post => {
            // res.send(data)
            Date.findOne({date: post.date}).then(data => {
                const time = req.body.time
                for(var i = 0; i < data.availableTime.length; i++){
                    if(data.availableTime[i] === time){
                         data.availableTime.splice(i, 2)
                    }
                }
                post.client_access = true
                post.save()
                data.save()
                // res.send(data)
                res.redirect(`/${post.id}/client-details`)
            }).catch(err => console.log(err))
            
        })
    }).catch(err => console.log(err))

})


// Client Details
router.route('/:postID/client-details').get((req, res) => {
    // res.render('order4')
    Appointment.findById(req.params.postID).then(appointment => {
        if(!appointment){
            res.send('no post')
        }else{
            if(appointment.client_access === false && appointment.time_access === false ){
                res.redirect(`/${appointment.id}/pick-date`)
            }else if(appointment.client_access === false ){
                res.redirect(`/${appointment.id}/pick-time`)
            }else{
                res.render('order4', {appointment})
            }
        }
    })

})



router.route('/:postID/client-details').post((req, res) => {

    Appointment.findById(req.params.postID).then(appointment => {

        if(!req.body.captcha){
            return res.json({success: false, msg: 'Please select captcha'})
        }

        const secretKey = '6LdHi8UZAAAAAPrVOiITFUHCMtLALw8mqz-FDxPj'

        const query = ({
            secret: secretKey,
            response: req.body.captcha,
            remoteip: req.body.remoteAddress
        })

        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`

        const body = fetch(verifyURL).then(data => console.log(data))

        if(body.success !== undefined && !body.success)
            return res.json({success: false, msg: 'Failed to verify captcha'})

        appointment.firstName = req.body.firstName
        appointment.lastName = req.body.lastName
        appointment.companyName = req.body.companyName
        appointment.phoneNumber = req.body.phoneNumber
        appointment.email = req.body.email
        appointment.note = req.body.note
        appointment.save()

        res.json({success: true, msg: 'Captcha Passed!'})

    })
})


router.route('/show-case').get((req, res) => {
    res.render('showCase')
})



module.exports = router
