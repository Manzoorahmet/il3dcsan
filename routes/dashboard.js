const router = require('express').Router()
const multer = require('multer')
const passport = require('passport')
const httpMsgs = require('http-msgs')

const Appointment = require('../models/Appointment')
const Date = require('../models/Date')
const Admin = require('../models/Admin')

const { ensureAuthenticated } = require('../config/auth')

// 5f4f26e28cda5b0c10ebc62b
// akashreddy@3D
// iamadmin

// Multer Congig
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/insp"
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20,
    }
    // fileFilter: fileFilter,
});

// Get Login Form
router.route("/login").get((req, res) => {
    res.render("adminlogin");
});

router.route('/verify').get(ensureAuthenticated, (req, res) => {
    res.render('adminverify')
})

router.route('/verify').post(ensureAuthenticated, (req, res) => {
    // res.render('adminverify')
    const id = req.body.id;
    Admin.findOne({ uniqueID: id })
        .then((admin) => {
            if (!admin) {
                res.send("You are not admin");
            } else {
                res.redirect("/admin/dashboard");
            }
        })
        .catch((err) => console.log(err));
});

// Post login form
router.route('/loginpost').post( passport.authenticate('local'), (req, res) => {
    res.redirect('/admin/verify')
})


// Logout 
router.route('/logout').get(ensureAuthenticated, (req, res) => {
    req.logout()
    res.redirect('/admin/login')
})

// Logout
router.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/admin/login");
});

// Get dashboard
router.route('/dashboard').get(ensureAuthenticated, (req, res) => {
    // res.render('dashboard')
    var toShow = [];
    Appointment.find()
        .then((posts) => {
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].toShow === true) {
                    toShow.push(posts[i]);
                    //    console.log(posts[i].toShow)
                }
            }

            res.render("dashboard", { toShow });
        })
        .catch((err) => console.log(err));
});

// Images upload
router.route('/:appointmentID/upload/:num').get(ensureAuthenticated, (req, res) => {
    Appointment.findById(req.params.appointmentID).then(appointment => {
        const num = req.params.num + 1
        res.render('upload', {appointment, num})
    }).catch(err => console.log(err))
})


router.route('/:id/upload').post(upload.single('image'), (req, res) => { 
    Appointment.findById(req.params.id).then(appointment => {
        // console.log(req.file)
        const image = req.file.path.replace(/\\/g, '/')
        const newData = {
            image: image,
            room: req.body.room
        }

        appointment.images.push(newData)

        appointment.save().then(data => {
            res.redirect(`/admin/${data.id}/upload/${data.images.length}`)
        })
        .catch((err) => console.log(err));
});
})

// router.route("/:id/upload").post(upload.single("image"), (req, res) => {
//     Appointment.findById(req.params.id)
//         .then((appointment) => {
//             // console.log(req.file)
//             const newData = {
//                 image: req.file.path,
//                 room: req.body.room,
//             };

//             appointment.images.push(newData);

//             appointment.save().then((data) => {
//                 res.redirect(`/admin/${data.id}/upload/${data.images.length}`);
//             });
//         })
//         .catch((err) => console.log(err));
// });

// Show all uploaded images
router.route('/:id/images').get(ensureAuthenticated, (req, res) => {
    Appointment.findById(req.params.id).then(appointment => {
        if(appointment){
            appointment.completed = true
            appointment.save().then(res.render('showImage', {appointment}))
            // res.render('showImage', {appointment})
        }
       
    }).catch(err => console.log(err))
})



router.route('/:id/delete/:imageid').get(ensureAuthenticated, (req, res) => {
    Appointment.findById(req.params.id).then(appointment => {
        for(var i = 0; i<appointment.images.length; i++){
            if(appointment.images[i].id === req.params.imageid){
                // rermove that image from images array
                appointment.images.splice(i, 1)
            }

            appointment
                .save()
                .then((newdata) =>
                    res.redirect(
                        `/admin/${newdata.id}/upload/${newdata.images.length}`
                    )
                );
        }
       })   .catch((err) => console.log(err));

    });

// Archive Appointments
router.route('/archive').get(ensureAuthenticated, (req, res) => {
    Appointment.find().then(appointment => {
        res.render('archive', {appointment})
    })
})

router.route('/schedule').get(ensureAuthenticated, (req, res) => {
    
    Date.find().then(date => {
        var blocked_date = []
        res.render('schedule', {date})
    }).catch(err => console.log(err))
})


// Check time for blocking
router.route('/get-time').post((req, res) => {
    const myDate = req.body.date
    var arr = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM']

    Date.findOne({date: myDate}).then(date => {
        if(!date){
            httpMsgs.sendJSON(req, res, {
                from: arr
            })

        }else{
            httpMsgs.sendJSON(req, res, {
                from: date.availableTime
            }) 
        }
    })
})


// Block time
router.route('/block-time').post((req, res) => {
    const blockTime = req.body.time
    const myDate = req.body.date
    // console.log(blockTime)
    var arr = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM']

    Date.findOne({date: myDate}).then(date => {
        if(!date){
            var available = arr.filter((el) => {
               return blockTime.indexOf(el) < 0
            })
            const newDate = new Date({
                date: myDate,
                availableTime: available,
                blockedTime: blockTime
            })

            newDate.save().then(newdate => {
                httpMsgs.sendJSON(req, res, {
                    from: newdate
                })
            })
            
        }else{
            var available = date.availableTime
            available = available.filter((el) => {
                return blockTime.indexOf(el) < 0
            })
            data.availableTime = available
            data.save().then(newdate => {
                httpMsgs.sendJSON(req, res, {
                    from: newdate
                })
            })

        }
    }).catch(err => console.log(err))
})


// get unblock info
router.route('/unblock').post((req, res) => {
    const myDate = req.body.date

    Date.findOne({date: myDate}).then(date => {
        if(!date){
            httpMsgs.sendJSON(req, res, {
                from: 'Blocked time not found on this date!',
                success: false
            })

        }else{
            httpMsgs.sendJSON(req, res, {
                from: date.blockedTime
            }) 
        }
    })
})


// post unblock info
router.route('/unblock-time').post((req, res) => {
    const blockTime = req.body.time
    const myDate = req.body.date

    Date.findOne({date: myDate}).then(date => {
        
            var blocked = date.blockedTime
            blocked = blocked.filter((el) => {
                return blockTime.indexOf(el) < 0
            })
            date.blockedTime = blocked
            date.save().then(newdate => {
                httpMsgs.sendJSON(req, res, {
                    from: 'Selected time has been unblocked'
                })
            })


    }).catch(err => console.log(err))
})



module.exports = router
