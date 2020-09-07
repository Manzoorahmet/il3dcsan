const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const session = require('express-session')
const mongoose = require("mongoose");
const passport = require('passport')
const flash = require('connect-flash')
const httpMsgs = require('http-msgs')

require('dotenv').config()
require('./config/pasport')(passport)

const Admin = require('./models/Admin')
const Date = require('./models/Date');
const Appointment = require("./models/Appointment");


// MOngoDB Atlas connection string
// mongodb://localhost:27017/infinity-3D
mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("DB connected!!!");
    }
)


const app = express();

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Express session
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Public directories
app.use(express.static(__dirname + "/public"));

app.use('/uploads', express.static('uploads'))
app.use('/uploads', express.static('./uploads'))

// EJS
// app.use(expressLayout)
app.set("view engine", "ejs");

//Connectr flash
app.use(flash()) 

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
  })

app.get('/', (req, res) => [
    res.render('home')
   
])


// Show 3D view
app.get('/view/:appointid/:imageid/', (req, res) => {
    // res.render('show')
    Appointment.findById(req.params.appointid).then(appointment => {
        if(!appointment){
            return console.log('Invalid Urlsss')
        }

        for(var i = 0; i < appointment.images.length; i++){
            if(appointment.images[i].id === req.params.imageid){
                return res.render('show', {appointment, displayImage: appointment.images[i].image})
            }
            // console.log('Invalid Url')
        }
    }).catch(err => console.log(err))
})


app.use("/", require("./routes/orders"));
app.use("/", require("./routes/payment"));
app.use("/", require('./routes/contact'))
app.use("/admin", require('./routes/dashboard'))


app.use('*', (req, res) => {
    res.send('Page Not Found. 404!!!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is up and running on port 3000");
});
