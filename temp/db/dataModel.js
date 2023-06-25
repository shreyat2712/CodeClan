const mongoose =require('mongoose');
const {Schema}=mongoose;

const data=new Schema({
    roomId:String,
    HtmlData:String,
    CssData:String,
    JavaScriptData:String
});

//creating the model of data Schema

const Data=mongoose.model('Data',data);

module.exports=Data;