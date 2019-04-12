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
app.use('/cart', express.static(path.join(__dirname + '/public')))

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
  
  let sql = `select b.title, b.price, c.customerId, ci.bookId, ci.cartType, ci.quantity from Book b, Cart c, CartItem ci where (ci.orderId = c.customerId and ci.bookId = b.bookCode and ci.orderId = 0000)`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }

    res.render('cart', {
      title : results[0].title,
      price : results[0].price,
      bookId : results[0].bookId,
      cartType : results[0].cartType,
      quantity : results[0].quantity});
  });

  console.log("complete cart");
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
  var col = req.body.col;

  let sql = `select B.bookCode, B.title, B.numCopies, A.authorNum,A.authorLast,A.authorFirst,P.publisherCode,P.publisherName,P.city from book B, author A,publisher P, wrote W where (B.publisherCode = P.publisherCode and A.authorNum = W.authorNum and W.bookCode = B.bookCode) and B.title LIKE '%${like}%'`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    

    console.log(results);

    console.log(results[0]);
    res.send(results);
  });
});

//cart stuff

app.post('/cart', function(req, res){

  var like = req.body.like;
  var col = req.body.col;

  let sql = `select b.title, b.price, c.customerId, ci.bookId, ci.cartType, ci.quantity from Book b, Cart c, CartItem ci where (ci.orderId = c.customerId and ci.bookId = b.bookCode and ci.orderId = 0000)`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    
    console.log(results);

    res.send(results);
  console.log("cart post");
  });
});