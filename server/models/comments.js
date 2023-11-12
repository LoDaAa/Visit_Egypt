const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    city:{
        type : String,
        required : true
    },
    place:{
         type : String,
         required : true
    },
    comment:{
        type : String,
        required : true
    },
    time:{
        type: Date,
        required : true
    },
    likes:{
            type : Number
    },
    likedUsers:[
        {
            type : mongoose.Types.ObjectId
        }
    ],
    unLikedUsers:[
        {
            type : mongoose.Types.ObjectId
        }
    ],
    _userId:{
        type : mongoose.Types.ObjectId,
        required : true
    },
    username:{
        type : String,
        required : true
    },
    imageURL:{
        type : String
    },
    timeNow:{
        type: String
    }
})

const Comments = mongoose.model('Comments', commentSchema)

module.exports = { Comments }