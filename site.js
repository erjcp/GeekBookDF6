const express = require('express');

//set express
const app = express();
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
var mysql = require("mysql");
var path = require('path');

var config = require("./config");
var expressValidator = require('express-validator');
var expressSession = require('express-session');


// var path = require("path");
// require("babel-register")({
//   presets: ["env"]
// });



// jorge stuff
var crypto = require('crypto');
var rand = require('csprng');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var htmlcontroller = require("./controllers/htmlController"); 

var port = process.env.port || 3007; 

/*
var path = require("path");
require("babel-register")({
  presets: ["env"]
});
*/

//setting up cookies
app.use(cookieparser());

//app.use(session({secret: "DrAgOnFoRcE"}));

//set pug as view renderer
app.set('view engine', 'pug');

//set the path for static files
app.use(express.static(path.join(__dirname + '/public')));
app.use('/details', express.static(path.join(__dirname + '/public')));
app.use('/cart', express.static(path.join(__dirname + '/public')));
app.use('/register', express.static(path.join(__dirname + '/public')));
app.use('/login', express.static(path.join(__dirname + '/public')));

app.use(bodyparser.urlencoded({ extended: false }));

//jorge line?
app.use(expressValidator());

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


app.get('/author', (req, res) => {
  res.render('index', {
    page: 'browse'
  });
})

app.get("/login", (req, res) => {
  console.log("Login Page!");
  res.render("login");
});

/* OLD LOGIN I GUESS
app.post("/login", (req, res) => 
{
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password)  {
      res.render('login');
      return;
    }
    let userID = "";

    let sqlQueryString = `SELECT * FROM geekbook.Accounts WHERE email = '${email}' AND pass = '${password}'`;
    console.log(sqlQueryString);
    db.query(sqlQueryString,function(err,result){
      if(err ) throw    console.log('User Not Found with those creditials :(' + err+'\n\n');
      console.log("Account Information Found: -> User: " + result);
    });

    config.userID = userID;
    req.session.email = email;
    res.cookie('session', email);
    res.render('index');
    
    res.end();
});
*/ 

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

app.get('/logout', (req, res) => {
  res.render('index');
})

/* OLD LOGOUT
app.post('/logout', (req, res) => {
  console.log('yo');  
  if (req.session.email){
      console.log("wow");
      delete req.session.email;
    }
})
*/ 

app.get("/ccform", (req, res) => {
  res.render("ccform");
});

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

  let sql = `SELECT A.authorFirst, A.authorLast, A.bio, B.title, B.Genre, B.price, B.numCopies, B.cover, B.summary, P.publisherName, R.average
  FROM Book as B
  LEFT JOIN Wrote as W ON W.bookCode=B.bookCode
  LEFT JOIN Author as A ON A.authorNum=W.authorNum
  LEFT JOIN Publisher as P ON P.publisherCode = B.publisherCode
  LEFT JOIN (
    SELECT bookId as bookCode, ROUND(AVG(score),1) as average
    FROM Review
      GROUP BY bookId
    ) as R
  ON R.bookCode = B.bookCode
  WHERE B.bookCode = '${bookCode}'`;
  console.log("HEY IM HERE");

  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(sql);
      console.log(err);
    }
    console.log(sql);
    console.log(results);

    res.render('details', {
      title : results[0].title,
      average : results[0].average,
      author : results[0].authorFirst +" "+ results[0].authorLast,
      publisher : results[0].publisherName,
      price : results[0].price,
      stock : results[0].numCopies,
      summary : results[0].summary,
      bio : results[0].bio,
      cover : results[0].cover
    });
    
  });
})

const INSERT = "1";
const SELECT = "2";
const UPDATEHR = "3";
const UPDATES = "4";
const UPDATEHSR = "5";
const ERROR = "-1";

