const  mongoose  = require("mongoose");

var mongoURL = "mongodb+srv://akashsingh8171846762:Ak672002@cluster0.owxwirz.mongodb.net/food_order"


mongoose.connect(mongoURL , {useUnifiedTopology:true , useNewUrlParser:true})

var db = mongoose.connection;

db.on('connected',()=>{
console.log('MongoDB Connection Successfully Connected');
})

db.on('error', ()=>{
console.log('MongoDB Connection Failed');
})


module.exports = mongoose;