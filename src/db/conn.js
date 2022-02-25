
// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/youtubeRegistration", {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then( () => {
//   console.log("Connection Succesfull");
// }).catch((err) => {
//     console.log(err);
// })

const mongoose = require('mongoose');
////database connection 
mongoose.connect('mongodb://127.0.0.1:27017/youtubeRegistration', {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log("connection successfull..."))
.catch((err) => console.log(err));