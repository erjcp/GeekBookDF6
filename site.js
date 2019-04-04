const express = require("express"); //---------------------------CHECKED
//set express
const app = express(); //---------------------------CHECKED
var mysql = require("mysql"); //---------------------------CHECKED
var config = require("./config");

var htmlcontroller = require("./controllers/htmlController"); //---CHECKED

var port = process.env.port || 3007; //---------------------------CHECKED
// app.use('/assets', express.static(__dirname + '/public')); // THIS IS FOR CSS CONNECTION

//set pug as view renderer
app.set("view engine", "pug"); //-------------------------------CHECKED

const bodyparser = require("body-parser");

var path = require("path");
require("babel-register")({
  presets: ["env"]
});

// var config = require("./config");

//set the path for static files
app.use(express.static(path.join(__dirname + "/public")));
app.use("/details", express.static(path.join(__dirname + "/public")));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var db = mysql.createConnection({
  host: "localhost",
  user: "website",
  password: "abc123",
  database: "geekbook"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to mySQL server.");
});

app.get("/", (req, res) => {
  res.render("index", {
    page: "browse"
  });
});

app.get("/login", (req, res) => {
  console.log("Login Page!");
  res.render("login");
});

app.get("/editaccount", (req, res) => {
  res.render("editaccount");
});

app.get("/register", (req, res) => {
  console.log("Im Here! Register Page");
  res.render("register");
});
app.get("/shippingAddress", (req, res) => {
  res.render("shippingAddress");
});

app.get("/logout", (req, res) => {
  res.render("logout");
});

app.get("/ccform", (req, res) => {
  res.render("ccform");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});
// REGISTER PAGE-------------------------------------------------------------------REGISTER PAGE
app.post("/register/", (req, res) =>
{
    const { userName, firstName, lastName, nickName, email, password, address, city, zip, state ,cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body

                //let bookCode;
                let sqlAccount =  `insert into geekbook.Accounts(userName, email, pass)   values('${userName}','${email}','${password}')`; 
              
                db.query(sqlAccount,function(err,result){
                if(err ) throw    console.log('An ERROR HAS OCCURED,INSERTING ACCOUNTS----- the following is the error --' + err+'\n\n');
                console.log("1 Account Information record inserted");
              });

              let sqlCustomer =  `insert into geekbook.Customer( CustId, firstName, lastName, nickName)   values( last_insert_id()     ,' ${firstName}','${lastName}','${nickName}')`; 
              db.query(sqlCustomer,function(err,result){
                if(err ) throw    console.log('An ERROR HAS occurred, inserting customer , the following is the error --' + err+'\n\n');
                console.log("1 Customer address record inserted");
              });

                let sqlBillingAddress =  `insert into geekbook.BillingAddress(billingId, address, city, zip, state   ) 
                                                values(last_insert_id() ,'   ${address}','${city}','${zip}','${state}')`; 
                db.query(sqlBillingAddress,function(err,result){
                          if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
                          console.log("1 billing address record inserted");
                        });
     
        let sqlCreditCard =  `insert into geekbook.card (cardId,             cardCustomerName,         cardNum,       securityNum,     expMonth,           expYear) 
                                                  values(last_insert_id() ,'   ${cardHolderfullName}','${cardNumber}','${cvCode}','    ${expityMonth}','   ${expityYear}' )`; 
      db.query(sqlCreditCard,function(err,result){
        if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
        console.log("1 Credit card info record inserted");
      });
        res.end();
});
//LOGIN PAGE -------------------------------------------------------------------------------------LOGIN PAGE
app.post("/login", (req, res) => 
{
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password)  {
      res.render('login');
      return;
    }
    let userID = "";

    let sqlQueryString = `SELECT * FROM geekbook.Accounts WHERE email = ${email} AND pass = ${password}`;
    db.query(sqlQueryString,function(err,result){
      if(err ) throw    console.log('User Not Found with those creditials :(' + err+'\n\n');
      console.log("Account Information Found :D : -> User: " + result);
    });

    config.userID = userID;
    res.end();
});


//--------------------------------------------------------------------------SHIPPING ADDRESSS
app.post("/shippingAddress/", (req, res) =>
{
    const {  address, city, zip, state } = req.body
      
      let sqlShippingAddress =  `insert into geekbook.ShippingAddress(shippingCustomerID, address, city, zip, state   ) values(last_insert_id() ,'${address}','${city}','${zip}','${state}')`; 
    
      db.query(sqlShippingAddress,function(err,result){
        if(err ) throw    console.log('An ERROR HAS OCCURED, the following is the error --' + err+'\n\n');
        console.log("1 a SHIPPING ADDRESS ----  record inserted");
      });
        res.end();
});


//------------------------------------------------------------------------------ ADD NEW CREDIT CARD 
app.post("/ccform/", (req, res) =>
{
    const { cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body
      let sqlCreditCard =  `insert into geekbook.card (    cardCustomerID,             cardCustomerName,         cardNum,       securityNum,     expMonth,           expYear) 
                                                values(    last_insert_id(),'   ${cardHolderfullName}','${cardNumber}','${cvCode}','    ${expityMonth}','   ${expityYear}' )`; 
     db.query(sqlCreditCard,function(err,result){
        if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
        console.log("1 Credit card info record inserted");
      });
        res.end();
});




























//---------------------------------------------------------
//DETAILS PAGE

app.get("/details/:id", (req, res) => {
  var bookCode = req.params.id;
  bookCode = bookCode.replace(":", "");

  let sql = `select B.bookCode, B.title, B.numCopies, A.authorNum, A.authorLast, A.authorFirst, P.publisherCode, P.publisherName from book B, author A,publisher P, wrote W where (B.publisherCode = P.publisherCode and A.authorNum = W.authorNum and W.bookCode = B.bookCode) and B.bookCode = ${bookCode}`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
    }
    console.log(results);

    res.render("details", {
      title: results[0].title,
      author: results[0].authorFirst + " " + results[0].authorLast,
      publisher: results[0].publisherName,
      price: "test",
      stock: "test",
      rating: "test",
      summary: "publisher code is " + results[0].publisherCode
    });
  });

  console.log("the booKCode is " + bookCode);
});

htmlcontroller(app);

app.listen(5656, () => {
  console.log("Server started on port 5656 ");
});












//-------------------------------------------
app.post("/", function(req, res) {
  var like = req.body.like;
  var sort = req.body.col;
  console.log("like is: " + like + " and col is: " + sort);

  let sql = `SELECT title, authorFirst, authorLast, genre, Publisher.publisherName, price, ROUND(AVG(score),1) as Average, numCopies
  FROM Book, Wrote, Author, Publisher, Review
  WHERE (Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode AND Review.bookId = Book.bookCode)
  AND (Book.title LIKE '%${like}%' OR Author.authorLast LIKE '%${like}%' OR Author.authorFirst LIKE '%${like}%' OR genre LIKE '%${like}%' OR publisherName LIKE '%${like}%')
  GROUP BY Book.bookCode
  UNION
  SELECT title, authorFirst, authorLast, genre, Publisher.publisherName, price, NULL as Average, numCopies
  FROM Book, Wrote, Author, Publisher
  WHERE NOT exists (SELECT * FROM Review WHERE Book.bookCode = bookId) 
  AND (Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode)
  AND (Book.title LIKE '%${like}%' OR Author.authorLast LIKE '%${like}%' OR Author.authorFirst LIKE '%${like}%' OR genre LIKE '%${like}%' OR publisherName LIKE '%${like}%')
  ORDER BY ${sort};`;

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





























