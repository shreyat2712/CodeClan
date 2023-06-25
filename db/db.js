const express=require('express');
const mongoose =require('mongoose');


async function db() {
  try {
    await mongoose.connect("mongodb+srv://hunter:hunterxhunter@cluster0.twj9eig.mongodb.net/?retryWrites=true&w=majority");
    console.log("Database connected successfully..");
    // mongoose.connection.on('error', (err) => {
    //   console.log('Error connecting to db:', err);
    // });
    
    // mongoose.connection.on('open', () => {
    //   console.log('Connected to db...');
    // });
  } catch(err) {
    console.log(err);
  }
}

module.exports=db
//hunter
// hunterxhunter