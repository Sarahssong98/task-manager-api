//게시판을 위한 model 
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema ({
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
    board:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board'
    }
})
function getFormatDate(date){
    var year = date.getFullYear()
    var month = 1+date.getMonth()
    month = month >=10 ? month: '0'+month
    var day = date.getDate()
    day = day>=10? day: '0'+day
    return year+'-'+month+'-'+day
    
}
var boardSchema = new Schema({
    title:String,
    content:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    //make reference to the User ->can fetch to the User profile 
        ref:'User'
    },
    board_date:{
        type:String,
        default:getFormatDate(new Date())
    },
    comments:[{
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
            board:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Board',
                localField:'_id',//where local data is stored: user id 
                foreignField:'board'//task
            }
    }]
    
})
module.exports = mongoose.model('board',boardSchema)