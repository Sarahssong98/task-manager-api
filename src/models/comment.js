var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Board=require('./board')
var commentSchema = new Schema({
    content:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
    required:true,
    //make reference to the User ->can fetch to the User profile 
    ref:'User'
    },
    comment_date:{
        type:Date,
        default:Date.now()
    }, 
    subcomments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        localField:'_id',//where local data is stored: user id 
        foreignField:'comments'//task
    }],
    board:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board',
        localField:'_id',//where local data is stored: user id 
        foreignField:'board'//task
    }
})

module.exports = mongoose.model('comments',commentSchema)