const jwt = require('jsonwebtoken')
const User = require('../models/user')
//set up authentication middleware

const auth = async (req,res,next)=>{
    //validates the user
   try{
       console.log(req.body)
       const token = req.cookies['auth_token']
        //ensure token is valid: use the secret message
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //is the token in the token array? (= logined?)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        //give the router handler the fetched user
        req.token = token 
        req.user = user 
        next()
    }catch(e){
    res.status(401).send({error:'Please Login First'})
   }
}

module.exports = auth 