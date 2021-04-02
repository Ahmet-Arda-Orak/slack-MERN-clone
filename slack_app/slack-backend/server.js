import express from "express";
import cors from "cors";
import Pusher from "pusher";
import mongoose from "mongoose";
import mongoData from "./mongoData.js";

//app config
const app = express();
const port = process.env.PORT || 8080

const pusher = new Pusher({
    appId: "1182029",
    key: "190755db351f8ecc6a94",
    secret: "67c512868e9c5b6d7451",
    cluster: "eu",
    useTLS: true
});
  

//middlewares
app.use(express.json());
app.use(cors());

//db config
const mongoURI ="YOUR CLUSTER LİNK";

mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true    
})

mongoose.connection.once("open",()=>{
    console.log("DB Connected")

    const changeStream = mongoose.connection.collection("conversations").watch()

    changeStream.on("change",(change,err)=>{
        if(change.operationType === "insert"){
            pusher.trigger("channels", "newChannel",{
                "change":change
            });
        }else if(change.operationType === "update") {
            pusher.trigger("conversation", "newMessage", {
                "change": change
              });
        }else{
            console.log("error trigering Pusher",err)
        }
    })
})

//api routes
app.get("/",(req,res)=>{
    res.status(200).send("Slack Api")
})

app.post("/new/channel",(req,res)=>{
    const dbData = req.body;
    mongoData.create(dbData,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else(
            res.status(201).send(data)
        )
    })
})

app.post("/new/message",(req,res)=>{
    const id = req.query.id
    const newMessage = req.body

    mongoData.updateOne(
        {_id: id},
        {$push:{ conversation: newMessage}},
        (err,data)=>{
            if(err){
                res.status(500).send(err)
            }else{
                res.status(201).send(data)
            }
        }
    )
})

app.get("/get/channelList", (req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            let channels = [];
            
            data.map((channelData) =>{
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                
                channels.push(channelInfo);
            })

            res.status(200).send(data)
        }
    })
})

app.get("/get/conversation",(req,res)=>{
    const id = req.query.id

    mongoData.find({_id: id},(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else {
            res.status(200).send(data)
        }
    })
})

//listen
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
