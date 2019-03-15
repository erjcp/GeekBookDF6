const express = require('express');
const app = express();
app.set('view engine', 'pug');
var mysql = require("mysql");
app.use(express.static(__dirname + '/public'));

var db = mysql.createConnection({
  host: "localhost",
  user: "website",
  password: "abc123",
  database: "geekbook"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to mySQL server.");
});


app.get('/', (req, res) => {
  res.render('index');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/logout', (req, res) => {
  res.render('logout');
})

app.get('/profile', (req, res) => {
  res.render('profile');
})

app.get('/cart', (req, res) => {
  res.render('cart');
})

app.get('/details', (req, res) => {
  res.render('details');
})

app.listen(5656, () => {
  console.log('Server started on port 5656 ')
})



/*var http = require("http");
var fs = require("fs");
const port = 6117;
var mysql = require("mysql");
var request = require("request");
var Query = "";
var pQuery = "";
var Table = "";
var completeResult = "";
var response;
var con = mysql.createConnection({
  host: "localhost",
  user: "website",
  password: "abc123",
  database: "geekbook"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mySQL server.");
});

request.post(
  "localhost",
  {
    json: { key: "value" }
  },
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response);
    }
  }
);

function getS(str) {
  Table = str.substring(str.indexOf("=") + 1, str.indexOf("&"));
  pQuery = str.substring(str.lastIndexOf("=") + 1);
  Query = pQuery + " " + Table;
  console.log("getS table: " + Table);
  //console.log("getS Query: " + pQuery);
  //console.log("getS Result Query: " + Query);
}

String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
};

http.createServer(function (request,response){
  console.log("url: " + request.url);
  console.log("method: " + request.method);

  let req_url = request.url.toString();

  if (request.method === "POST") {
    let body = "";
    request.on("data", chunk => {
      body += chunk.toString();
      getS(body);
      //console.log(body);
      pQuery = pQuery.replaceAll("~", "=");
      console.log("parsed: " + pQuery);

      con.query(pQuery, function(err, result, fields) {
        if (err) throw err;
        completeResult = result;
        console.log(result);
        globalResponse = response;
      });
      //});
    });
    request.on("end", () => {
      console.log("test");
      setTimeout(function() {
        var JSONx = JSON.stringify(completeResult);
        response.write(JSONx);
        console.log("test2");
        response.end();
        console.log("test3");
      }, 1000);
    });

  } else if (request.url === '/') {
    fs.readFile('./index.html',function(err,data){
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    });
  }
  else if(req_url.endsWith(".css")) {
    let res_url = ".";
    res_url += request.url.toString();
    console.log("res_url = " + res_url);

    fs.readFile(res_url, function(err, data){
      if (err) throw err;
      response.writeHead(200,{'Content-Type': 'text/css'});
      response.write(data);
      response.end();
    })  
  } 
  else if(req_url.endsWith(".html")){
    let res_url = ".";
    res_url += request.url.toString();
    console.log("res_url = " + res_url);

    fs.readFile(res_url, function(err, data){
      if (err) throw err;
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    })  
  } 
}).listen(port); */
