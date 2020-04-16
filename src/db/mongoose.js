const mongoose=require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
})

// const tasks= new Task({
//     description:'Reading book',
//     completed:false
// })
// tasks.save().then(()=>{
//    console.log(tasks)
// }).catch((error)=>{
//     console.log(error)
// })
// const User = mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     email:{
//         type:String,
       
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password:{
//         type:String,
//         minlength:6,
//         required:true,
//         trim:true,
//         validate(value){
//             if(value.toLowerCase().includes("password")){
//                 throw new Error('Password is invalid')
//             }
//         }
//     },
//     age:{
//         type:Number,
//         default:0,
//         validate(value){
//             //negative numbers not allowed
//             if(value<0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me = new User({
//     name:'     Sarah     ',
//     email:'MYEMAIL@MEAD.IO    ',
    
// })

// //save it to the database
// me.save().then(()=>{
//     console.log('Success!',me)
// }).catch((error)=>{
//     console.log('Error!',error)
// })