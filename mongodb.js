// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
//destructuring 3 lines above
const{MongoClient, ObjectID }=require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName='task-manager'

//  //making own objectID
//connecting to the database
MongoClient.connect(connectionURL,{useNewUrlParser: true },(error,client)=>{
    //callback function is called when connected to the database
    if(error){
        return console.log('Unable to connect to database!')
    }
    const db = client.db(databaseName);//gives database reference to use
   //inesting one documentation 
    // db.collection('users').insertOne({
    //     //insert data into the users collection
    //     name:'Jihyun',
    //     age:51
    // },(error,result)=>{
    //     //operation complete then callback function is executed
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })
    //inserting several documentations
//     db.collection('users').insertMany([
//         {
//             name:'Jen',
//             age:28
//         },{
//             name: 'Emma',
//             age:23
//         }
//     ],(error,result)=>{
//         if(error){
//             return console.log('Unable to insert documents!')
//         }
//         console.log(result.ops)
//     })
// })
// db.collection('tasks').insertMany([
//     {
//         description:'Jogging',
//         completed:true
//     },{
//         description:'Reading',
//         completed:false
//     },{
//         description:'Studying',
//         completed:false
//     },
// ],(error,result)=>{
//     if(error){
//         return console.log('Unable to insert tasks!')
//     }
//     console.log(result.ops)
// })
// })
    // db.collection('users').findOne({name:'Jen'},(error,user)=>{
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({age:23}).toArray((error,users)=>{
    //     console.log(users)
    // })
    // db.collection('users').find({age:23}).count((error,count)=>{
    //     console.log(count)
    // })
    // db.collection('tasks').findOne({_id:new ObjectID("5e8fd978c7a4cd0a401afd0b")},(error,user)=>{
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })
    // db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
    //     console.log(tasks)
    // })
    //updating data
//    const updatePromise= db.collection('users').updateOne({
//         _id: new ObjectID("5e8fd5576718d02444a00ef5")
//     },{
//         $inc:{
//            age:1
//         }
//     }).then((result)=>{//when updated success&fail : promise
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error)
//     })
//update
//     db.collection('tasks').updateMany({
//         completed:false
//     },{
//         $set:{
//             completed:true
//         }
//     }).then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error)
//     })
    // db.collection('users').deleteMany({
    //     age:23
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{ 
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description:"Jogging"
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})