const mongoose = require('mongoose')
const Schema = mongoose.Schema


const dateSchema = new Schema({
    date: {type:String},
    availableTime: [{type: String}],
    blockedTime: [{type: String}]
})


const Date = mongoose.model('dates', dateSchema)
module.exports = Date