'use strict'

const express=require('express')
const bodyParser=require('body-parser')
const request=require('request')

const app=express()

app.set('port',(process.env.PORT||5000))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',function(req,res){
	res.send("Hi i am chatboting")
})
app.get('/webhook/',function(req,res){
	if(req.query['hub.verify_token']=="sandeep"){
		res.send(req.query['hub.challenge'])
	}
	res.send("wrong token")
})
let http=require('http')
setInterval(function(){
	http.get("http://fathomless-tundra-80121.herokuapp.com");},300000);

app.post('/webhook/',function(req,res){
	let messaging_events=req.body.entry[0].messaging
	for(let i=0;i<messaging_events.length;i++){
		let event=messaging_events[i]
		let sender=event.sender.id
		if(event.message &&event.message.text){
			let text=event.message.text
			//decideMessage(sender,text)
			sendText(sender,"Text echo: "+text.substring(0,100))
		}
	}
	res.sendStatus(200)
})


let token="EAAEMg6XxI1wBAKOAr8yEEBeuBtg94qTK14oupHxZBOTddqUHev8IPmdYPKHeQ2YBZCn2UcFgyg7zWwUGWDkONRPduZBfEo7JguCxCCuSE2YIX0iooghWWKSMEznuQW3Em2n9gDCQRAYnMfHISggyYbpNSXohHqDp8lipeTwJIYrqAfZABmjuzyID7j0VvLEZD"


function sendText(sender,text){
	let messageData={text:text}
	request({
		url:"https://graph.facebook.com/v2.6/me/messages",
		qs:{access_token:token},
		method:"POST",
		json:{
			recipient:{id:sender},
			message:messageData
		}
	},function(error,response,body){
		if(error){
			console.log("sending error")
		}
		else if(response.body.error){
			console.log("response body errpr")
		}
	})
}

app.listen(app.get('port'),function(){
console.log("i am running")
})