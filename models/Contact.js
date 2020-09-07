const mongoose = require('mongoose')
const Schema = mongoose.Schema


const contactSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    message: {type: String}
})


const Contact = mongoose.model('contacts', contactSchema)
module.exports = Contact