app.post('/details/:id', function (req, res){
  console.log("HERE! req: ");
  var requestType = req.body.request;
  var heading, score, customerId, date, review;
  var sql;
  
  var bookCode = req.params.id;
  bookCode = bookCode.replace(':','');

  heading = req.body.heading;
  score = req.body.score;
  review = req.body.review;
  customerId = req.body.customerId;
  date = req.body.date;
  //console.log("HERE! req: "+requestType);

  switch(requestType) {
    case INSERT:
      // INSERTS
      if(score == ""){
        sql = `INSERT INTO Review (bookId, customerId, heading, review, reviewDate) VALUES ('${bookCode}' ,'${customerId}', '${heading}', '${review}', '${date}')`;
      }else if(heading ==""){
        sql = `INSERT INTO Review (bookId, customerId, score, reviewDate) VALUES ('${bookCode}' ,'${customerId}', '${score}', '${date}')`;
      }else{
        sql = `INSERT INTO Review (bookId, customerId, score, heading, review, reviewDate) VALUES ('${bookCode}' ,'${customerId}', '${score}', '${heading}', '${review}', '${date}')`;
      }
      
      break;
    case SELECT:
      // SELECTS ALL REVIEWS AND VIEWING INFO
      sql = `SELECT title, nickName, reviewDate, score, heading, review, customerId FROM Book, Customer, Review WHERE bookCode = ${bookCode} AND bookCode = bookId AND Review.customerId = CustId ORDER BY reviewDate ASC`;
      break;
      case UPDATEHR:
      // UPDATED HEADING AND REVIEW
      sql = `UPDATE Review SET heading = '${heading}', review= '${review}', reviewDate= '${date}' WHERE customerId = '${customerId}' AND bookId = '${bookCode}'`;
      break;
    case UPDATES:
      // code block
      sql = `UPDATE Review SET score= '${score}', reviewDate= '${date}' WHERE customerId = '${customerId}' AND bookId = '${bookCode}'`;
      break;
    case UPDATEHSR:
      // code block
      sql = `UPDATE Review SET heading = '${heading}', review= '${review}', score= '${score}', reviewDate= '${date}' WHERE customerId = '${customerId}' AND bookId = '${bookCode}'`;
      break;
    default:
      // code block
      sql = ``;
  }

 
/*
  console.log("this is the book id on post request " + bookCode);
  if (isInsert){
    sql = `INSERT INTO Review VALUES ('${bookCode}' ,'${customerId}', '${score}', '${heading}', '${review}', '${date}')`;
  }else{
    sql = `SELECT title, nickName, reviewDate, score, heading, review, customerId FROM Book, Customer, Review WHERE bookCode = ${bookCode} AND bookCode = bookId AND Review.customerId = CustId ORDER BY reviewDate ASC`;
  }
  */
  
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(err)
      console.log(sql);
      res.send(err);
    }
    console.log(sql);
    console.log(results);
    res.send(results);
  });

});


app.post('/', function (req, res){
  var like = req.body.like;
  var sort = req.body.col;
  var best = req.body.id;
  console.log("like is: " + like + " and col is: " + sort);
  let sql = `SELECT B.bookCode, B.title, A.authorFirst, A.authorLast, B.Genre, B.price, B.price, B.numCopies, B.bookCode, B.pubDate, B.best, B.cover, P.publisherName, R.average
  FROM Book as B
  LEFT JOIN Wrote as W ON W.bookCode=B.bookCode
  LEFT JOIN Author as A ON A.authorNum=W.authorNum
  LEFT JOIN Publisher as P ON P.publisherCode = B.publisherCode
  LEFT JOIN (
    SELECT bookId as bookCode, ROUND(AVG(score),1) as average
    FROM Review
      GROUP BY bookId
    ) as R
  ON R.bookCode = B.bookCode
  WHERE (B.title LIKE '%${like}%' OR A.authorLast LIKE '%${like}%' OR A.authorFirst LIKE '%${like}%' OR B.genre LIKE '%${like}%' OR P.publisherName LIKE '%${like}%')
  ORDER BY ${sort}`;
/*
  let sql = `SELECT title, authorFirst, authorLast, genre, Publisher.publisherName, price, ROUND(AVG(score),1) as Average, numCopies, Book.bookCode, pubDate, best, cover
  FROM Book, Wrote, Author, Publisher, Review
  WHERE (Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode AND Review.bookId = Book.bookCode ${best})
  AND (Book.title LIKE '%${like}%' OR Author.authorLast LIKE '%${like}%' OR Author.authorFirst LIKE '%${like}%' OR genre LIKE '%${like}%' OR publisherName LIKE '%${like}%')
  GROUP BY Book.bookCode
  UNION
  SELECT title, authorFirst, authorLast, genre, Publisher.publisherName, price, NULL as Average, numCopies, Book.bookCode, pubDate, best, cover
  FROM Book, Wrote, Author, Publisher
  WHERE NOT exists (SELECT * FROM Review WHERE Book.bookCode = bookId) 
  AND (Book.bookCode = Wrote.bookCode AND Author.authorNum = Wrote.authorNum AND Book.publisherCode = Publisher.publisherCode ${best})
  AND (Book.title LIKE '%${like}%' OR Author.authorLast LIKE '%${like}%' OR Author.authorFirst LIKE '%${like}%' OR genre LIKE '%${like}%' OR publisherName LIKE '%${like}%')
  ORDER BY ${sort}`;*/
  
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      console.log(sql);
    }
    
    //delete
    console.log(sql);
    console.log(results);

    console.log(results[0]);
    res.send(results);
  });
});


