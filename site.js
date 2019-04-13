const express = require("express"); 

const app = express(); 
var mysql = require("mysql"); 
var config = require("./config");
var expressValidator = require('express-validator');
var expressSession = require("express-session");
var valid = require('card-validator');

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
    //-- create constants for input from textboxes                                      
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

// REGISTER PAGE-------------------------------------------------------------------REGISTER PAGE
app.post("/register/", (req, res) =>
{ 
   //-- create constants for input from textboxes
    const { userName, firstName, lastName, nickName, email, password,confirmationpassword, address, city, zip, state ,cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body
    console.log({password})
                               
    var hash;
   
    if (password != confirmationpassword) {
      //return res.end();
      res.render('/register/')
    
    }
    else
    {

        hash = bcrypt.hashSync(password, saltRounds)

    }
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
            
          res.render('index');
        
           
    });














//------------ EDIT--------------- EDIT   EDIT     EDIT         EDIT        EDIT    PROFILE PAGE-------------------------------------------------------------------EDIT PROFILE PAGE

  app.post( "/editUpdateAccount/" , (req, res) =>
  {  console.log('ADDING  AN UPDATED ACCOUNT INFORMATION  -------\n\n\n')
    //-- create constants for input from textboxes
    const { token, userName, firstName, lastName, nickName, email, password, address, city, zip, state } = req.body
    
    // selects ID from accounts table using a token
    let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;

    console.log('IN EDITINGACCOUNT SITE.JS -- HOPING THIS WORKS  \n\n')

   
    db.query(getUserId , (error, result) => {

                  if(error) throw console.log('Error:' + error);
              
                  const userId = result[0].id;
                  console.log({ userId })


                            //-------------------------------- UPDATE ACCOUNTS
                            let updateAccount =   `UPDATE   geekbook.Accounts
                            SET       userName = '${userName}',
                                      email = '${email}',
                                      pass =  '${password}'
                            WHERE id = '${userId}'`;
                      //---------------------------- UPDATE CUSTOMER
                            let updateCustomer =  `UPDATE   geekbook.Customer
                                        SET       firstName = '${firstName}', 
                                                  lastName  = '${lastName}',  
                                                  nickName  = '${nickName}'
                                        WHERE   CustId  = '${userId}'`;
                        //-------------------------------UPDATE BILLING ADDRESS
                            let updateBillingAddress = `UPDATE  geekbook.BillingAddress
                                                      SET     address =  '${address}',
                                                              city =  '${city}',  
                                                              zip  =  '${zip}',
                                                              state  =  '${state}'
                                                      WHERE  billingId =  '${userId}'`;
                        
                        
                        

                            db.query(updateAccount, (error, result) => {
                              if(error) console.log("Error updating account: "+ error)
                              if(!error) {
                                console.log('Updated Account.')
                                // res.send({ sucess: true, data: { email } })
                              }
                            })


                            db.query(updateCustomer, (error, result) => {
                              if(error) console.log("Error updating customer: "+ error)
                              if(!error) console.log('Updated Customer.')
                            })

                            db.query(updateBillingAddress, (error, result) => {
                            if(error) console.log("Error updating billing address: "+ error)
                            if(!error) console.log('Updated Billing Address.')
                          })
                
         });
         res.end();

  });
  // --------------------------------------------------------  END EDIT PROFILE




//--------------------------------------------------------------------------SHIPPING ADDRESSS   -------    WORKING 95 %
app.post("/AddshippingAddress/", (req, res) =>
          {
              //-- create constants for input from textboxes
              const { token, address, city, zip, state} = req.body
              let userId

                // selects ID from accounts table using a token  which is used to insert new address 
                let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;

              console.log('ABOUT TO INSERT THE ID-------\n')
              console.log(getUserId +'\n\n\n')

              db.query(getUserId , (error, result) => 
              {
                if(error) throw console.log('Error:--we have an errof in Adding new Address' + error + '\n\n');
                  const userId = result[0].id;
                  console.log('PASSED RESULT VAULE of  '+ { userId } +'    TO  --userId  --\n')

                  //console.log({ userId })

                  const sqlADDINGShippingAddress = `insert into geekbook.ShippingAddress(shippingCustomerID, address,       city,        zip,      state   )
                  values(   '${userId}' ,'   ${address}','  ${city}','  ${zip}', '${state}')`; 

                  db.query(sqlADDINGShippingAddress,function(err,result){
                  if(err ) throw    console.log('An ERROR HAS OCCURED, the following is the error --' + err+'\n\n');
                  console.log("1 a SHIPPING ADDRESS ----  record inserted");
                  });
            });
       res.send();
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
  console.log("IN THE CARD --- ")
     //-- create constants for input from textboxes
    const { token,cardHolderfullName,cardNumber,cvCode,expityMonth,expityYear} = req.body
/*
      ccardnumber = cardNumber.replace(/\s+/g, '');
      var sixteenDigits = /^\d{16}$/;
      if(!sixteenDigits.test(cardNumber))
      {
          console.log("Credit Card Number Not Valid");
          return false;
      }

      //validate expiration date
      var today;
      var futureDate;



      
  // Validating Expiry Date
  
  var splitDate = expirydate.split('/');
  if (splitDate.length > 1) 
  {
    var month= splitDate[0];
    var year = splitDate[1];
    today = new Date();
    dayToTest = new Date();
    dayToTest.setFullYear(year, month, 1);
    dayToTest.setFullYear


    if (dayToTest < today) 
    {
      console.log("Expiration Date is not valid");
      return false;
    }
  } 
  else 
  {
    console.log("Expiration Date is not valid");
    return false;
  }

  // Validate Security Code
  securitycode = securitycode.replace(/\s+/g, '');
  var threeDigits = /^\d{3}$/;
  if (!threeDigits.test(securitycode))
  {
    console.log("Security Code Not Valid");
    return false;
  }
  return true;
  */

         // selects ID from accounts table using a token which is used to make inserts
        let getUserId = `SELECT id FROM geekbook.Accounts WHERE email = '${token}'`;
         db.query(getUserId , (error, result) => 
         {
            if(error) throw console.log('Error:' + error);
            const userId = result[0].id;
            
            let sqlCreditCard =  `insert into geekbook.Card (cardCustomerID,   cardCustomerName,       cardNum,       securityNum,   expMonth,         expYear)  
                                                      values('${userId}' ,'  ${cardHolderfullName}','${cardNumber}','${cvCode}','  ${expityMonth}',' ${expityYear}' )`;
                            db.query(sqlCreditCard,function(err,result){
                            if(err ) throw    console.log('An ERROR HAS occurred, the following is the error --' + err+'\n\n');
                            console.log("1 Credit card info record ADDED!!");
          });
              res.end();
      });
});

//----------------------------------------------------------LOG OUT
app.post("/logout", (req, res) => 
{
         res.render('index')
});
//------------------------------------------------------------ END OF PROFILE ---------------------------------------------------------
































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





























