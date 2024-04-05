const mongoose = require('mongoose');

module.exports = ticketSchema = new mongoose.Schema({
    "id" : Number,
    "status" : Boolean,
    "time" : Date
});