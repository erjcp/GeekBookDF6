const express = require("express"); 

const app = express(); 
var mysql = require("mysql"); 
var config = require("./config");
var expressValidator = require('express-validator');
var expressSession = require("express-session");

var crypto = require('crypto');
var rand = require('csprng');

const bcrypt = require('bcrypt');
const saltRounds = 10;



// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
/*  var user = mysql.Accounts({    local: {       username: String,        password: String    }  }); */
//  var db = require('../models');  ///-- DO NOT HAVE MODELS


var htmlcontroller = require("./controllers/htmlController"); 


var port = process.env.port || 3007; 
// app.use('/assets', express.static(__dirname + '/public')); // THIS IS FOR CSS CONNECTION

//set pug as view renderer
app.set("view engine", "pug"); 

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
app.use(expressValidator());
app.use(bodyparser.json());
//app.use(expressSession({ secret: 'masx', saveInitialized: false, resave: false})); // save initialize if true send it to sessionn storage even if un initialized

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



//LOGIN PAGE --------------------------------------------------LOGIN PAGE-----------------------------------LOGIN PAGE

app.post("/login", (req, res) => {
                                          
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
app.post("/register/", (req, res) =>
{
  
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





























