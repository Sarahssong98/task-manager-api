//starting part
const express=require('express')
const app=express()
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')

const userRouter = require('./routers/user')
const taskRouter=require('./routers/task')

const port = process.env.PORT
//middleware function
// app.use((req,res,next)=>{
//    if(req.method === 'GET'){
//         res.send('Get requests are disabled')
//    }else{
//        next()
//    }
//     //has to call next to call the route handler
// })
// app.use((req,res,next)=>{
//     res.status(503).send('The site is under maintenance')
// })
//customize server, automatically parse json to an object
app.use(express.json())
//Separating route files : create new router-> set up ->register by app.use
// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('')
// })
// app.use(router)
//router으로 database에 데이터 새로 생성
app.use(userRouter)
app.use(taskRouter)
//without middleware: new request => runs route handler

//with middleware: new request => do something(function) => runs route handler

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () =>{
//     //firstargument: data to be stored, secondargument: secrete signature
//     const token = jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
//     console.log(token)
//     //input 바탕으로 token verification -> to make sure user authenticated correctly 
//     const data = jwt.verify(token,'thisismynewcourse')
//     console.log(data)
//     //expire  token after an amount of time

//     // const password = 'Red12345!'
//     // //number of rounds - how many times hash runs
//     // const hashedPassword = await bcrypt.hash(password,8)
//     // console.log(password)
//     // console.log(hashedPassword)

//     // //given password matches password in database?
//     // const isMatch = await bcrypt.compare('Red12345!',hashedPassword)
//     // console.log(isMatch)
// }
// myFunction()

//hashing algorithms: only one way , not reversable 
//andrew -> ajfklakdjflka -encrypt-> andrew

// const pet = {
//     name:'Hal'
// }
// pet.toJSON = function (){
//     console.log(this)
//     return this
// }
// console.log(JSON.stringify(pet))



const main = async ()=>{
    // //find a task by its id 
    // const task = await Task.findById('5e946d74bd3c1f6940231d2a')
    // //add ref property to Task
    // //find the user associated with the task : task.owner에 저장 
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    //find User by task
    // const user = await User.findById('5e946b48f7089b09ec54b80f')
    // //get the tasks printed of the User 
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}
main()