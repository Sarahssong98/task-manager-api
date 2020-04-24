var express = require('express')
const app=require('express')()
const auth = require('../middleware/auth')
var router = express.Router()
const cookieParser = require('cookie-parser');
app.use(cookieParser());
var ObjectId = require('mongoose').Types.ObjectId; 
const User = require('../models/user')
var Board= require('../models/board')
var Comment = require('../models/comment')

router.get('/',async(req,res,next)=>{
   
    Board.find({}).
        populate('author').exec(async(err,board)=>{
            if(err) return res.send(err)
            await Comment.find({})
            .populate('author').exec((err,comment)=>{
                if(err) return res.send(err)
            })
         res.render('list',{
            board:board,
            name:"Sarah Song",
            title:'Board'
        })
    })
})
//Board Write page
router.get('/write',(req,res,next)=>{
    res.render('write',{title:'New Article', name:"Sarah Song"})
})
// function getFormatDate(date){
//     var year = date.getFullYear()
//     var month = 1+date.getMonth()
//     month = month >=10 ? month: '0'+month
//     var day = date.getDate()
//     day = day>=10? day: '0'+day
//     return year+'-'+month+'-'+day
    
//Post Write
router.post('/post_write',async (req,res,next)=>{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    var board = new Board();
    board.author=user[0]._id
    board.title =  req.body.title
    board.content= req.body.content
    await board.save((err,board)=>{
        if(err) return res.send(err)
        res.redirect('/board')
    })
    // Board.findOne({_id:board._id}).
    //     populate({path:"author",model:"User"}).
    //     exec(async function (err,board){
    //         if(err) return res.send(err)
    //         board.title =  req.body.title
    //         board.content= req.body.content
    //          await board.save((err,board)=>{
    //             if(err) return res.send(err)
    //            res.redirect('/board')
    //         })
    //     })
})
//Link click 시 해당 board 게시물로 가기
router.get('/:id',async(req,res)=>{
   await Board.findOne({_id:req.params.id})
        .populate('author').exec(async(err,board)=>{
            if(err) return res.send(err)
             await Comment.find({board:board._id}).populate('author').exec((err,comment)=>{
                res.render('board',{
                    board:board,
                    edit: false,
                    comment:comment,
                    name:"Sarah Song",
                    title:"Article",
                    update_id:"none"
         
                })
            })
            
        })

//Comment.find({board:board._id}).populate('author').exec((err,comment)=>{
})
router.get('/:id/update',auth,async(req,res)=>{
    try{
         Board.findById({_id:req.params.id}).then((board)=>{
            res.render("update",{
                title:"Update Article",
                name:"Sarah Song",
                board:board
            })
         })
       
    }
    catch(e){
        res.status(404).send()
    }
})
router.post('/updateSend',auth,async(req,res)=>{
  try{
        Board.findOneAndUpdate({_id:req.body.board_id},{$set:{title:req.body.title, content:req.body.content}},(err,board)=>{
        res.redirect('/board/'+req.body.board_id)
    })
  }
catch(e){
      res.status(404).send()
  }
})
router.post('/delete',auth,async(req,res)=>{
    try{
        await Board.findOneAndDelete({_id:req.body.board_id})
        res.redirect('/board')
    }
    catch(e){
        res.send("Error")
    }
})
//comment post
router.post('/comment/post_write',async (req,res,next)=>{
    var auth_token= req.cookies.auth_token
    const user = await User.findByToken(auth_token)
    var comment = new Comment({
        author:user[0]._id,
        content:req.body.content,
        board:req.body.id
    })
    comment.save().then(()=>{
        Board.findOneAndUpdate({_id:req.body.id},{$push:{comments:comment}},{new:true},async(err,board)=>{
            if(err) {
                return res.send("Comment error!")
            }    
            await Comment.find({board:board._id}).populate('author').exec((err,comment)=>{
                res.render('board',{
                    board:board,
                    edit: true,
                    update_id:req.body.comment_id,
                    comment:comment,
                    name:"Sarah Song",
                    title:"Article"
         
                })
            })
        })
        
    })
})
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
router.post('/comment/updateSend',auth,async(req,res)=>{
    try{
    
          await Comment.findOneAndUpdate({"_id":new ObjectId(req.body.comment_id)},{$set:{content:req.body.update_content}},(err,board)=>{
            res.redirect('/board/'+req.body.board_id)
          })
      
    }
    catch(e){
        res.status(404).send()
    }
})

router.post('/comment/delete',auth,async(req,res)=>{
    try{
        var auth_token= req.cookies.auth_token
        const user=await User.findByToken(auth_token)
        //const task= await Task.findByIdAndDelete(req.params.id)
        await Comment.findOneAndDelete({_id:req.body.comment_id})
        await Board.findOne( {_id: req.body.board_id}, (err,board)=>{
            if(err){console.log(err)}
            else{
                var idOfRemove= req.body.comment_id
                Board.findOneAndUpdate({_id:req.body.board_id},{$pull:{comments:{_id:idOfRemove}}},(err,removedComment)=>{
                    if(err){console.log(err)}
                    else res.redirect('/board/'+req.body.board_id)
                })
            }
        })
    }catch(e){
        res.send("Error!")
    }
})
router.post('/comment/update',auth,async(req,res)=>{
    const board = await Board.findOne({_id:req.body.board_id})
    await Comment.find({board:board._id}).populate('author').exec((err,comment)=>{
        res.render('board',{
            board:board,
            edit: true,
            update_id:req.body.comment_id,
            comment:comment,
            name:"Sarah Song",
            title:"Article"
 
        })
    })
})
router.post('/comment/reply',auth,async(req,res)=>{

    const board = await Board.findOne({_id:req.body.board_id})
    await Comment.find({board:board._id}).populate('author').exec((err,comment)=>{
        res.render('board',{
            board:board,
            edit:false,
            reply:true,
            update_id:req.body.comment_id,
            comment:comment,
            name:"Sarah Song",
            title:"Article"
        })
    })
    
})
router.post('/comment/replySend',auth,async(req,res)=>{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    var replyComment = new Comment({
        author:user[0]._id,
        content:req.body.content,
        board:req.body.board_id,
    })
    replyComment.save().then(()=>{
        Board.findOneAndUpdate({_id:req.body.board_id},{$push:{comments:replyComment}},{new:true},async(err,board)=>{
            if(err) {
                return res.send("Comment error!")
            }    
            await Comment.findOneAndUpdate({_id:req.body.comment_id},{$push:{subcomments:replyComment}},{new:true},async(err,comment)=>{
                await Comment.find({board:board._id}).populate('author').exec(async(err,comments)=>{
                        var upcomment = Comment.findOne({_id:req.body.comment_id})
                        console.log(upcomment)
                        res.render('board',{
                            board:board,
                            edit: false,
                            reply:false,
                            update_id:"none",
                            comment:comments,
                            name:"Sarah Song",
                            title:"Article"
                        })
                })
                })
            })
        })
    })
module.exports = router;