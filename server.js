const express=require("express")
const db=require('./db/db.js');
const Data=require('./db/dataModel.js')
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")
const port = process.env.PORT || 3000;

const server=http.createServer(app)


//connecting to database
db();
 
const io=new Server(server)
app.use(express.static(path.resolve("")))

const connectedClients = new Map();

io.on("connection", (socket)=>{
    console.log("connected to socket .")
    socket.on("join-room",async (room)=>{

        //Checking whether this room id is already present in database or not
        // console.log(room)
        const temp=await Data.findOne({roomId:room});
        console.log(temp);
        socket.join(room);
        connectedClients.set(socket.id, room);    
        console.log("room : "+room);
        const roomy = connectedClients.get(socket.id);
        io.to(roomy).emit("join-room",room);
        if(temp === null)
        {
            console.log('Room Id does not exist in database');
        }
        else
        {   
            console.log("RoomId is Present in database ");
            // console.log(temp);
            io.to(temp.roomId).emit("coding",{html:temp.HtmlData, css:temp.CssData, js:temp.JavaScriptData})
        }
    })
    socket.on("coding",(e)=>{
        const room = connectedClients.get(socket.id);
        console.log(e)
        io.to(room).emit("coding",e);
    })
    socket.on("saveRoom",async (e)=>{
        //check whether this room id already exist if exists then overwrite the data else create a new document in db and insert data there
        // const room=e.room;
        // console.log(e.room)
        const tmp=await Data.findOne({roomId:e.room});
        console.log(tmp);
        //This id is not present already so create a new document and insert the data
        if(tmp === null)
        {
            try{
                await Data.create({roomId:e.room,HtmlData:e.html,CssData:e.css,JavaScriptData:e.js});
                console.log("File Saved in Db..");
            }catch(err){
                console.log("data not inserted in db :",err);
            }
        }
        else{//If data already exists then just update it
            try{
                await Data.updateOne({roomId:e.room},{HtmlData:e.html,CssData:e.css,JavaScriptData:e.js});
                console.log("File updated !");
            }catch(err){
                console.log("Unable to update the file : ",err);
            } 
        }
        console.log(e);
    })
})

app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

server.listen(port,()=>{
    console.log("port connected to 3000")
})