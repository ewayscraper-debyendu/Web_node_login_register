require('dotenv').config();
const console = require("console");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const auth = require("./midleware/auth");
const app = express();
require("./db/conn");
const Register = require("./models/registers");
const { cookie } = require('express/lib/response');
const { json } = require("express");
const async = require('hbs/lib/async');

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//console.log(path.join(__dirname, "../public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
//app.set("view engine", partial_path);
app.get("/", (req, res) => {
    //res.send("Helo form test");
    res.render("index");

});
app.get("/register", (req, res) => {
    res.render("register");

});
///create user in database
app.post("/register", async (req, res) => {
    try{
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if(password == confirmpassword || password!=""){
     const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpassword
     })
    // const result = await Register.insertOne({registerEmployee});
    const token = await registerEmployee.generateAuthToken();
   // console.log('the token1'+token);

     //res.cookie("jwt", token);
     //console.log(cookie);
     res.cookie("jwt", token, {
     expires:new Date(Date.now() +30000),
     httpOnly:true
     });

     const register = await registerEmployee.save();
     //console.log('the token2'+register);
     res.status(201).render("index");
    //res.send("password matching");
    }else{
        res.send("password not matching");
    }
    //res.send(req.body.country);
    }catch(error){
        res.status(400).send(error);
    }
});

app.get("/login", (req, res) => {
    res.render("login");

});
app.post("/login", async (req, res) => {
 try{
    const email = req.body.email;
    const password = req.body.password;
    //Register.findOne({email:email});
    const sendEmail = await Register.findOne({email:email});
    const isMatch = await bcrypt.compare(password, sendEmail.password);

    const token = await sendEmail.generateAuthToken();
    //console.log('the token1'+token);
   //const decoded = await jwt.verify(token, 'shhhhh');
   res.cookie("jwt", token, {
    expires:new Date(Date.now() +30000),
    httpOnly:true
    //secure:true
    });

    if(isMatch){
        res.status(201).render("index");
    }else{
        res.send("Invalid login details");
    }
    //res.send(sendEmail);  
}catch(error){
    res.status(400).send("Invalid login details");
}
});

// const jwt = require('jsonwebtoken');
// const async = require("hbs/lib/async");
// const createToken = async() =>{
// const tokenss = await jwt.sign({ _id: '61e933b87cde81154f00a798' }, 'shhhhdhfjhdjsjhfjkshfjkhskjhfkshsh', {
//     expiresIn: '2 seconds'
// });
// console.log(tokenss);
// const userVer = await jwt.verify(tokenss, 'shhhhdhfjhdjsjhfjkshfjkhskjhfkshsh');
// console.log(userVer);
// }
app.get("/secret", auth, (req, res) => {
    res.render("secret");

});
app.get("/logout", auth, async(req, res) => {
    try{
    console.log(req.user);    
  req.user.token = req.user.tokens.filter((currentElement)=>{
   return currentElement.token != req.token
  });  
res.clearCookie("jwt");
console.log("Logout successful");
await req.user.save();
res.render("login");
    }catch(error){
        res.status(401).send(error);
    }
    //res.render("logout");

});
// createToken();
app.listen(port, () => {
    console.log(`Server is running port no ${port}`);
});