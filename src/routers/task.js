const express = require('express')
const app=require('express')()
const app_=express()
const bodyParser=require('body-parser')
app_.use(bodyParser.json())
const router=new express.Router()
const Task=require('../models/task')
const User = require('../models/user')
const auth=require('../middleware/auth')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};
//GET /tasks?completed=false
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    const match ={}
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    const sort={}
    if(req.query.sortBy){
        const parts= req.query.sortBy.split(':')
        sort[parts[0]]= parts[1]==='desc' ? -1:1
        //sort[parts[0]]= parts[1]==='desc' ? -1:1
    }
    try{
        //const tasks = await Task.find({_id,owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e){
        res.status(500).send()
    }
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

//return user tasks
router.get('/me',auth,async(req,res)=>{
    try{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    const tasks=await Task.find({owner:user[0]._id}).select('description')
    const obj = JSON.parse(JSON.stringify(tasks))
    // tasks=JSON.toStringify(obj)
    res.render('tasks',{tasks:tasks})
    // res.render('tasks',{
    //     task1:
    // })
    // res.render('tasks',{
    //     task1:tasks[0].description,
    //     t
    // })
    // Task.find(({owner:user[0]._id}).lean().exec(function (err, tasks) {
    //     return res.send(JSON.stringify(tasks));
    // }))}
    //find by id
        // res.render('tasks',{
        //     task1:
        // })
    }
    catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send
    // })
})
//task update
router.post('/update',auth, async(req,res)=>{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    const updates=Object.keys(req.body)//take object and return array of strings
    //properties allowed to change
    const allowedUpdates=['description','completed']
    //updates should exist in allowedUpdates
    const isValidOperation = updates.every((update)=>{
        //every:run function for every item in the array 
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates'})
    }
    try{
        //update task for middleware
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({owner:user[0]._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        //second argument: update content
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //no user
       
        res.send({task:task})
    }catch (e){
        //invalidaton
        res.send(400).send()
    }
})
//task delete
router.get('/delete',auth,async(req,res)=>{
    try{
        var auth_token= req.cookies.auth_token
        const user=await User.findByToken(auth_token)
        //const task= await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({owner:user[0]._id})
        if(!task){
            res.send(404).send()
        }
        res.send({task})
    }catch(e){
        res.send(500).send()
    }
})
router.get('/new',auth,(req,res)=>{
    res.render('create_task',{
        name:"Sarah Song",
        title:"Create new task"
    })
})
//task creation 시 authentication 필요 //task create
router.post('/new',auth,async(req,res)=>{
    //when creating new task, add the owner property
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    const task = new Task({
        description:req.body.description,//copy all of the req.body 
        owner:user[0]._id
    })
    task.save().then(()=>{
        res.redirect('/tasks/me')
    }).catch((error)=>{
        res.send("Task Add Fail")
    })
})

module.exports=router