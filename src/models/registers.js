const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const async = require("hbs/lib/async");
const res = require("express/lib/response");

const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },
    country : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    },
    tokens:[{
     token : {
        type:String,
        required:true
        }
    }]

});
employeeSchema.methods.generateAuthToken = async function(){
    try{
//console.log(this._id);
const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
this.tokens = this.tokens.concat({token:token});
await this.save();
//console.log(token);
return token;
    }catch(error){
res.send(error);
console.log(error);
    }
}
employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
       // const passwordHash = await bcrypt.hash(password, 10);
        //console.log(`the current password ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
        //console.log(`the current password ${this.password}`);

        //this.confirmpassword = undefined;
    }
        next();

});

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;