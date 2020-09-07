const mongoose = require('mongoose')
const Schema = mongoose.Schema


const appointmentSchema = new Schema({
    address: { type: String }, 
    apt: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: {type: String},
    sqFootage: { type: String },
    access: { type: String },
    lockboxInput: {type: String, default: null},
    orderType: { type: Number, default: 0 },
    extraOffer: {type: Number, default: 0},
    date: {type:String, default: ''},
    time: {type: String, default: ''},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    companyName: {type: String, default: ''},
    phoneNumber: {type: Number, default: ''},
    images: [{
        image: {type: String},
        room: {type: String}
    }],
    email: {type: String, default: ''},
    note: {type: String, default: ''},
    calendar_access: {
        type: Boolean,
        default: false
    },
    time_access: {
        type: Boolean,
        default: false
    },
    client_access: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    toShow: {
        type: Boolean,
        default: false
    }
})


const Appointment = mongoose.model('appointments', appointmentSchema)
module.exports = Appointment