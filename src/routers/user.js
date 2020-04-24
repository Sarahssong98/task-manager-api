const express = require('express')
const app=require('express')()
const router=new express.Router()
const User=require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const jwt=require('jsonwebtoken')
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')
app.use(bodyParser.json());
app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const transport = require('../emails/nodemail')
const welcomeMailOption= (email,name)=> ({
    from:"thdguswn989@gmail.com",
    to:email,
    subject:'Welcome to the App!',
    text: `Welcome to the App, ${name}. Let me know how you get along with the app.`
})
const cancelMailOption= (email,name)=> ({
    from:"thdguswn989@gmail.com",
    to:email,
    subject:'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
})

const upload = multer ({
    limits:{fileSize:1000000},
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File should be image'))
        }
        cb(undefined,true)
    }
})
router.get('',async(req,res)=>{
    res.render('signup',{
        title:'Sign Up',
        name:'Sarah song',
    })
})
//generate authentication token 
router.post('', async (req,res)=>{
    //req=보낸 정보
    const user = new User(req.body)
    try{
         await user.save()
         const token = await user.generateAuthToken()
         transport.sendMail(welcomeMailOption(user.email,user.name), (err,info)=>{
            if(err){
                console.log("node mailer email error"+err)
            }
            res.cookie('auth_token', token)
            //res.sendFile(path.resolve(__dirname, '..', 'views', 'private.html'))
            res.render("success",{
                 title:'Success',
            name:'Sarah song',
            successMessage:'Thank you for joining our website'
            })
         })
    //if the function above does not work, the code below does not work
    }catch(e){
        res.send("Sign up Failed. Check your information once again.")
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    //     //res.status(400).send(error)와 같은 의미
    // })
})
router.post('/login',urlencodedParser,async(req,res)=>{
    try{//take in email, password(req.body) -> find it 
        const user = await User.findByCredentials(req.body.email,req.body.password)
        //have access to user
        //generate a token for the user 
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        //res.sendFile(path.resolve(__dirname, '..', 'views', 'private.html'))
        var string = encodeURIComponent(user.name);
      res.redirect('/?valid=' + string);
    }catch(e){
        res.send("Login Failed. Check your information once again.")
        console.log(e)
    }
})
//logging out : have to be authenticated to log out
router.post('/logout',auth, async (req,res)=>{
    //get authentication token 
    try{
        //removing the token from the token array
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token //같은것만 삭제하기
        })
        await req.user.save()//user 정보 저장
        res.redirect('/')
    }catch(e){
        res.status(500).send()
    }
})
//logging out all of the sessions
router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/me/avatar',auth, upload.single('avatars'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,req,res,next)=>{
    res.status(400).send()
})
router.delete('/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.render('success',{
        title:'Success',
        name:'Sarah song',
        successMessage:'Thank you. Bye.'
    })
}, (error,req,res,next)=>{
    res.status(400).send()
})
//user의 프로필 보여주기
// router.get('/:id/avatar',async(req,res)=>{
//     try{
//         const user = await User.findById(req.params.id)
//         if(!user||!user.avatar){
//             throw new Error()
//         }
//         res.set('Content-Type','image/png')
//         res.send(user.avatar)
//     }catch(e){
//         res.status(404).send()
//     }
// })

router.get('/me',auth,async (req,res)=>{
    try{
        var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    // if(!user||!user.avatar){
    //     throw new Error("There is no user")
    // }
    res.render('profile',{
        name:"Sarah Song",
        title:"Profile",
       user_name:user[0].name,
        age:user[0].age,
        email:user[0].email,
        id:user[0].id

    })
}catch(e){
    res.status(404).send(e)
}
})
//id is dynamic->route parameters : id value=req.params
// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id
//     //find by id 
//     //"User" is our User model here which represents the entire users collection in MongoDB.
//     try{
//         const user= await User.findById(_id)
//         if(!user){return res.status(404).send()}
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
    
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e)=>{
//     //         res.status(500).send()
//     // })
// })
//update
// router.patch('/users/:id',async (req,res)=>{
//     const updates=Object.keys(req.body)//take object and return array of strings
//     //properties allowed to change
//     const allowedUpdates=['name','email','password','age']
//     //updates should exist in allowedUpdates
//     const isValidOperation = updates.every((update)=>{
//         //every:run function for every item in the array 
//         return allowedUpdates.includes(update)
//     })
//     if(!isValidOperation){
//         return res.status(400).send({error:'Invalid updates'})
//     }
//     try{
//         const user = await User.findById(req.params.id)
//         updates.forEach((update)=>{
//             //called for each update
//             //bracket notation for dynamic value
//             user[update] = req.body[update]
//         })
//         await user.save()
//         //second argument: update content
//         //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         //no user
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch (e){
//         //invalidaton
//         res.send(400).send()
//     }
// })
router.get('/update',auth,async(req,res)=>{
    var auth_token= req.cookies.auth_token
    const user=await User.findByToken(auth_token)
    res.render('update_user',{
            name:user[0].name,
            age:user[0].age,
            title:"Update Profile"
    })
})
//update only own profile
router.post('/updateSend', auth, async (req, res) => {
        try {
            var auth_token= req.cookies.auth_token
            const user=await User.findByToken(auth_token)
            User.findOneAndUpdate({_id:user[0]._id},{$set:{name:req.body.name, age:req.body.age}},(err,user)=>{
                res.render('success',{
                    title:'Success',
                    name:'Sarah song',
                    successMessage:'Your profile has been successfully updated'
                })
            })
           
        } catch (e) {
            res.status(400).send(e)
        }
})
//remove own user profile
router.post('/delete',auth, async (req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        //위 세줄과 같은 의미
        await req.user.remove()
        transport.sendMail(cancelMailOption(req.user.email,req.user.name), (err,info)=>{
            if(err){
                console.log("node mailer email error"+err)
            }
        })
        res.render('success',{
            title:'Remove success',
            name:'Sarah song',
            successMessage:'Your profile has been successfully removed'
        })
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})
module.exports = router 