const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    imageURL:{
         type : String
    },
    _city:{
        type : String,
        required : true
    },
    _userId:{
        type : mongoose.Types.ObjectId,
        required : true
    }
})

const Places = mongoose.model('Places', placeSchema)

module.exports = { Places }