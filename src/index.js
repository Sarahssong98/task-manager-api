//starting part
const express=require('express')
const app=express()
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const Board = require('./models/board')
const userRouter = require('./routers/user')
const taskRouter=require('./routers/task')
const boardRouter=require('./routers/board')
const cookieParser = require('cookie-parser')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
const port = process.env.PORT
const path=require('path')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//path.join:__dirname+../public
const publicDir=path.join(__dirname,'../public')
//Define path for handlebars
const viewsPath=path.join(__dirname,'../templates/views')
const partialPath=path.join(__dirname,'../templates/partials')
//set up handlebars engine and views location
app.set('view engine', 'ejs')//hbs가 템플릿엔진임
app.set('views',viewsPath)//custom directory
//express.static:takes the path 
//use: a way to customize server 
app.use(express.static(publicDir))
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
app.use('/users',userRouter)
app.use('/tasks',taskRouter)
app.use('/board',boardRouter)
//without middleware: new request => runs route handler

//with middleware: new request => do something(function) => runs route handler
app.get('',async(req,res)=>{
  
   
    res.render('home',{
        title:'Home',
        name:'Sarah Song',
    })
})
app.get('/login',(req,res)=>{
    res.render('login',{
        title:'Login',
        name:'Sarah Song'
    })
})
app.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'Login',
        name:'Sarah Song'
    })
})
app.get('/update',async(req,res)=>{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    res.render('update',{
        title:'Update',
        user_name:user[0].name,
        user_age:user[0].age,
        user_email:user[0].email,
        name:'Sarah Song'
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About',
        name:'Sarah Song'
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        name:'Sarah Song',
        helpText:'This is some helpful text'
    })
})

app.get('/success',(req,res)=>{
    res.render('success',{
        title:'Success',
        name:'Sarah song',
        successMessage:'Your submit is successfully saved. Thank you.'
    })
})
app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Sarah song',
        errorMessage:'Page not found'
    })
})

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

module.exports=app;