app.listen(5656, () => {
  console.log('Server started on port 5656 ')
})

//LOGIN PAGE --------------------------------------------------LOGIN PAGE-----------------------------------LOGIN PAGE

app.post("/login", (req, res) => {
   
  console.log("login POST");
  const { email, password } = req.body

  if (!email || !password)  {
    res.render('login');
    return;
  } 

  let userQuery = `SELECT * FROM geekbook.Accounts WHERE email = '${email}'`;


  // Returns user or error
  // User can be empty, checkig below
  db.query( userQuery, function (err, user){
        // Maybe render an Error page ?
    if(err) res.render('login')
    // Check if a user got sent back
    // SQL return { user: [] } when no user was found
    if(user.length > 0) {
      console.log("Account Information Found :D : -> User: " + user[0].email);

      console.log(user[0].pass);

      const passwordHash = user[0].pass;

      const hasCorrectPass = bcrypt.compareSync(password, passwordHash)

     if (hasCorrectPass){
      console.log({ hasCorrectPass })
      res.send({ data: { email: user[0].email, id: user[0].id }})
     } else{
      console.log({ hasCorrectPass })
      res.render('login')
     }
    }
  });
})



/*
app.post('/user/create', function (req, res) {

bcrypt.hash(req.body.passwordsignup, saltRounds, function (err,   hash) {
//db.User.create({
 name: req.body.usernamesignup,
 email: req.body.emailsignup,
 password: hash
 }).then(function(data) {
  if (data) {
  res.redirect('/home');
  }
});
});
});
*/




