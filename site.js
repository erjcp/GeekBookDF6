const express = require('express');
const bodyparser = require('body-parser');
var mysql = require("mysql");
var path = require('path');

//set express
const app = express();
//set pug as view renderer
app.set('view engine', 'pug');

//set the path for static files
app.use(express.static(path.join(__dirname + '/public')));
app.use('/details', express.static(path.join(__dirname + '/public')));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

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
  res.render('index', {
    page: 'browse'
  });
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

app.get('/details/:id', (req, res) => {
  var bookCode = req.params.id;
  bookCode = bookCode.replace(':','');

  let sql = `select B.bookCode, B.title, B.numCopies, A.authorNum, A.authorLast, A.authorFirst, P.publisherCode, P.publisherName from book B, author A,publisher P, wrote W where (B.publisherCode = P.publisherCode and A.authorNum = W.authorNum and W.bookCode = B.bookCode) and B.bookCode = ${bookCode}`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    console.log(results);

    res.render('details', {
      title : results[0].title,
      author : results[0].authorFirst +" "+ results[0].authorLast,
      publisher : results[0].publisherName,
      price : 'test',
      stock : 'test',
      rating : 'test',
      summary : 'publisher code is ' + results[0].publisherCode
    });
  });
  
  console.log("the booKCode is " + bookCode);


})


app.listen(5656, () => {
  console.log('Server started on port 5656 ')
})

app.post('/', function (req, res){
  var like = req.body.like;
  var sort = req.body.col;
  console.log("like is: " + like + " and col is: " + sort);
  let sql = `(SELECT title, authorFirst, authorLast, Publisher.publisherName, numCopies, ROUND(AVG(score),2) as Average
  FROM Book, Wrote, Author, Publisher, Review
  WHERE (Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode AND Review.bookId = Book.bookCode) 
  AND (Book.title LIKE '%${like}%' OR Author.authorLast LIKE '%${like}%' OR Author.authorFirst LIKE '%${like}%' OR genre LIKE '%${like}%' OR publisherName LIKE '%${like}%')
  GROUP BY bookId) ORDER BY ${sort}`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    
    //delete
    console.log(sql);
    console.log(results);

    console.log(results[0]);
    res.send(results);
  });
});



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
