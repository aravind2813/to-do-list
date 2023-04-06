const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date=require(__dirname + "/datefn.js");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://aravindben562:yw36giVjJMueWMGZ@cluster0.xlxjmga.mongodb.net/todoListDB");

const itemSchema=new mongoose.Schema({
  name: String
});

const task = mongoose.model("item",itemSchema);

const customListSchema = new mongoose.Schema({
  name:String,
  items:[itemSchema]
});

const customList = mongoose.model("list",customListSchema);

const arr=[{name:"Welcome to the App"},{name:"Hit + to add new task"},{name:"Tick to remove completed tasks"}];


app.get("/",function(req,res){
let day=date.dateFunction();
  task.find({},function(err,docs){
    if(docs.length===0){
      task.insertMany(arr,function(arr,docs){});
      res.redirect("/");
    }
    else{
      res.render("index",{HeaderContent:"Today",itemList:docs});
      };
    });
});

app.get("/:page",function(req,res){
  const pageName=_.capitalize(req.params.page);

  customList.findOne({name:pageName},function(err,docs){
    if(docs==null){
        const newList= new customList({name:pageName,items:arr});
        newList.save();
        res.redirect("/"+pageName);
    }
    else{
    res.render("index",{HeaderContent:docs.name,itemList:docs.items});
    }
  });
});

app.get("/about",function(req,res){
  res.render("about");
});

app.post("/",function(req,res){
  var item = req.body.todo;
  var head = req.body.submit;
  const val= new task({name:item});
  if(head=="Today"){
    val.save();
    res.redirect("/");
  }
  else{
    customList.findOne({name:head},function(err,docs){
      docs.items.push(val);
      docs.save();
      res.redirect("/" + head);
    });
  }
});


app.post("/remove",function(req,res){
  const idVal = req.body.checkbox;
  const head = req.body.header;
  if(head=="Today"){
    task.findByIdAndRemove(idVal,function(err){
      if(err){
        console.log(err);
      }
    });
    res.redirect("/");
  }
  else{
    customList.findOneAndUpdate({name:head},{$pull:{items:{_id:idVal}}},function(docs){

    });
    res.redirect("/"+head);
  }

});

app.listen(process.env.PORT || 3000,function(){
  console.log("Running Successfully!");
});