// REGISTER PAGE-------------------------------------------------------------------REGISTER PAGE
app.post("/register/", function(req, res) {


  const { userName, firstName, lastName, nickName, email, password,confirmationpassword, address, city, zip, state ,cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body


  console.log({password})
                                                    /*
                                                        if (password != confirmationpassword) return res.end();
                                                        console.log("passwords entered were not equal") 
                                                        */
                                                    //   var temp = rand(160, 36);  // I AM THE SALT!!!! 
                                                    /*
                                                        var newpass = temp + password;
                                                        var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
                                                        console.log(hashed_password);
                                                        */
                                                    // Encrypt Password
                                                    //-------------------------- validationof both input textboxes of password

 /*
  if (password != confirmationpassword) {
    return res.end();
    //res.render('/register')
  
  }
  else
  {*/

    // console.log("About to go into the bcript---- \n\n")
    // console.log(bcrypt)
    // console.log("\n\n")

    const hash = bcrypt.hashSync(password, saltRounds)

    

            // bcrypt.hash(password, saltRounds, function(err, hash) {

            //   console.log("Inside ---- the bcript\n\n")
            //         // Store hash in your password DB.
            //               let sqlAccount =  `insert into geekbook.Accounts(userName, email, pass)   values('${userName}','${email}','${password}')`; 
                                                    
            //                   db.query(sqlAccount,function(err,result){
            //                   if(err ) throw    console.log('An ERROR HAS OCCURED,INSERTING ACCOUNTS----- the following is the error --' + err+'\n\n');
            //                   console.log("1 Account Information record inserted");
            //                 });
            //       })
   //   }

 

   
      let sqlAccount =  `insert into geekbook.Accounts(userName, email, pass)   values('${userName}','${email}','${hash}')`; 
                                                    
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








//------------ EDIT--------------- EDIT   EDIT     EDIT         EDIT        EDIT    PROFILE PAGE-------------------------------------------------------------------EDIT PROFILE PAGE

app.post( "/editingaccount" , (req, res) =>
{
  const { token, userName, firstName, lastName, nickName, email, password, address, city, zip, state } = req.body

  let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;
 
  db.query(getUserId , (error, result) => {
    if(error) throw console.log('Error:' + error);

    const userId = result[0].id;
    console.log({ userId })

    const updateCustomer =  `UPDATE   geekbook.Customer
                              SET       firstName = '${firstName}', 
                                        lastName  = '${lastName}',  
                                        nickName  = '${nickName}'
                              WHERE   CustId  = '${userId}'`;
    
    const updateBillingAddress = `UPDATE  geekbook.BillingAddress
                              SET     address =  '${address}',
                                      city =  '${city}',  
                                      zip  =  '${zip}',
                                      state  =  '${state}'
                              WHERE  billingId =  '${userId}'`;

    const updateAccount =   `UPDATE   geekbook.Accounts
                              SET       userName = '${userName}',
                                        email = '${email}',
                                        pass =  '${password}'
                              WHERE id = '${userId}'`;

    db.query(updateBillingAddress, (error, result) => {
      if(error) console.log("Error updating billing address: "+ error)
      if(!error) console.log('Updated Billing Address.')
    })

    db.query(updateCustomer, (error, result) => {
      if(error) console.log("Error updating customer: "+ error)
      if(!error) console.log('Updated Customer.')
    })

    db.query(updateAccount, (error, result) => {
      if(error) console.log("Error updating account: "+ error)
      if(!error) {
        console.log('Updated Account.')
        res.send({ sucess: true, data: { email } })
      }
    })

  });
});
// --------------------------------------------------------  END EDIT PROFILE




//--------------------------------------------------------------------------SHIPPING ADDRESSS   -------    WORKING 95 %
app.post("/AddshippingAddress/", (req, res) =>
{
  const { token, address, city, zip, state,email,password } = req.body

    let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;

    db.query(getUserId , (error, result) => 
    {
      if(error) throw console.log('Error:' + error);
  
      const userId = result[0].id;
      console.log({ userId })
    
           // let sqlShippingAddress =  `insert into geekbook.ShippingAddress(shippingCustomerID, address, city, zip, state   ) values(last_insert_id() ,'${address}','${city}','${zip}','${state}')`;  */ 
    
   const sqlADDINGShippingAddress =  ` insert into geekbook.ShippingAddress(shippingCustomerID, address,       city,        zip,      state   )
                                                                 values(   '${userId}' ,'       ${address}','  ${city}','  ${zip}', '${state}')`; 

    db.query(sqlADDINGShippingAddress,function(err,result){
      if(err ) throw    console.log('An ERROR HAS OCCURED, the following is the error --' + err+'\n\n');
      console.log("1 a SHIPPING ADDRESS ----  record inserted");
    });
      res.end();
   //--------------------------------INSERTED NEW SHIPPING ADDRESS

  });

});





//--------------------------------------------------------------------------SHIPPING ADDRESSS
/*
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


*/

//------------------------------------------------------------------------------ ADD NEW CREDIT CARD 



//------------------------------------------------------------------------------ ADD NEW CREDIT CARD --- WORKING 95 %
app.post("/addcard/", (req, res) =>
{ 

console.log("IN THE CARD ")

  const { token,cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body
  

       let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;

       db.query(getUserId , (error, result) => 
       {
         if(error) throw console.log('Error:' + error);
     
         const userId = result[0].id;
         console.log({ userId })

/*
      let sqlCreditCard =  `insert into geekbook.Card (    cardCustomerID,    cardCustomerName,          cardNum,       securityNum,     expMonth,          expYear) 
                                              values(    '${userId}' ,     '${cardHolderfullName}','  ${cardNumber}',' ${cvCode}','    ${expityMonth}','   ${expityYear}' )`; 
*/
  
let sqlCreditCard =  `insert into geekbook.Card (      cardCustomerID,             cardCustomerName,         cardNum,       securityNum,     expMonth,               expYear)  
                                       values(      '${userId}' ,'             ${cardHolderfullName}','   ${cardNumber}','  ${cvCode}','    ${expityMonth}','   ${expityYear}' )`;
        
        
                                              db.query(sqlCreditCard,function(err,result){
          if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
          console.log("1 Credit card info record ADDED!!");
        });



        // this is INSERT FROM THE FIRST INSERT OF CARD
        /*
        let sqlCreditCard =  `insert into geekbook.Card (      cardCustomerID,             cardCustomerName,         cardNum,       securityNum,     expMonth,           expYear)  
                                                     values(      last_insert_id() ,'   ${cardHolderfullName}','${cardNumber}','${cvCode}','    ${expityMonth}','   ${expityYear}' )`; 
            db.query(sqlCreditCard,function(err,result){
              if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
              console.log("1 Credit card info record inserted");
            });  
*/
          res.end();
    });
});


/*

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


*/


app.post("/logout", (req, res) => 
{




      res.render('index')

});

// keep this last to not interfere
app.post('/:action', function (req, res) {
  if (req.param('action') === 'add') {
    console.log("adding")
    var code = req.body.code;
    var user = req.body.id;
    console.log("code is: " + code);
    console.log("id is "+ user);

    let sql = `INSERT INTO CartItem
    VALUES
    (${user} ,'${code}', 0, 1);`;

    // -------hardcoded user---------
    // let sql = `INSERT INTO CartItem
    // VALUES
    // (1 ,'${code}', 0, 1);`;
    
    let query = db.query(sql, (err, results) => {
      if (err) {
        console.log(sql);
      }

      res.send(results);
    });
  }
});