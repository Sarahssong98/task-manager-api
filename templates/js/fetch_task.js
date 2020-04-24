const request=require('request')
const fetch_task = ()=>{
    const url = '/tasks/me'
    request({url,json:true},(error,{body})=>{
        if(error){
            callback('Unable to connect to location services!',undefined);
        }else if(body.length){
            callback('No Task',undefined)
        }else{            
            callback(undefined,
        }
    })
}

module.exports=forecast