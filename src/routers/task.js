const express = require('express')
const router=new express.Router()
const Task=require('../models/task')
const auth=require('../middleware/auth')
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
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    //find by id
    try{
        //const task=await Task.findById(_id)
        //get the task I created 
        const task = await Task.findOne({_id,owner:req.user._id})
         if(!task){return res.status(404).send()}
         res.send(task)
    }catch(e){
        res.status(500).send
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
router.patch('/tasks/:id',auth, async(req,res)=>{
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
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
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
       
        res.send(task)
    }catch (e){
        //invalidaton
        res.send(400).send()
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        //const task= await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
        if(!task){
            res.send(404).send()
        }
        res.send(task)
    }catch(e){
        res.send(500).send()
    }
})
//task creation 시 authentication 필요 
router.post('/tasks',auth,(req,res)=>{
    //when creating new task, add the owner property
    const task = new Task({
        ...req.body,//copy all of the req.body 
        owner:req.user._id
    })
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((error)=>{
        res.status(400)
        res.send(error)
    })
})

module.exports=router