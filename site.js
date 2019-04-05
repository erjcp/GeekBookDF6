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
  var cartList = [];
  var saveLaterList = [];

  let sql = `select b.title, b.price, c.customerId, ci.cartType from Book b, Cart c, CartItem ci where (ci.orderId = c.customerId and ci.bookId = b.bookCode)`;
  let query = db.query(sql, (err, rows, results) => {
    if (err) {
      console.log(sql);
    }
    for(var i = 0; i < rows.length; i++){
      var item = {
      title : rows[i].title,
      price : rows[i].price,
      customerId : rows[i].customerId,
      cartType : rows[i].cartType
      }
      if(item.cartType == 1){
        cartList.push(item);
      }
      else{saveLaterList.push(item);}
        
      console.log(item);
    }
    res.render('cart', {"cartList": cartList, "saveLaterList" : saveLaterList});
  });
  for(var j = 0; j < cartList; j++){
    console.log(cartList[i]);
  }
})

app.get('/details/:id', (req, res) => {
  var bookCode = req.params.id;
  bookCode = bookCode.replace(':','');

  let sql = `SELECT title, authorFirst, authorLast, genre, publisherName, price, numCopies, summary FROM Book, Wrote, Author, Publisher WHERE Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode AND Book.bookCode = ${bookCode}`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    console.log(results);

    res.render('details', {
      title : results[0].title,
      author : results[0].authorFirst +" "+ results[0].authorLast,
      publisher : results[0].publisherName,
      price : results[0].price,
      stock : results[0].numCopies,
      rating : 'test',
      summary : results[0].summary
    });
  });
})

app.post('/details/:id', function (req, res){
  var id = req.params.id;
  var isInsert = (request = "insert") ? true : false;
  id = id.replace(':','');
  
  console.log("this is the book id on post request " +id);
  let sql = `SELECT title, nickName, reviewDate, score, heading, review FROM Book, Customer, Review WHERE bookCode = ${id} AND bookCode = bookId AND Review.customerId = id ORDER BY title DESC`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    console.log(results);
    //res.send(results);
  });
});


app.post('/', function (req, res){
  var like = req.body.like;
  var col = req.body.col;

  let sql = `select B.bookCode, B.title, B.numCopies, A.authorNum,A.authorLast,A.authorFirst,P.publisherCode,P.publisherName,P.city from book B, author A,publisher P, wrote W where (B.publisherCode = P.publisherCode and A.authorNum = W.authorNum and W.bookCode = B.bookCode) and B.title LIKE '%${like}%'`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    console.log(results);
    res.send(results);
  });
});

app.listen(5656, () => {
  console.log('Server started on port 5656 ')
})