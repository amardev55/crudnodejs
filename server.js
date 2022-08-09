const express = require("express");
const app= express();
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();

app.set("view engine", "ejs")

const connection = require("./config/db");
const { query } = require("express");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res) =>{
    res.redirect("/create.html")
});

app.get("/delete-data",(req,res)=>{ 
  const deleteQuery = "delete from youtube_table where id=?";
  connection.query(deleteQuery, [req.query.id],(err,rows) =>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/data");
    }
  });
});




app.get("/data",(req,res) =>{
    connection.query("select * from youtube_table",(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("read.ejs",{rows});
        }

    });
})


app.get("/update-data",(req,res )=>{
connection.query("select * from youtube_table where id=?", 
[req.query.id], (err,eachRow)=>{
  if(err){
    console.log(err);

  }

  else{
    result = JSON.parse(JSON.stringify(eachRow[0]));
    console.log(result);
    res.render("edit.ejs", {result} );
  }
});
});

// update
app.post("/final-update",(req,res)=>{
  
  const id = req.body.hidden_id;
  const name = req.body.name;
  const email = req.body.email;
  const updateQuery = "update youtube_table set name=?, email=? where id=?";

  console.log("id.....", id)
  try{
    connection.query(
      updateQuery, [name, email,id],
         (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            
            res.redirect("/data");  
          }
        }
      );
    }
    catch(err){
    console.log(err);
    }
 });
 //create
app.post("/create",(req,res)=>{
 console.log(req.body);
 const name = req.body.name;
 const email = req.body.email;

try{
connection.query(
    "INSERT into youtube_table (name,email) values(?,?)", 
    [name, email],
     (err, result) => {
      if (err) {
        console.log(err);
      } else {
        
        res.redirect("/data");  
      }
    }
  );
}
catch(err){
console.log(err);
}


});

app.listen(process.env.PORT || 4000, (error) =>{
    if (error) throw error;
    console.log(`server running on ${process.env.PORT}`)
});


