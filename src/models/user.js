const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task= require('./task')
mongoose.connect('mongodb://127.0.0.1:27017/task-manage-api',{
    useNewUrlParser:true,
    useCreateIndex:true
})
//mongoose schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        //guarantee email unique
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        //store token to track
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true // user creat할때마다 time정보 제공(create,update시간)
})
//virtual property : not changing the storage data, just for relation
userSchema.virtual('tasks',{
    //task model has the reference to the User 
    //helps the mongoose to understand the relationship
    ref:'Task',
    localField:'_id',//where local data is stored: user id 
    foreignField:'owner'//task
})

userSchema.methods.toJSON = function (){
    const user = this
    //get back a raw object with just user data
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken = async function(){
    //methods are accessible to the instances<->statics: accessible to the model
    const user = this 
    //generate a jwt
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    await user.save() //save token to database

    return token
}
//setting a value to userSchema.statics 
userSchema.statics.findByCredentials= async(email,password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user 
}
//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//Delete user tasks when user is removed mddleware
userSchema.pre('remove',async function(next){
    const user = this
    //delete multiple tasks using owner field
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)
// //setting middleware :pre -  doing sth before an event (=users are saved)
// //second argument should be a standard function
// userSchema.pre('save',async function(next){
//     const user = this //document of user
//     //run some code before user is saved 
//     if (user.isModified('password')){
//         //check user's password is made or updated
//         user.password = await bcyrpt.hash(user.password,8)
//     }
//     next()
// })
// const User = mongoose.model('User',userSchema)

module.exports= User